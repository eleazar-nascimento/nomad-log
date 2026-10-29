import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { CheckSquare } from "lucide-react-native";
import { colors } from "@/theme";
import { AppText, Card, CircularProgress, OfflineBanner, AnimatedContainer } from "@/components/ui";
import { TopHeader } from "@/components/layout";
import { TripOverviewCard } from "../components/TripOverviewCard";
import { DailyBudgetCard } from "../components/DailyBudgetCard";
import { TodayTimelineWidget } from "../components/TodayTimelineWidget";
import { QuickExpenseModal } from "../components/QuickExpenseModal";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

export const DashboardScreen: React.FC<{
  onOpenTripModal: () => void;
  onOpenProModal: () => void;
}> = ({ onOpenTripModal, onOpenProModal }) => {
  const router = useRouter();
  const { activeTrip, packingProgress } = useAppStore();
  const { t, isPt } = useTranslation();
  const [quickExpenseOpen, setQuickExpenseOpen] = useState(false);

  if (!activeTrip) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.grayscale[700] }}>
      <TopHeader
        onOpenTripManager={onOpenTripModal}
        onOpenProModal={onOpenProModal}
      />
      <OfflineBanner onPress={onOpenProModal} />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 16,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Principal da Viagem */}
        <AnimatedContainer delay={50}>
          <TripOverviewCard
            trip={activeTrip}
            onPress={() => router.push("/(tabs)/itinerary" as any)}
          />
        </AnimatedContainer>

        {/* Orçamento e Despesas Offline */}
        <AnimatedContainer delay={120}>
          <DailyBudgetCard
            onAddExpensePress={() => setQuickExpenseOpen(true)}
            onViewAllExpensesPress={() => router.push("/(tabs)/expenses" as any)}
          />
        </AnimatedContainer>

        {/* Resumo Circular da Mochila (Inspirado no Figma Daily Routine) */}
        <AnimatedContainer delay={190}>
          <Card
            variant="surface"
            onPress={() => router.push("/(tabs)/packing" as any)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderColor: colors.grayscale[500],
            }}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <CheckSquare size={16} color={colors.primary[100]} />
                <AppText variant="headline" style={{ fontWeight: "700" }}>
                  {t.dashboard.backpackStatus}
                </AppText>
              </View>
              <AppText variant="caption" color={colors.grayscale[300]}>
                {isPt
                  ? `${packingProgress.packed} de ${packingProgress.total} ${t.dashboard.itemsChecked}`
                  : `${packingProgress.packed} of ${packingProgress.total} ${t.dashboard.itemsChecked}`}
              </AppText>
              <AppText variant="caption" color={colors.adventure.sky}>
                {t.dashboard.estimatedScaleWeight}: {packingProgress.totalWeightKg} kg
              </AppText>
            </View>

            <CircularProgress
              size={74}
              strokeWidth={7}
              progress={packingProgress.percentage}
              color={colors.adventure.emerald}
              trackColor={colors.grayscale[500]}
            />
          </Card>
        </AnimatedContainer>

        {/* Cronograma do Dia */}
        <AnimatedContainer delay={260}>
          <TodayTimelineWidget
            onViewItineraryPress={() => router.push("/(tabs)/itinerary" as any)}
          />
        </AnimatedContainer>
      </ScrollView>

      {/* Modal Rápido de Despesa */}
      <QuickExpenseModal
        visible={quickExpenseOpen}
        onClose={() => setQuickExpenseOpen(false)}
      />
    </View>
  );
};

