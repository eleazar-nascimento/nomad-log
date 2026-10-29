import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { ArrowRightLeft, RefreshCw, Coins, Sparkles } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Input, Badge } from "@/components/ui";
import {
  CurrencyCode,
  DEFAULT_CURRENCIES,
  convertCurrency,
  formatMoney,
  useAppStore,
} from "@/store";

export const CurrencyConverterWidget: React.FC = () => {
  const { state, activeTrip } = useAppStore();

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
            Conversor de Câmbio Offline
          </AppText>
        </View>
        <Badge label="OFFLINE" variant="amber" size="sm" />
      </View>

      <AppText variant="footnote" color={colors.grayscale[300]}>
        Converta qualquer valor na rua ou feira sem gastar dados móveis:
      </AppText>

      {/* Seletor rápido de moedas de origem */}
      <View style={{ gap: 6 }}>
        <AppText variant="caption" color={colors.grayscale[300]}>
          Moeda de Origem (Você paga):
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
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: radii.sm,
                  backgroundColor: isSelected
                    ? "rgba(245, 158, 11, 0.25)"
                    : colors.grayscale[700],
                  borderWidth: 1,
                  borderColor: isSelected
                    ? colors.adventure.amber
                    : colors.grayscale[500],
                }}
              >
                <AppText
                  variant="caption"
                  color={
                    isSelected
                      ? colors.adventure.amber
                      : colors.grayscale[200]
                  }
                  style={{ fontWeight: "600" }}
                >
                  {info?.flag} {cur}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Bloco de Conversão Interativa */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: colors.grayscale[700],
          borderRadius: radii.md,
          padding: 12,
          borderWidth: 1,
          borderColor: colors.grayscale[500],
        }}
      >
        <View style={{ flex: 1, gap: 4 }}>
          <AppText variant="caption" color={colors.grayscale[400]}>
            Valor ({fromCurrency})
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
            Resultado ({toCurrency})
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
          Taxa congelada: 1 {fromCurrency} = {unitRate.toFixed(4)} {toCurrency}
        </AppText>
        <AppText variant="footnote" color={colors.adventure.emerald}>
          ✓ Sem conexão
        </AppText>
      </View>
    </Card>
  );
};

