import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CurrencyCode,
  Expense,
  ExpenseCategory,
  JournalEntry,
  JournalMood,
  MutationItem,
  NomadPersistedState,
  PackingCategory,
  PackingItem,
  PaymentMethod,
  Trip,
  Waypoint,
  WaypointStatus,
  WaypointType,
  WeatherTag,
} from "./types";
import { createInitialState, SEED_TRIP_ID } from "./seed";
import { convertCurrency, DEFAULT_CURRENCIES } from "./currencies";

const STORAGE_KEY = "@nomadlog/state/v1";

interface AppContextValue {
  hydrated: boolean;
  state: NomadPersistedState;
  activeTrip: Trip | undefined;
  activeTripExpenses: Expense[];
  activeTripWaypoints: Waypoint[];
  activeTripJournal: JournalEntry[];
  activeTripPacking: PackingItem[];
  totalSpentBase: number;
  remainingBudgetBase: number;
  budgetUsagePercent: number;
  packingProgress: {
    total: number;
    packed: number;
    percentage: number;
    totalWeightKg: number;
  };
  isPro: boolean;

  // Actions
  addExpense: (expense: {
    category: ExpenseCategory;
    amount: number;
    currency: CurrencyCode;
    description: string;
    locationName: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => void;
  deleteExpense: (id: string) => void;

  addWaypoint: (waypoint: {
    dayIndex: number;
    date: string;
    time: string;
    title: string;
    type: WaypointType;
    locationName: string;
    elevationMeters?: number;
    distanceKm?: number;
    durationMinutes?: number;
    notes?: string;
  }) => void;
  toggleWaypointStatus: (id: string) => void;
  deleteWaypoint: (id: string) => void;

  addJournalEntry: (entry: {
    title: string;
    content: string;
    location: string;
    altitudeMeters?: number;
    mood: JournalMood;
    weather: WeatherTag;
    photos: string[];
    tags: string[];
  }) => void;
  deleteJournalEntry: (id: string) => void;

  togglePackingItem: (id: string) => void;
  addPackingItem: (item: {
    category: PackingCategory;
    name: string;
    essential: boolean;
    weightGrams?: number;
    notes?: string;
  }) => void;
  deletePackingItem: (id: string) => void;

  createTrip: (trip: Omit<Trip, "id">) => { success: boolean; message?: string };
  setActiveTrip: (tripId: string) => void;
  deleteTrip: (tripId: string) => void;

  upgradeToPro: () => void;
  downgradeToFree: () => void;
  toggleOfflineMode: () => void;
  syncMutationQueue: () => Promise<number>;
  refreshFxRates: () => void;
  resetToSeed: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<NomadPersistedState>(createInitialState());
  const [hydrated, setHydrated] = useState(false);

  // Carrega estado persistido
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && mounted) {
          const parsed = JSON.parse(raw) as NomadPersistedState;
          setState(parsed);
        }
      } catch (err) {
        console.warn("[AppStore] Falha ao hidratar estado local:", err);
      } finally {
        if (mounted) setHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Salva no AsyncStorage após cada mutação
  const persistState = useCallback((newState: NomadPersistedState) => {
    setState(newState);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState)).catch((err) => {
      console.warn("[AppStore] Erro ao persistir estado:", err);
    });
  }, []);

  // Adiciona mutação na fila offline
  const enqueueMutation = useCallback(
    (
      action: MutationItem["action"],
      entity: MutationItem["entity"],
      data: any,
      currentState: NomadPersistedState
    ): MutationItem[] => {
      const item: MutationItem = {
        id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        action,
        entity,
        data,
      };
      return [item, ...currentState.mutationQueue];
    },
    []
  );

  // Viagem ativa
  const activeTrip = useMemo(() => {
    return (
      state.trips.find((t) => t.id === state.activeTripId) || state.trips[0]
    );
  }, [state.trips, state.activeTripId]);

  // Itens da viagem ativa
  const activeTripExpenses = useMemo(() => {
    if (!activeTrip) return [];
    return state.expenses.filter((e) => e.tripId === activeTrip.id);
  }, [state.expenses, activeTrip]);

  const activeTripWaypoints = useMemo(() => {
    if (!activeTrip) return [];
    return state.waypoints
      .filter((w) => w.tripId === activeTrip.id)
      .sort((a, b) => a.dayIndex - b.dayIndex || a.time.localeCompare(b.time));
  }, [state.waypoints, activeTrip]);

  const activeTripJournal = useMemo(() => {
    if (!activeTrip) return [];
    return state.journalEntries
      .filter((j) => j.tripId === activeTrip.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [state.journalEntries, activeTrip]);

  const activeTripPacking = useMemo(() => {
    if (!activeTrip) return [];
    return state.packingItems.filter((p) => p.tripId === activeTrip.id);
  }, [state.packingItems, activeTrip]);

  // Cálculos financeiros
  const totalSpentBase = useMemo(() => {
    return activeTripExpenses.reduce(
      (sum, item) => sum + item.convertedAmountBase,
      0
    );
  }, [activeTripExpenses]);

  const remainingBudgetBase = useMemo(() => {
    if (!activeTrip) return 0;
    return activeTrip.totalBudgetBase - totalSpentBase;
  }, [activeTrip, totalSpentBase]);

  const budgetUsagePercent = useMemo(() => {
    if (!activeTrip || activeTrip.totalBudgetBase === 0) return 0;
    return Math.min(100, Math.round((totalSpentBase / activeTrip.totalBudgetBase) * 100));
  }, [activeTrip, totalSpentBase]);

  // Progresso do Checklist
  const packingProgress = useMemo(() => {
    const total = activeTripPacking.length;
    const packed = activeTripPacking.filter((p) => p.packed).length;
    const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
    const totalGrams = activeTripPacking
      .filter((p) => p.packed)
      .reduce((sum, p) => sum + (p.weightGrams || 0), 0);
    const totalWeightKg = Number((totalGrams / 1000).toFixed(2));

    return { total, packed, percentage, totalWeightKg };
  }, [activeTripPacking]);

  const isPro = state.subscription.plan === "pro";

  // --- ACTIONS ---

  const addExpense = useCallback(
    (expenseData: {
      category: ExpenseCategory;
      amount: number;
      currency: CurrencyCode;
      description: string;
      locationName: string;
      paymentMethod: PaymentMethod;
      notes?: string;
    }) => {
      if (!activeTrip) return;

      const convertedAmountBase = Number(
        convertCurrency(
          expenseData.amount,
          expenseData.currency,
          activeTrip.baseCurrency,
          state.rates
        ).toFixed(2)
      );

      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const timeStr = now.toTimeString().substring(0, 5);

      const newExpense: Expense = {
        id: `exp_${Date.now()}`,
        tripId: activeTrip.id,
        date: dateStr,
        time: timeStr,
        category: expenseData.category,
        amount: expenseData.amount,
        currency: expenseData.currency,
        convertedAmountBase,
        description: expenseData.description,
        locationName: expenseData.locationName || "Localização offline",
        paymentMethod: expenseData.paymentMethod,
        notes: expenseData.notes,
        synced: false,
      };

      const newQueue = enqueueMutation("create", "expense", newExpense, state);
      persistState({
        ...state,
        expenses: [newExpense, ...state.expenses],
        mutationQueue: newQueue,
      });
    },
    [activeTrip, state, enqueueMutation, persistState]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      const newQueue = enqueueMutation("delete", "expense", { id }, state);
      persistState({
        ...state,
        expenses: state.expenses.filter((e) => e.id !== id),
        mutationQueue: newQueue,
      });
    },
    [state, enqueueMutation, persistState]
  );

  const addWaypoint = useCallback(
    (waypointData: {
      dayIndex: number;
      date: string;
      time: string;
      title: string;
      type: WaypointType;
      locationName: string;
      elevationMeters?: number;
      distanceKm?: number;
      durationMinutes?: number;
      notes?: string;
    }) => {
      if (!activeTrip) return;

      const newWp: Waypoint = {
        id: `wp_${Date.now()}`,
        tripId: activeTrip.id,
        ...waypointData,
        status: "pending",
      };

      const newQueue = enqueueMutation("create", "waypoint", newWp, state);
      persistState({
        ...state,
        waypoints: [...state.waypoints, newWp],
        mutationQueue: newQueue,
      });
    },
    [activeTrip, state, enqueueMutation, persistState]
  );

  const toggleWaypointStatus = useCallback(
    (id: string) => {
      const nextStatusMap: Record<WaypointStatus, WaypointStatus> = {
        pending: "in_progress",
        in_progress: "done",
        done: "pending",
      };

      const updated = state.waypoints.map((wp) => {
        if (wp.id === id) {
          return { ...wp, status: nextStatusMap[wp.status] };
        }
        return wp;
      });

      const target = updated.find((w) => w.id === id);
      const newQueue = enqueueMutation("update", "waypoint", target, state);
      persistState({
        ...state,
        waypoints: updated,
        mutationQueue: newQueue,
      });
    },
    [state, enqueueMutation, persistState]
  );

  const deleteWaypoint = useCallback(
    (id: string) => {
      const newQueue = enqueueMutation("delete", "waypoint", { id }, state);
      persistState({
        ...state,
        waypoints: state.waypoints.filter((w) => w.id !== id),
        mutationQueue: newQueue,
      });
    },
    [state, enqueueMutation, persistState]
  );

  const addJournalEntry = useCallback(
    (entryData: {
      title: string;
      content: string;
      location: string;
      altitudeMeters?: number;
      mood: JournalMood;
      weather: WeatherTag;
      photos: string[];
      tags: string[];
    }) => {
      if (!activeTrip) return;
      const now = new Date();

      const newEntry: JournalEntry = {
        id: `jn_${Date.now()}`,
        tripId: activeTrip.id,
        date: now.toISOString().split("T")[0],
        time: now.toTimeString().substring(0, 5),
        createdAt: now.toISOString(),
        ...entryData,
      };

      const newQueue = enqueueMutation("create", "journal", newEntry, state);
      persistState({
        ...state,
        journalEntries: [newEntry, ...state.journalEntries],
        mutationQueue: newQueue,
      });
    },
    [activeTrip, state, enqueueMutation, persistState]
  );

  const deleteJournalEntry = useCallback(
    (id: string) => {
      const newQueue = enqueueMutation("delete", "journal", { id }, state);
      persistState({
        ...state,
        journalEntries: state.journalEntries.filter((j) => j.id !== id),
        mutationQueue: newQueue,
      });
    },
    [state, enqueueMutation, persistState]
  );

  const togglePackingItem = useCallback(
    (id: string) => {
      const updated = state.packingItems.map((p) => {
        if (p.id === id) return { ...p, packed: !p.packed };
        return p;
      });
      const target = updated.find((p) => p.id === id);
      const newQueue = enqueueMutation("update", "packing", target, state);
      persistState({
        ...state,
        packingItems: updated,
        mutationQueue: newQueue,
      });
    },
    [state, enqueueMutation, persistState]
  );

  const addPackingItem = useCallback(
    (itemData: {
      category: PackingCategory;
      name: string;
      essential: boolean;
      weightGrams?: number;
      notes?: string;
    }) => {
      if (!activeTrip) return;

      const newItem: PackingItem = {
        id: `pk_${Date.now()}`,
        tripId: activeTrip.id,
        packed: false,
        ...itemData,
      };

      const newQueue = enqueueMutation("create", "packing", newItem, state);
      persistState({
        ...state,
        packingItems: [...state.packingItems, newItem],
        mutationQueue: newQueue,
      });
    },
    [activeTrip, state, enqueueMutation, persistState]
  );

  const deletePackingItem = useCallback(
    (id: string) => {
      const newQueue = enqueueMutation("delete", "packing", { id }, state);
      persistState({
        ...state,
        packingItems: state.packingItems.filter((p) => p.id !== id),
        mutationQueue: newQueue,
      });
    },
    [state, enqueueMutation, persistState]
  );

  const createTrip = useCallback(
    (tripData: Omit<Trip, "id">): { success: boolean; message?: string } => {
      // Regra de Negócio Freemium: Apenas 1 viagem ativa no plano Free
      if (!isPro && state.trips.length >= 1) {
        return {
          success: false,
          message:
            "O plano gratuito permite 1 viagem ativa por vez. Faça o upgrade para o Mochileiro Pro para viagens ilimitadas simultâneas!",
        };
      }

      const newTrip: Trip = {
        id: `trip_${Date.now()}`,
        ...tripData,
      };

      const newQueue = enqueueMutation("create", "trip", newTrip, state);
      persistState({
        ...state,
        trips: [...state.trips, newTrip],
        activeTripId: newTrip.id,
        mutationQueue: newQueue,
      });

      return { success: true };
    },
    [isPro, state, enqueueMutation, persistState]
  );

  const setActiveTrip = useCallback(
    (tripId: string) => {
      persistState({
        ...state,
        activeTripId: tripId,
      });
    },
    [state, persistState]
  );

  const deleteTrip = useCallback(
    (tripId: string) => {
      const remainingTrips = state.trips.filter((t) => t.id !== tripId);
      const nextActiveId = remainingTrips[0]?.id || "";

      persistState({
        ...state,
        trips: remainingTrips,
        activeTripId: nextActiveId,
        expenses: state.expenses.filter((e) => e.tripId !== tripId),
        waypoints: state.waypoints.filter((w) => w.tripId !== tripId),
        journalEntries: state.journalEntries.filter((j) => j.tripId !== tripId),
        packingItems: state.packingItems.filter((p) => p.tripId !== tripId),
      });
    },
    [state, persistState]
  );

  const upgradeToPro = useCallback(() => {
    persistState({
      ...state,
      subscription: {
        plan: "pro",
        unlimitedTrips: true,
        encryptedCloudBackup: true,
        offlineFxHistory: true,
        exportReports: true,
        activeUntil: "Vitalício (Acesso Completo)",
      },
    });
  }, [state, persistState]);

  const downgradeToFree = useCallback(() => {
    persistState({
      ...state,
      subscription: {
        plan: "free",
        unlimitedTrips: false,
        encryptedCloudBackup: false,
        offlineFxHistory: false,
        exportReports: false,
      },
    });
  }, [state, persistState]);

  const toggleOfflineMode = useCallback(() => {
    persistState({
      ...state,
      isOfflineMode: !state.isOfflineMode,
    });
  }, [state, persistState]);

  const syncMutationQueue = useCallback(async (): Promise<number> => {
    const count = state.mutationQueue.length;
    // Simula sincronização com nuvem
    await new Promise((r) => setTimeout(r, 600));

    persistState({
      ...state,
      mutationQueue: [],
      lastSyncTimestamp: Date.now(),
      expenses: state.expenses.map((e) => ({ ...e, synced: true })),
    });

    return count;
  }, [state, persistState]);

  const refreshFxRates = useCallback(() => {
    // Atualiza o snapshot com ligeira variação aleatória simulando o mercado real
    const newRates = { ...state.rates };
    newRates.BRL = Number((5.85 + (Math.random() * 0.1 - 0.05)).toFixed(2));
    newRates.THB = Number((34.5 + (Math.random() * 0.4 - 0.2)).toFixed(2));
    newRates.EUR = Number((0.92 + (Math.random() * 0.02 - 0.01)).toFixed(3));

    persistState({
      ...state,
      rates: newRates,
      ratesSnapshotTimestamp: Date.now(),
    });
  }, [state, persistState]);

  const resetToSeed = useCallback(async () => {
    const initial = createInitialState();
    persistState(initial);
  }, [persistState]);

  const value = useMemo(
    () => ({
      hydrated,
      state,
      activeTrip,
      activeTripExpenses,
      activeTripWaypoints,
      activeTripJournal,
      activeTripPacking,
      totalSpentBase,
      remainingBudgetBase,
      budgetUsagePercent,
      packingProgress,
      isPro,
      addExpense,
      deleteExpense,
      addWaypoint,
      toggleWaypointStatus,
      deleteWaypoint,
      addJournalEntry,
      deleteJournalEntry,
      togglePackingItem,
      addPackingItem,
      deletePackingItem,
      createTrip,
      setActiveTrip,
      deleteTrip,
      upgradeToPro,
      downgradeToFree,
      toggleOfflineMode,
      syncMutationQueue,
      refreshFxRates,
      resetToSeed,
    }),
    [
      hydrated,
      state,
      activeTrip,
      activeTripExpenses,
      activeTripWaypoints,
      activeTripJournal,
      activeTripPacking,
      totalSpentBase,
      remainingBudgetBase,
      budgetUsagePercent,
      packingProgress,
      isPro,
      addExpense,
      deleteExpense,
      addWaypoint,
      toggleWaypointStatus,
      deleteWaypoint,
      addJournalEntry,
      deleteJournalEntry,
      togglePackingItem,
      addPackingItem,
      deletePackingItem,
      createTrip,
      setActiveTrip,
      deleteTrip,
      upgradeToPro,
      downgradeToFree,
      toggleOfflineMode,
      syncMutationQueue,
      refreshFxRates,
      resetToSeed,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppStore(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppStore deve ser utilizado dentro de AppStoreProvider");
  }
  return ctx;
}

