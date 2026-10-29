import React from "react";
import { View, TouchableOpacity } from "react-native";
import {
  Utensils,
  Bus,
  Bed,
  Compass,
  Wrench,
  AlertTriangle,
  MoreHorizontal,
  MapPin,
  Clock,
  Trash2,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Badge } from "@/components/ui";
import {
  Expense,
  ExpenseCategory,
  formatMoney,
  useAppStore,
  DEFAULT_CURRENCIES,
} from "@/store";

const CATEGORY_ICONS: Record<ExpenseCategory, any> = {
  food: Utensils,
  transport: Bus,
  stay: Bed,
  activity: Compass,
  gear: Wrench,
  emergency: AlertTriangle,
  other: MoreHorizontal,
};

const CATEGORY_BADGE_VARIANTS: Record<
  ExpenseCategory,
  "emerald" | "sky" | "purple" | "amber" | "primary" | "neutral"
> = {
  food: "emerald",
  transport: "sky",
  stay: "purple",
  activity: "amber",
  gear: "primary",
  emergency: "primary",
  other: "neutral",
};

export const ExpenseItemRow: React.FC<{
  expense: Expense;
}> = ({ expense }) => {
  const { activeTrip, deleteExpense } = useAppStore();
  const Icon = CATEGORY_ICONS[expense.category] || MoreHorizontal;
  const currencyInfo = DEFAULT_CURRENCIES[expense.currency];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.grayscale[700],
        padding: 12,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.grayscale[500],
        gap: 12,
      }}
    >
      {/* Ícone da Categoria */}
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: radii.md,
          backgroundColor: colors.grayscale[600],
          borderWidth: 1,
          borderColor: colors.grayscale[500],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={18} color={colors.primary[100]} />
      </View>

      {/* Detalhes do Gasto */}
      <View style={{ flex: 1, gap: 2 }}>
        <AppText
          variant="subheadline"
          color={colors.grayscale[100]}
          style={{ fontWeight: "700" }}
          numberOfLines={1}
        >
          {expense.description}
        </AppText>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <MapPin size={11} color={colors.grayscale[400]} />
            <AppText
              variant="caption"
              color={colors.grayscale[300]}
              numberOfLines={1}
            >
              {expense.locationName}
            </AppText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <Clock size={11} color={colors.grayscale[400]} />
            <AppText variant="caption" color={colors.grayscale[300]}>
              {expense.time}
            </AppText>
          </View>
        </View>
      </View>

      {/* Valores: Original e Convertido */}
      <View style={{ alignItems: "flex-end", gap: 2 }}>
        <AppText
          variant="subheadline"
          color={colors.grayscale[100]}
          style={{ fontWeight: "700" }}
        >
          {formatMoney(expense.amount, expense.currency)}
        </AppText>

        {activeTrip && expense.currency !== activeTrip.baseCurrency && (
          <AppText variant="caption" color={colors.adventure.amber}>
            ≈ {formatMoney(expense.convertedAmountBase, activeTrip.baseCurrency)}
          </AppText>
        )}

        <TouchableOpacity
          onPress={() => deleteExpense(expense.id)}
          style={{ marginTop: 2, padding: 2 }}
        >
          <Trash2 size={12} color={colors.grayscale[400]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

