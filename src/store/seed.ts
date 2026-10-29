import {
  CurrencyCode,
  Expense,
  JournalEntry,
  NomadPersistedState,
  PackingItem,
  Trip,
  Waypoint,
} from "./types";
import { convertCurrency, DEFAULT_CURRENCIES } from "./currencies";

export const SEED_TRIP_ID = "trip_sea_2026";

export const INITIAL_TRIP: Trip = {
  id: SEED_TRIP_ID,
  title: "Mochilão Sudeste Asiático: Templos & Trilhas",
  destination: "Tailândia & Vietnã",
  countries: ["Tailândia", "Vietnã"],
  startDate: "2026-11-01",
  endDate: "2026-11-20",
  coverImage:
    "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
  baseCurrency: "BRL",
  localCurrencies: ["THB", "VND", "USD"],
  dailyBudgetBase: 220, // R$ 220 / dia
  totalBudgetBase: 4400, // R$ 4.400 no total
  status: "active",
  notes: "Viajando leve apenas com mochila 45L. Roteiro sem roaming móvel ativado.",
};

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "exp_1",
    tripId: SEED_TRIP_ID,
    date: "2026-11-01",
    time: "13:30",
    category: "food",
    amount: 120,
    currency: "THB",
    convertedAmountBase: Number(
      convertCurrency(120, "THB", "BRL").toFixed(2)
    ),
    description: "Pad Thai Street Food & Água de Coco gelada",
    locationName: "Khao San Road, Bangkok",
    paymentMethod: "cash",
    synced: true,
  },
  {
    id: "exp_2",
    tripId: SEED_TRIP_ID,
    date: "2026-11-01",
    time: "15:45",
    category: "activity",
    amount: 200,
    currency: "THB",
    convertedAmountBase: Number(
      convertCurrency(200, "THB", "BRL").toFixed(2)
    ),
    description: "Ingresso Templo do Buda Reclinado (Wat Pho)",
    locationName: "Wat Pho, Bangkok",
    paymentMethod: "cash",
    synced: true,
  },
  {
    id: "exp_3",
    tripId: SEED_TRIP_ID,
    date: "2026-11-02",
    time: "19:00",
    category: "transport",
    amount: 980,
    currency: "THB",
    convertedAmountBase: Number(
      convertCurrency(980, "THB", "BRL").toFixed(2)
    ),
    description: "Trem Noturno com Leito para Chiang Mai (2ª Classe)",
    locationName: "Krung Thep Aphiwat Central Station",
    paymentMethod: "wise",
    synced: true,
  },
  {
    id: "exp_4",
    tripId: SEED_TRIP_ID,
    date: "2026-11-03",
    time: "08:15",
    category: "food",
    amount: 85,
    currency: "THB",
    convertedAmountBase: Number(
      convertCurrency(85, "THB", "BRL").toFixed(2)
    ),
    description: "Café gelado tailandês com leite condensado + Roti de Banana",
    locationName: "Old City, Chiang Mai",
    paymentMethod: "cash",
    synced: true,
  },
  {
    id: "exp_5",
    tripId: SEED_TRIP_ID,
    date: "2026-11-04",
    time: "11:00",
    category: "activity",
    amount: 1800,
    currency: "THB",
    convertedAmountBase: Number(
      convertCurrency(1800, "THB", "BRL").toFixed(2)
    ),
    description: "Santuário Ético de Elefantes (Caminhada na Selva & Banho de Rio)",
    locationName: "Mae Wang, Chiang Mai",
    paymentMethod: "card",
    synced: true,
  },
  {
    id: "exp_6",
    tripId: SEED_TRIP_ID,
    date: "2026-11-05",
    time: "18:20",
    category: "food",
    amount: 85000,
    currency: "VND",
    convertedAmountBase: Number(
      convertCurrency(85000, "VND", "BRL").toFixed(2)
    ),
    description: "Tigela de Pho Bo tradicional no Beco das Lanternas",
    locationName: "Old Quarter, Hanói",
    paymentMethod: "cash",
    synced: true,
  },
  {
    id: "exp_7",
    tripId: SEED_TRIP_ID,
    date: "2026-11-05",
    time: "21:30",
    category: "stay",
    amount: 320000,
    currency: "VND",
    convertedAmountBase: Number(
      convertCurrency(320000, "VND", "BRL").toFixed(2)
    ),
    description: "Hostel Boutique com cortina individual e ar-condicionado (2 noites)",
    locationName: "Hoan Kiem, Hanói",
    paymentMethod: "wise",
    synced: true,
  },
];

