import React from "react";
import { View } from "react-native";
import { colors, radii } from "@/theme";
import { AppText, Card } from "@/components/ui";
import { Expense, ExpenseCategory, formatMoney, useAppStore } from "@/store";

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: colors.adventure.emerald,
  transport: colors.adventure.indigo,
  stay: colors.adventure.purple,
  activity: colors.adventure.amber,
  gear: colors.adventure.sky,
  emergency: colors.message.red,
  other: colors.grayscale[300],
};

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: "Alimentação",
  transport: "Transporte",
  stay: "Hospedagem",
  activity: "Passeios",
  gear: "Equipamentos",
  emergency: "Emergência",
  other: "Outros",
};

export const ExpenseCategoryBar: React.FC<{
  expenses: Expense[];
}> = ({ expenses }) => {
  const { activeTrip } = useAppStore();
  if (!activeTrip) return null;

  const totalSpent = expenses.reduce(
    (sum, e) => sum + e.convertedAmountBase,
    0
  );

  // Agrupa gastos por categoria
  const categoryTotals: Partial<Record<ExpenseCategory, number>> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.convertedAmountBase;
  });

  const sortedCategories = (
    Object.keys(categoryTotals) as ExpenseCategory[]
  ).sort((a, b) => (categoryTotals[b] || 0) - (categoryTotals[a] || 0));

  return (
    <Card variant="surface" style={{ gap: 14, padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AppText variant="headline" style={{ fontWeight: "700" }}>
          Distribuição de Gastos
        </AppText>
        <AppText variant="caption" color={colors.grayscale[300]}>
          Total: {formatMoney(totalSpent, activeTrip.baseCurrency)}
        </AppText>
      </View>

      {/* Barra colorida segmentada */}
      {totalSpent > 0 && (
        <View
          style={{
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.grayscale[700],
            flexDirection: "row",
            overflow: "hidden",
          }}
        >
          {sortedCategories.map((cat) => {
            const amount = categoryTotals[cat] || 0;
            const pct = Math.max(2, (amount / totalSpent) * 100);
            return (
              <View
                key={cat}
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  backgroundColor: CATEGORY_COLORS[cat],
                }}
              />
            );
          })}
        </View>
      )}

      {/* Legenda de categorias */}
      <View style={{ gap: 8 }}>
        {sortedCategories.map((cat) => {
          const amount = categoryTotals[cat] || 0;
          const pct = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
          return (
            <View
              key={cat}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: CATEGORY_COLORS[cat],
                  }}
                />
                <AppText variant="caption" color={colors.grayscale[200]}>
                  {CATEGORY_LABELS[cat]}
                </AppText>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <AppText variant="caption" color={colors.grayscale[300]}>
                  {pct}%
                </AppText>
                <AppText
                  variant="caption"
                  color={colors.grayscale[100]}
                  style={{ fontWeight: "700" }}
                >
                  {formatMoney(amount, activeTrip.baseCurrency)}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

