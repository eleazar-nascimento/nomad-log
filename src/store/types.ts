export type CurrencyCode =
  | "BRL"
  | "USD"
  | "EUR"
  | "GBP"
  | "THB"
  | "VND"
  | "JPY"
  | "ARS"
  | "CLP"
  | "COP"
  | "PEN"
  | "BOB"
  | "IDR"
  | "MXN";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateToUSD: number; // Ex: USD/BRL = 5.85, USD/THB = 34.50
}

export type ExpenseCategory =
  | "food"
  | "transport"
  | "stay"
  | "activity"
  | "gear"
  | "emergency"
  | "other";

export type PaymentMethod = "cash" | "card" | "wise" | "crypto";

export interface Expense {
  id: string;
  tripId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  category: ExpenseCategory;
  amount: number; // valor na moeda original
  currency: CurrencyCode;
  convertedAmountBase: number; // valor convertido na moeda base da viagem
  description: string;
  locationName: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  synced: boolean;
}

export type WaypointType = "flight" | "bus" | "train" | "trek" | "hostel" | "sight" | "food";
export type WaypointStatus = "pending" | "in_progress" | "done";

export interface Waypoint {
  id: string;
  tripId: string;
  dayIndex: number; // Dia 1, Dia 2, etc.
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  title: string;
  type: WaypointType;
  locationName: string;
  elevationMeters?: number;
  distanceKm?: number;
  durationMinutes?: number;
  status: WaypointStatus;
  notes?: string;
  lat?: number;
  lng?: number;
}

export type JournalMood = "amazed" | "tired_happy" | "adventurous" | "peaceful" | "challenged";
export type WeatherTag = "sunny" | "rainy" | "foggy" | "cold" | "stormy";

export interface JournalEntry {
  id: string;
  tripId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  title: string;
  content: string;
  location: string;
  altitudeMeters?: number;
  mood: JournalMood;
  weather: WeatherTag;
  photos: string[];
  tags: string[];
  createdAt: string;
}

export type PackingCategory = "documentos" | "equipamentos" | "roupas" | "farmacia" | "outros";

export interface PackingItem {
  id: string;
  tripId: string;
  category: PackingCategory;
  name: string;
  packed: boolean;
  essential: boolean;
  weightGrams?: number;
  notes?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  countries: string[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  coverImage: string;
  baseCurrency: CurrencyCode;
  localCurrencies: CurrencyCode[];
  dailyBudgetBase: number;
  totalBudgetBase: number;
  status: "active" | "planned" | "completed";
  notes?: string;
}

export interface MutationItem {
  id: string;
  timestamp: number;
  action: "create" | "update" | "delete";
  entity: "expense" | "waypoint" | "journal" | "packing" | "trip";
  data: any;
}

export interface UserSubscription {
  plan: "free" | "pro";
  activeUntil?: string;
  unlimitedTrips: boolean;
  encryptedCloudBackup: boolean;
  offlineFxHistory: boolean;
  exportReports: boolean;
}

export interface NomadPersistedState {
  version: number;
  locale: "pt" | "en";
  subscription: UserSubscription;
  activeTripId: string;
  trips: Trip[];
  expenses: Expense[];
  waypoints: Waypoint[];
  journalEntries: JournalEntry[];
  packingItems: PackingItem[];
  ratesSnapshotTimestamp: number;
  rates: Record<CurrencyCode, number>;
  isOfflineMode: boolean; // toggle simulador de sem sinal / avião
  mutationQueue: MutationItem[];
  lastSyncTimestamp?: number;
}

