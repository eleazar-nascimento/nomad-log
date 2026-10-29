import { CurrencyCode } from "@/store/types";
import { DEFAULT_CURRENCIES } from "@/store/currencies";

export interface FxFetchResult {
  success: boolean;
  rates?: Record<CurrencyCode, number>;
  source: "live_api" | "cache_fallback";
  timestamp: number;
  message: string;
}

const API_URL = "https://open.er-api.com/v6/latest/USD";
const TIMEOUT_MS = 4000; // 4 segundos de timeout para evitar travamentos

/**
 * Busca cotações de câmbio em tempo real quando houver internet.
 * Se estiver sem sinal ou offline, cai graciosamente no fallback sem quebrar a UI.
 */
export async function fetchLiveExchangeRates(
  currentRates?: Record<CurrencyCode, number>
): Promise<FxFetchResult> {
  const fallbackRates: Record<CurrencyCode, number> =
    currentRates ||
    (Object.fromEntries(
      Object.entries(DEFAULT_CURRENCIES).map(([k, v]) => [k, v.rateToUSD])
    ) as Record<CurrencyCode, number>);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Status HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data && data.rates && typeof data.rates === "object") {
      const liveRates: Record<CurrencyCode, number> = { ...fallbackRates };

      const trackedCurrencies: CurrencyCode[] = [
        "BRL",
        "USD",
        "EUR",
        "GBP",
        "THB",
        "VND",
        "JPY",
        "ARS",
        "CLP",
        "COP",
        "PEN",
        "BOB",
        "IDR",
        "MXN",
      ];

      for (const cur of trackedCurrencies) {
        if (data.rates[cur] && typeof data.rates[cur] === "number") {
          liveRates[cur] = Number(data.rates[cur]);
        }
      }

      return {
        success: true,
        rates: liveRates,
        source: "live_api",
        timestamp: Date.now(),
        message: "Cotações reais atualizadas com sucesso via API pública!",
      };
    }

    throw new Error("Formato de resposta inválido da API de câmbio");
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn("[FX API] Falha ao buscar cotações online (usando cache local):", err?.message);

    return {
      success: false,
      rates: fallbackRates,
      source: "cache_fallback",
      timestamp: Date.now(),
      message: "Sem conexão com a internet. Usando taxas congeladas do cache local.",
    };
  }
}
