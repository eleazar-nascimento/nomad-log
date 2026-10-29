import { create } from "zustand";
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
import { createInitialState } from "./seed";
import { convertCurrency } from "./currencies";
import { fetchLiveExchangeRates } from "@/services/fxApi";

const STORAGE_KEY = "@nomadlog/state/v1";

export interface NomadStoreState extends NomadPersistedState {
  hydrated: boolean;
  setHydrated: (h: boolean) => void;

  // Actions
  addExpense: (data: {
    category: ExpenseCategory;
    amount: number;
    currency: CurrencyCode;
    description: string;
    locationName: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => void;
  deleteExpense: (id: string) => void;

  addWaypoint: (data: {
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

  addJournalEntry: (data: {
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
  addPackingItem: (data: {
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
  hydrateFromStorage: () => Promise<void>;
}

function createMutation(
  action: MutationItem["action"],
  entity: MutationItem["entity"],
  data: any,
  currentQueue: MutationItem[]
): MutationItem[] {
  const item: MutationItem = {
    id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    action,
    entity,
    data,
  };
  return [item, ...currentQueue];
}

function saveToAsyncStorage(state: NomadPersistedState) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((err) => {
    console.warn("[Zustand Store] Erro ao persistir no AsyncStorage:", err);
  });
}

const initial = createInitialState();

export const useNomadStore = create<NomadStoreState>((set, get) => ({
  ...initial,
  hydrated: false,
  setHydrated: (h) => set({ hydrated: h }),

  hydrateFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as NomadPersistedState;
        set({ ...parsed, hydrated: true });
        return;
      }
    } catch (err) {
      console.warn("[Zustand] Falha ao hidratar do armazenamento:", err);
    }
    set({ hydrated: true });
  },

  addExpense: (expenseData) => {
    const s = get();
    const activeTrip = s.trips.find((t) => t.id === s.activeTripId) || s.trips[0];
    if (!activeTrip) return;

    const convertedAmountBase = Number(
      convertCurrency(
        expenseData.amount,
        expenseData.currency,
        activeTrip.baseCurrency,
        s.rates
      ).toFixed(2)
    );

    const now = new Date();
    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      tripId: activeTrip.id,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().substring(0, 5),
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

    const newQueue = createMutation("create", "expense", newExpense, s.mutationQueue);
    const updatedExpenses = [newExpense, ...s.expenses];

    set({ expenses: updatedExpenses, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });
  },

  deleteExpense: (id) => {
    const s = get();
    const newQueue = createMutation("delete", "expense", { id }, s.mutationQueue);
    const updated = s.expenses.filter((e) => e.id !== id);
    set({ expenses: updated, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });
  },

  addWaypoint: (wpData) => {
    const s = get();
    const activeTrip = s.trips.find((t) => t.id === s.activeTripId) || s.trips[0];
    if (!activeTrip) return;

    const newWp: Waypoint = {
      id: `wp_${Date.now()}`,
      tripId: activeTrip.id,
      ...wpData,
      status: "pending",
    };

    const newQueue = createMutation("create", "waypoint", newWp, s.mutationQueue);
    const updated = [...s.waypoints, newWp];
    set({ waypoints: updated, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });
  },

  toggleWaypointStatus: (id) => {
    const s = get();
    const nextStatusMap: Record<WaypointStatus, WaypointStatus> = {
      pending: "in_progress",
      in_progress: "done",
      done: "pending",
    };

    const updated = s.waypoints.map((wp) => {
      if (wp.id === id) {
        return { ...wp, status: nextStatusMap[wp.status] };
      }
      return wp;
    });

    const target = updated.find((w) => w.id === id);
    const newQueue = createMutation("update", "waypoint", target, s.mutationQueue);
    set({ waypoints: updated, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });
  },

  deleteWaypoint: (id) => {
    const s = get();
    const newQueue = createMutation("delete", "waypoint", { id }, s.mutationQueue);
    const updated = s.waypoints.filter((w) => w.id !== id);
    set({ waypoints: updated, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });
  },

  addJournalEntry: (entryData) => {
    const s = get();
    const activeTrip = s.trips.find((t) => t.id === s.activeTripId) || s.trips[0];
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

    const newQueue = createMutation("create", "journal", newEntry, s.mutationQueue);
    const updated = [newEntry, ...s.journalEntries];
    set({ journalEntries: updated, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });
  },

  deleteJournalEntry: (id) => {
    const s = get();
    const newQueue = createMutation("delete", "journal", { id }, s.mutationQueue);
    const updated = s.journalEntries.filter((j) => j.id !== id);
    set({ journalEntries: updated, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });
  },

  togglePackingItem: (id) => {
    const s = get();
    const updated = s.packingItems.map((p) => {
      if (p.id === id) return { ...p, packed: !p.packed };
      return p;
    });
    const target = updated.find((p) => p.id === id);
    const newQueue = createMutation("update", "packing", target, s.mutationQueue);
    set({ packingItems: updated, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });
  },

  addPackingItem: (itemData) => {
    const s = get();
    const activeTrip = s.trips.find((t) => t.id === s.activeTripId) || s.trips[0];
    if (!activeTrip) return;

    const newItem: PackingItem = {
      id: `pk_${Date.now()}`,
      tripId: activeTrip.id,
      packed: false,
      ...itemData,
    };

    const newQueue = createMutation("create", "packing", newItem, s.mutationQueue);
    const updated = [...s.packingItems, newItem];
    set({ packingItems: updated, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });
  },

  deletePackingItem: (id) => {
    const s = get();
    const newQueue = createMutation("delete", "packing", { id }, s.mutationQueue);
    const updated = s.packingItems.filter((p) => p.id !== id);
    set({ packingItems: updated, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });
  },

  createTrip: (tripData) => {
    const s = get();
    const isPro = s.subscription.plan === "pro";
    if (!isPro && s.trips.length >= 1) {
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

    const newQueue = createMutation("create", "trip", newTrip, s.mutationQueue);
    const updatedTrips = [...s.trips, newTrip];
    set({ trips: updatedTrips, activeTripId: newTrip.id, mutationQueue: newQueue });
    saveToAsyncStorage({ ...get() });

    return { success: true };
  },

  setActiveTrip: (tripId) => {
    set({ activeTripId: tripId });
    saveToAsyncStorage({ ...get() });
  },

  deleteTrip: (tripId) => {
    const s = get();
    const remainingTrips = s.trips.filter((t) => t.id !== tripId);
    const nextActiveId = remainingTrips[0]?.id || "";

    set({
      trips: remainingTrips,
      activeTripId: nextActiveId,
      expenses: s.expenses.filter((e) => e.tripId !== tripId),
      waypoints: s.waypoints.filter((w) => w.tripId !== tripId),
      journalEntries: s.journalEntries.filter((j) => j.tripId !== tripId),
      packingItems: s.packingItems.filter((p) => p.tripId !== tripId),
    });
    saveToAsyncStorage({ ...get() });
  },

  upgradeToPro: () => {
    set({
      subscription: {
        plan: "pro",
        unlimitedTrips: true,
        encryptedCloudBackup: true,
        offlineFxHistory: true,
        exportReports: true,
        activeUntil: "Vitalício (Acesso Completo)",
      },
    });
    saveToAsyncStorage({ ...get() });
  },

  downgradeToFree: () => {
    set({
      subscription: {
        plan: "free",
        unlimitedTrips: false,
        encryptedCloudBackup: false,
        offlineFxHistory: false,
        exportReports: false,
      },
    });
    saveToAsyncStorage({ ...get() });
  },

  toggleOfflineMode: () => {
    const s = get();
    const nextMode = !s.isOfflineMode;
    set({ isOfflineMode: nextMode });
    saveToAsyncStorage({ ...get() });

    // Se saiu do modo offline (conectou à internet), busca cotações da API em background
    if (!nextMode) {
      get().refreshFxRates();
    }
  },

  syncMutationQueue: async () => {
    const s = get();
    const count = s.mutationQueue.length;
    await new Promise((r) => setTimeout(r, 600));

    set({
      mutationQueue: [],
      lastSyncTimestamp: Date.now(),
      expenses: s.expenses.map((e) => ({ ...e, synced: true })),
    });
    saveToAsyncStorage({ ...get() });
    return count;
  },

  refreshFxRates: async () => {
    const s = get();
    try {
      const result = await fetchLiveExchangeRates(s.rates);
      if (result.success && result.rates) {
        set({
          rates: result.rates,
          ratesSnapshotTimestamp: result.timestamp,
        });
        saveToAsyncStorage({ ...get() });
        return;
      }
    } catch (err) {
      console.warn("[Store] Erro ao sincronizar cotações:", err);
    }

    // Fallback gracioso offline
    const fallbackRates = { ...s.rates };
    fallbackRates.BRL = Number((fallbackRates.BRL + (Math.random() * 0.04 - 0.02)).toFixed(2));
    set({
      rates: fallbackRates,
      ratesSnapshotTimestamp: Date.now(),
    });
    saveToAsyncStorage({ ...get() });
  },

  resetToSeed: async () => {
    const s = createInitialState();
    set({ ...s, hydrated: true });
    saveToAsyncStorage(s);
  },
}));

