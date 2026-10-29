import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Wallet, Plus, TrendingDown, ArrowRight } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge, AnimatedNumber } from "@/components/ui";
import { useAppStore, formatMoney } from "@/store";
import { useTranslation } from "@/i18n";

export const DailyBudgetCard: React.FC<{
  onAddExpensePress?: () => void;
  onViewAllExpensesPress?: () => void;
}> = ({ onAddExpensePress, onViewAllExpensesPress }) => {
  const {
    activeTrip,
    totalSpentBase,
    remainingBudgetBase,
    budgetUsagePercent,
  } = useAppStore();
  const { t, isPt } = useTranslation();

  if (!activeTrip) return null;

  const isExceeded = remainingBudgetBase < 0;
  const statusColor = isExceeded
    ? colors.message.red
    : budgetUsagePercent > 80
    ? colors.adventure.amber
    : colors.adventure.emerald;

  return (
    <Card
      variant="surface"
      style={{
        gap: 14,
        borderColor: colors.grayscale[500],
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: radii.md,
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              borderWidth: 1,
              borderColor: "rgba(245, 158, 11, 0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wallet size={16} color={colors.adventure.amber} />
          </View>
          <View>
            <AppText variant="headline" style={{ fontWeight: "700" }}>
              {t.dashboard.tripBudget}
            </AppText>
            <AppText variant="caption" color={colors.grayscale[300]}>
              {t.dashboard.dailyTarget}: {formatMoney(activeTrip.dailyBudgetBase, activeTrip.baseCurrency)} {isPt ? "/ dia" : "/ day"}
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          onPress={onAddExpensePress}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: colors.primary[100],
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: radii.pill,
          }}
        >
          <Plus size={14} color={colors.grayscale[100]} />
          <AppText
            variant="caption"
            color={colors.grayscale[100]}
            style={{ fontWeight: "700" }}
          >
            {t.dashboard.logExpense}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Valores em destaque */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingVertical: 4,
        }}
      >
        <View style={{ gap: 2 }}>
          <AppText variant="caption" color={colors.grayscale[300]}>
            {t.dashboard.totalSpent} ({activeTrip.baseCurrency})
          </AppText>
          <AnimatedNumber
            value={totalSpentBase}
            prefix={activeTrip.baseCurrency === "BRL" ? "R$ " : "$ "}
            variant="title1"
            style={{ fontWeight: "700" }}
          />
        </View>

        <View style={{ alignItems: "flex-end", gap: 2 }}>
          <AppText variant="caption" color={colors.grayscale[300]}>
            {t.dashboard.remainingBalance}
          </AppText>
          <AppText
            variant="title3"
            color={statusColor}
            style={{ fontWeight: "700" }}
          >
            {formatMoney(remainingBudgetBase, activeTrip.baseCurrency)}
          </AppText>
        </View>
      </View>

      {/* Barra de progresso do orçamento */}
      <View style={{ gap: 6 }}>
        <View
          style={{
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.grayscale[700],
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${Math.min(100, budgetUsagePercent)}%`,
              backgroundColor: statusColor,
              borderRadius: 4,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <AppText variant="footnote" color={colors.grayscale[300]}>
            {budgetUsagePercent}% {t.dashboard.budgetConsumed} ({formatMoney(activeTrip.totalBudgetBase, activeTrip.baseCurrency)})
          </AppText>
          <TouchableOpacity
            onPress={onViewAllExpensesPress}
            activeOpacity={0.7}
            style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
          >
            <AppText variant="footnote" color={colors.primary[100]}>
              {t.dashboard.statementAndFx}
            </AppText>
            <ArrowRight size={11} color={colors.primary[100]} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

