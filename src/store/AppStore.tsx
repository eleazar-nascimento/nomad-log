import React, { useEffect, useMemo } from "react";
import {
  CurrencyCode,
  Expense,
  ExpenseCategory,
  JournalEntry,
  JournalMood,
  PackingCategory,
  PackingItem,
  PaymentMethod,
  Trip,
  Waypoint,
  WaypointType,
  WeatherTag,
} from "./types";
import { useNomadStore } from "./useNomadStore";

interface AppContextValue {
  hydrated: boolean;
  state: ReturnType<typeof useNomadStore.getState>;
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
  locale: "pt" | "en";
  setLocale: (l: "pt" | "en") => void;

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
    estimatedCost?: number;
    estimatedCurrency?: CurrencyCode;
    lat?: number;
    lng?: number;
  }) => void;
  toggleWaypointStatus: (id: string) => void;
  deleteWaypoint: (id: string) => void;
  moveWaypointToDay: (id: string, newDayIndex: number) => void;
  shiftWaypointTime: (id: string, deltaMinutes: number) => void;
  linkExpenseToWaypoint: (waypointId: string, expenseId: string) => void;

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

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const hydrateFromStorage = useNomadStore((s) => s.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return <>{children}</>;
};

export function useAppStore(): AppContextValue {
  const store = useNomadStore();

  const activeTrip = useMemo(() => {
    return (
      store.trips.find((t) => t.id === store.activeTripId) || store.trips[0]
    );
  }, [store.trips, store.activeTripId]);

  const activeTripExpenses = useMemo(() => {
    if (!activeTrip) return [];
    return store.expenses.filter((e) => e.tripId === activeTrip.id);
  }, [store.expenses, activeTrip]);

  const activeTripWaypoints = useMemo(() => {
    if (!activeTrip) return [];
    return store.waypoints
      .filter((w) => w.tripId === activeTrip.id)
      .sort((a, b) => a.dayIndex - b.dayIndex || a.time.localeCompare(b.time));
  }, [store.waypoints, activeTrip]);

  const activeTripJournal = useMemo(() => {
    if (!activeTrip) return [];
    return store.journalEntries
      .filter((j) => j.tripId === activeTrip.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [store.journalEntries, activeTrip]);

  const activeTripPacking = useMemo(() => {
    if (!activeTrip) return [];
    return store.packingItems.filter((p) => p.tripId === activeTrip.id);
  }, [store.packingItems, activeTrip]);

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
    return Math.min(
      100,
      Math.round((totalSpentBase / activeTrip.totalBudgetBase) * 100)
    );
  }, [activeTrip, totalSpentBase]);

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

  const isPro = store.subscription.plan === "pro";

  return {
    hydrated: store.hydrated,
    state: store,
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
    locale: store.locale || "pt",
    setLocale: store.setLocale,
    addExpense: store.addExpense,
    deleteExpense: store.deleteExpense,
    addWaypoint: store.addWaypoint,
    toggleWaypointStatus: store.toggleWaypointStatus,
    deleteWaypoint: store.deleteWaypoint,
    moveWaypointToDay: store.moveWaypointToDay,
    shiftWaypointTime: store.shiftWaypointTime,
    linkExpenseToWaypoint: store.linkExpenseToWaypoint,
    addJournalEntry: store.addJournalEntry,
    deleteJournalEntry: store.deleteJournalEntry,
    togglePackingItem: store.togglePackingItem,
    addPackingItem: store.addPackingItem,
    deletePackingItem: store.deletePackingItem,
    createTrip: store.createTrip,
    setActiveTrip: store.setActiveTrip,
    deleteTrip: store.deleteTrip,
    upgradeToPro: store.upgradeToPro,
    downgradeToFree: store.downgradeToFree,
    toggleOfflineMode: store.toggleOfflineMode,
    syncMutationQueue: store.syncMutationQueue,
    refreshFxRates: store.refreshFxRates,
    resetToSeed: store.resetToSeed,
  };
}
