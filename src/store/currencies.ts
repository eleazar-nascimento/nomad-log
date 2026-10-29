import { CurrencyCode, CurrencyInfo } from "./types";

/**
 * Catálogo Oficial de Moedas e Taxas em Cache Offline
 * Taxas de referência congeladas relativas a 1 USD (Dólar Americano)
 */
export const DEFAULT_CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  BRL: {
    code: "BRL",
    symbol: "R$",
    name: "Real Brasileiro",
    flag: "🇧🇷",
    rateToUSD: 5.85,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "Dólar Americano",
    flag: "🇺🇸",
    rateToUSD: 1.0,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "🇪🇺",
    rateToUSD: 0.92,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "Libra Esterlina",
    flag: "🇬🇧",
    rateToUSD: 0.77,
  },
  THB: {
    code: "THB",
    symbol: "฿",
    name: "Baht Tailandês",
    flag: "🇹🇭",
    rateToUSD: 34.5,
  },
  VND: {
    code: "VND",
    symbol: "₫",
    name: "Dong Vietnamita",
    flag: "🇻🇳",
    rateToUSD: 25400.0,
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    name: "Iene Japonês",
    flag: "🇯🇵",
    rateToUSD: 152.4,
  },
  ARS: {
    code: "ARS",
    symbol: "$",
    name: "Peso Argentino",
    flag: "🇦🇷",
    rateToUSD: 1045.0,
  },
  CLP: {
    code: "CLP",
    symbol: "$",
    name: "Peso Chileno",
    flag: "🇨🇱",
    rateToUSD: 965.0,
  },
  COP: {
    code: "COP",
    symbol: "$",
    name: "Peso Colombiano",
    flag: "🇨🇴",
    rateToUSD: 4220.0,
  },
  PEN: {
    code: "PEN",
    symbol: "S/",
    name: "Sol Peruano",
    flag: "🇵🇪",
    rateToUSD: 3.76,
  },
  BOB: {
    code: "BOB",
    symbol: "Bs",
    name: "Boliviano",
    flag: "🇧🇴",
    rateToUSD: 6.96,
  },
  IDR: {
    code: "IDR",
    symbol: "Rp",
    name: "Rúpia Indonésia",
    flag: "🇮🇩",
    rateToUSD: 15800.0,
  },
  MXN: {
    code: "MXN",
    symbol: "$",
    name: "Peso Mexicano",
    flag: "🇲🇽",
    rateToUSD: 20.15,
  },
};

/**
 * Converte qualquer valor entre duas moedas usando as taxas em cache local
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  customRates?: Record<CurrencyCode, number>
): number {
  if (from === to) return amount;
  const rates = customRates || Object.fromEntries(
    Object.entries(DEFAULT_CURRENCIES).map(([k, v]) => [k, v.rateToUSD])
  );

  const rateFrom = rates[from] || 1;
  const rateTo = rates[to] || 1;

  // Valor em USD = amount / rateFrom
  // Valor em To = (amount / rateFrom) * rateTo
  const inUSD = amount / rateFrom;
  return inUSD * rateTo;
}

/**
 * Formata um valor com seu respectivo símbolo de moeda
 */
export function formatMoney(amount: number, currency: CurrencyCode): string {
  const info = DEFAULT_CURRENCIES[currency] || { symbol: currency };
  const isHighDenom = currency === "VND" || currency === "IDR" || currency === "CLP";
  
  const formatted = amount.toLocaleString("pt-BR", {
    minimumFractionDigits: isHighDenom ? 0 : 2,
    maximumFractionDigits: isHighDenom ? 0 : 2,
  });

  return `${info.symbol} ${formatted}`;
}

