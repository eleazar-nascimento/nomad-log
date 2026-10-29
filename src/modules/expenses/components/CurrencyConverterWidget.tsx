import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { ArrowRightLeft, RefreshCw, Coins } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Input, Badge } from "@/components/ui";
import {
  CurrencyCode,
  DEFAULT_CURRENCIES,
  convertCurrency,
  formatMoney,
  useAppStore,
} from "@/store";
import { useTranslation } from "@/i18n";

export const CurrencyConverterWidget: React.FC = () => {
  const { state, activeTrip, refreshFxRates } = useAppStore();
  const { t } = useTranslation();

  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>(
    activeTrip?.localCurrencies[0] || "THB"
  );
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(
    activeTrip?.baseCurrency || "BRL"
  );
  const [amountStr, setAmountStr] = useState("100");

  const parsedAmount = parseFloat(amountStr.replace(",", ".")) || 0;
  const converted = convertCurrency(
    parsedAmount,
    fromCurrency,
    toCurrency,
    state.rates
  );

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const currenciesList: CurrencyCode[] = [
    "BRL",
    "USD",
    "EUR",
    "THB",
    "VND",
    "JPY",
    "GBP",
    "ARS",
    "CLP",
    "COP",
  ];

  const unitRate = convertCurrency(1, fromCurrency, toCurrency, state.rates);

  return (
    <Card
      variant="surface"
      style={{
        gap: 12,
        padding: 16,
        borderColor: colors.grayscale[500],
      }}
    >
      {/* Header do Widget */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Coins size={16} color={colors.adventure.amber} />
          <AppText variant="headline" style={{ fontWeight: "700" }}>
            {t.expenses.fxWidgetTitle}
          </AppText>
        </View>
        <Badge label={t.expenses.fxWidgetBadge} variant="amber" size="sm" />
      </View>

      <AppText variant="footnote" color={colors.grayscale[300]}>
        {t.expenses.fxWidgetDesc}
      </AppText>

      {/* Seletor rápido de moedas de origem */}
      <View style={{ gap: 6 }}>
        <AppText variant="caption" color={colors.grayscale[300]}>
          {t.expenses.fromCurrency}:
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6 }}
        >
          {currenciesList.map((cur) => {
            const isSelected = fromCurrency === cur;
            const info = DEFAULT_CURRENCIES[cur];
            return (
              <TouchableOpacity
                key={cur}
                onPress={() => setFromCurrency(cur)}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: radii.md,
                  backgroundColor: isSelected
                    ? "rgba(245, 158, 11, 0.18)"
                    : colors.grayscale[600],
                  borderWidth: 1.5,
                  borderColor: isSelected
                    ? colors.adventure.amber
                    : colors.grayscale[500],
                }}
              >
                <AppText variant="caption">{info.flag}</AppText>
                <AppText
                  variant="caption"
                  color={
                    isSelected
                      ? colors.adventure.amber
                      : colors.grayscale[200]
                  }
                  style={{ fontWeight: "700" }}
                >
                  {cur}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Inputs de Conversão e Resultado */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View style={{ flex: 1, gap: 4 }}>
          <AppText variant="caption" color={colors.grayscale[400]}>
            {t.expenses.enterAmount} ({fromCurrency})
          </AppText>
          <Input
            value={amountStr}
            onChangeText={setAmountStr}
            keyboardType="numeric"
            style={{ fontSize: 18, fontWeight: "700" }}
          />
        </View>

        {/* Botão de Inverter */}
        <TouchableOpacity
          onPress={swapCurrencies}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.grayscale[600],
            borderWidth: 1,
            borderColor: colors.grayscale[500],
            alignItems: "center",
            justifyContent: "center",
            marginTop: 14,
          }}
        >
          <ArrowRightLeft size={14} color={colors.primary[100]} />
        </TouchableOpacity>

        <View style={{ flex: 1, gap: 4 }}>
          <AppText variant="caption" color={colors.grayscale[400]}>
            {t.expenses.result} ({toCurrency})
          </AppText>
          <View
            style={{
              height: 48,
              justifyContent: "center",
              backgroundColor: colors.grayscale[800],
              borderRadius: radii.md,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: colors.grayscale[600],
            }}
          >
            <AppText
              variant="subheadline"
              color={colors.adventure.amber}
              style={{ fontWeight: "700" }}
              numberOfLines={1}
            >
              {formatMoney(converted, toCurrency)}
            </AppText>
          </View>
        </View>
      </View>

      {/* Taxa unitária de referência */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 4,
        }}
      >
        <AppText variant="footnote" color={colors.grayscale[300]}>
          1 {fromCurrency} = {unitRate.toFixed(4)} {toCurrency}
        </AppText>
        <TouchableOpacity
          onPress={() => refreshFxRates()}
          activeOpacity={0.7}
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <RefreshCw size={11} color={colors.adventure.emerald} />
          <AppText variant="footnote" color={colors.adventure.emerald}>
            {state.isOfflineMode ? t.expenses.cacheOffline : t.expenses.fetchOnline}
          </AppText>
        </TouchableOpacity>
      </View>
    </Card>
  );
};