export const INITIAL_WAYPOINTS: Waypoint[] = [
  {
    id: "wp_1",
    tripId: SEED_TRIP_ID,
    dayIndex: 1,
    date: "2026-11-01",
    time: "09:00",
    title: "Chegada em Bangkok e Check-in",
    type: "hostel",
    locationName: "Rambuttri Village, Banglumpoo",
    elevationMeters: 12,
    distanceKm: 0,
    durationMinutes: 45,
    status: "done",
    notes: "Deixar mochilão pesado e colocar dinheiro em moeda local na doleira.",
  },
  {
    id: "wp_2",
    tripId: SEED_TRIP_ID,
    dayIndex: 1,
    date: "2026-11-01",
    time: "14:00",
    title: "Exploração dos Templos Históricos",
    type: "sight",
    locationName: "Wat Pho & Wat Arun",
    elevationMeters: 18,
    distanceKm: 4.2,
    durationMinutes: 180,
    status: "done",
    notes: "Roupas cobrindo ombros e joelhos. Pegar barco local público no rio Chao Phraya.",
  },
  {
    id: "wp_3",
    tripId: SEED_TRIP_ID,
    dayIndex: 2,
    date: "2026-11-02",
    time: "18:30",
    title: "Embarque no Trem Noturno para as Montanhas",
    type: "train",
    locationName: "Bangkok Central ➡️ Chiang Mai",
    elevationMeters: 310,
    distanceKm: 680,
    durationMinutes: 780,
    status: "done",
    notes: "Trem com leito #24, levar casaco leve pois o ar-condicionado é forte.",
  },
  {
    id: "wp_4",
    tripId: SEED_TRIP_ID,
    dayIndex: 3,
    date: "2026-11-03",
    time: "09:30",
    title: "Aluguel de Scooter e Café na Cidade Velha",
    type: "trek",
    locationName: "Portão Tha Phae, Chiang Mai",
    elevationMeters: 320,
    distanceKm: 12.5,
    durationMinutes: 120,
    status: "in_progress",
    notes: "Verificar freios e capacete. Levar mapa offline salvo no app.",
  },
  {
    id: "wp_5",
    tripId: SEED_TRIP_ID,
    dayIndex: 4,
    date: "2026-11-04",
    time: "07:00",
    title: "Trilha das Cachoeiras e Santuário de Elefantes",
    type: "trek",
    locationName: "Parque Nacional Doi Inthanon",
    elevationMeters: 1850,
    distanceKm: 8.4,
    durationMinutes: 300,
    status: "pending",
    notes: "Sem sinal de celular por 6 horas. Ponto de encontro com o guia Karen às 07:30.",
  },
  {
    id: "wp_6",
    tripId: SEED_TRIP_ID,
    dayIndex: 5,
    date: "2026-11-05",
    time: "13:00",
    title: "Voo Econômico para o Vietnã",
    type: "flight",
    locationName: "Chiang Mai (CNX) ✈️ Hanói (HAN)",
    elevationMeters: 15,
    distanceKm: 980,
    durationMinutes: 110,
    status: "pending",
    notes: "Visto eletrônico (eVisa) salvo em PDF na memória offline.",
  },
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: "jn_1",
    tripId: SEED_TRIP_ID,
    date: "2026-11-01",
    time: "20:30",
    title: "O choque de calor e os primeiros aromas de Bangkok",
    content:
      "Aterrissar aqui depois de 26 horas de voo dá aquela sensação inconfundível de que a jornada finalmente começou. O cheiro de capim-limão, óleo de gergelim e a sinfonia dos tuk-tuks na rua. O Wat Pho à tarde com os monges cantando me fez esquecer todo o cansaço do fuso horário.",
    location: "Bangkok, Tailândia",
    altitudeMeters: 15,
    mood: "amazed",
    weather: "sunny",
    photos: [
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
    ],
    tags: ["#bangkok", "#primeirodia", "#templos", "#mochilao"],
    createdAt: "2026-11-01T20:30:00Z",
  },
  {
    id: "jn_2",
    tripId: SEED_TRIP_ID,
    date: "2026-11-03",
    time: "17:15",
    title: "O som do balanço do trem e o ar fresco do norte",
    content:
      "Acordar no trem noturno vendo a névoa subindo pelas colinas e as plantações de arroz foi mágico. Chiang Mai tem uma vibe infinitamente mais calma que Bangkok. A comida do norte (Khao Soi) é uma das coisas mais espetaculares que já experimentei na vida.",
    location: "Chiang Mai, Tailândia",
    altitudeMeters: 315,
    mood: "peaceful",
    weather: "foggy",
    photos: [
      "https://images.unsplash.com/photo-1512553353614-82a7370096dc?auto=format&fit=crop&w=800&q=80",
    ],
    tags: ["#chiangmai", "#tremnoturno", "#norte", "#paz"],
    createdAt: "2026-11-03T17:15:00Z",
  },
];

export const INITIAL_PACKING: PackingItem[] = [
  // Documentos
  {
    id: "pk_1",
    tripId: SEED_TRIP_ID,
    category: "documentos",
    name: "Passaporte com validade > 6 meses",
    packed: true,
    essential: true,
    notes: "Com cópia física plastificada no fundo da mochila.",
  },
  {
    id: "pk_2",
    tripId: SEED_TRIP_ID,
    category: "documentos",
    name: "Certificado Internacional de Vacinação (Febre Amarela)",
    packed: true,
    essential: true,
    notes: "Exigido na imigração da Tailândia.",
  },
  {
    id: "pk_3",
    tripId: SEED_TRIP_ID,
    category: "documentos",
    name: "Apólice de Seguro Viagem com cobertura esportes",
    packed: true,
    essential: true,
    notes: "Salva em PDF offline.",
  },
  {
    id: "pk_4",
    tripId: SEED_TRIP_ID,
    category: "documentos",
    name: "Permissão Internacional para Dirigir (PID)",
    packed: true,
    essential: false,
    notes: "Para aluguel legal de scooter.",
  },

  // Equipamentos
  {
    id: "pk_5",
    tripId: SEED_TRIP_ID,
    category: "equipamentos",
    name: "Powerbank Anker 20.000mAh (Homologado para voos)",
    packed: true,
    essential: true,
    weightGrams: 350,
  },
  {
    id: "pk_6",
    tripId: SEED_TRIP_ID,
    category: "equipamentos",
    name: "Adaptador Universal de Tomada com USB-C",
    packed: true,
    essential: true,
    weightGrams: 120,
  },
  {
    id: "pk_7",
    tripId: SEED_TRIP_ID,
    category: "equipamentos",
    name: "Lanterna de Cabeça Recarregável para Trilhas",
    packed: false,
    essential: true,
    weightGrams: 85,
  },
  {
    id: "pk_8",
    tripId: SEED_TRIP_ID,
    category: "equipamentos",
    name: "Cadeado com Segredo TSA para armários de Hostel",
    packed: true,
    essential: true,
    weightGrams: 90,
  },
  {
    id: "pk_9",
    tripId: SEED_TRIP_ID,
    category: "equipamentos",
    name: "Toalha de Secagem Rápida em Microfibra",
    packed: true,
    essential: false,
    weightGrams: 160,
  },

  // Roupas
  {
    id: "pk_10",
    tripId: SEED_TRIP_ID,
    category: "roupas",
    name: "Jaqueta Corta-vento Impermeável",
    packed: true,
    essential: true,
    weightGrams: 280,
  },
  {
    id: "pk_11",
    tripId: SEED_TRIP_ID,
    category: "roupas",
    name: "Calça Leve de Trilha (cobre joelhos para templos)",
    packed: true,
    essential: true,
    weightGrams: 240,
  },
  {
    id: "pk_12",
    tripId: SEED_TRIP_ID,
    category: "roupas",
    name: "Botas de Trilha Amaciadas com Gore-Tex",
    packed: true,
    essential: true,
    weightGrams: 850,
  },
  {
    id: "pk_13",
    tripId: SEED_TRIP_ID,
    category: "roupas",
    name: "Camisas Dry-Fit Respiráveis (4 unidades)",
    packed: false,
    essential: false,
    weightGrams: 400,
  },

  // Farmácia
  {
    id: "pk_14",
    tripId: SEED_TRIP_ID,
    category: "farmacia",
    name: "Repelente DEET 50% para áreas de mata",
    packed: true,
    essential: true,
    weightGrams: 150,
  },
  {
    id: "pk_15",
    tripId: SEED_TRIP_ID,
    category: "farmacia",
    name: "Pastilhas de Purificação de Água (Clorin)",
    packed: false,
    essential: true,
    weightGrams: 30,
  },
  {
    id: "pk_16",
    tripId: SEED_TRIP_ID,
    category: "farmacia",
    name: "Kit Primeiros Socorros (Curativos, Esparadrapo, Antitérmico)",
    packed: true,
    essential: true,
    weightGrams: 180,
  },
];

export function createInitialState(): NomadPersistedState {
  const rates = Object.fromEntries(
    Object.entries(DEFAULT_CURRENCIES).map(([k, v]) => [k, v.rateToUSD])
  ) as Record<CurrencyCode, number>;

  return {
    version: 1,
    locale: "pt",
    subscription: {
      plan: "free",
      unlimitedTrips: false,
      encryptedCloudBackup: false,
      offlineFxHistory: false,
      exportReports: false,
    },
    activeTripId: SEED_TRIP_ID,
    trips: [INITIAL_TRIP],
    expenses: INITIAL_EXPENSES,
    waypoints: INITIAL_WAYPOINTS,
    journalEntries: INITIAL_JOURNAL,
    packingItems: INITIAL_PACKING,
    ratesSnapshotTimestamp: Date.now() - 3600000 * 4, // 4 horas atrás
    rates,
    isOfflineMode: true, // Começa em modo 100% offline ativo!
    mutationQueue: [],
    lastSyncTimestamp: Date.now() - 3600000 * 12,
  };
}

