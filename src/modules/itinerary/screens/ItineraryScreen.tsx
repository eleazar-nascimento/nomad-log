import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Plus, Calendar, Compass } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, OfflineBanner } from "@/components/ui";
import { TopHeader } from "@/components/layout";
import { VectorRouteMap } from "../components/VectorRouteMap";
import { DayScheduleCard } from "../components/DayScheduleCard";
import { AddWaypointModal } from "../components/AddWaypointModal";
import { QuickExpenseModal } from "@/modules/dashboard/components/QuickExpenseModal";
import { useAppStore, Waypoint, WaypointType, ExpenseCategory } from "@/store";
import { useTranslation } from "@/i18n";

export const ItineraryScreen: React.FC<{
  onOpenTripModal: () => void;
  onOpenProModal: () => void;
}> = ({ onOpenTripModal, onOpenProModal }) => {
  const { activeTrip, activeTripWaypoints, linkExpenseToWaypoint } = useAppStore();
  const { t, isPt } = useTranslation();
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [expenseModalWaypoint, setExpenseModalWaypoint] = useState<Waypoint | null>(null);

  if (!activeTrip) return null;

  const mapWaypointTypeToCategory = (type: WaypointType): ExpenseCategory => {
    switch (type) {
      case "food":
        return "food";
      case "flight":
      case "bus":
      case "train":
        return "transport";
      case "hostel":
        return "stay";
      case "trek":
      case "sight":
        return "activity";
      default:
        return "other";
    }
  };

  // Encontra os dias únicos existentes nos waypoints
  const uniqueDays = Array.from(
    new Set(activeTripWaypoints.map((w) => w.dayIndex))
  ).sort((a, b) => a - b);

  // Filtra por dia se não for "all"
  const filteredWaypoints =
    selectedDay === "all"
      ? activeTripWaypoints
      : activeTripWaypoints.filter((w) => w.dayIndex === selectedDay);

  // Agrupa por dia
  const groupedByDay: { [day: number]: typeof activeTripWaypoints } = {};
  filteredWaypoints.forEach((wp) => {
    if (!groupedByDay[wp.dayIndex]) {
      groupedByDay[wp.dayIndex] = [];
    }
    groupedByDay[wp.dayIndex].push(wp);
  });

  const allAvailableDays = uniqueDays.length > 0 ? uniqueDays : [1, 2, 3, 4, 5];

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
        {/* Mapa Vetorial em Cache Local */}
        <VectorRouteMap waypoints={activeTripWaypoints} />

        {/* Seletor Horizontal de Dias */}
        <View style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Calendar size={15} color={colors.primary[100]} />
              <AppText variant="headline" style={{ fontWeight: "700" }}>
                {t.itinerary.tripDays}
              </AppText>
            </View>

            <TouchableOpacity
              onPress={() => setAddModalOpen(true)}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: colors.primary[100],
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: radii.pill,
              }}
            >
              <Plus size={13} color={colors.grayscale[100]} />
              <AppText
                variant="caption"
                color={colors.grayscale[100]}
                style={{ fontWeight: "700" }}
              >
                {t.itinerary.newStop}
              </AppText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {/* Chip Todos */}
            <TouchableOpacity
              onPress={() => setSelectedDay("all")}
              activeOpacity={0.8}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: radii.md,
                backgroundColor:
                  selectedDay === "all"
                    ? colors.primary[100]
                    : colors.grayscale[600],
                borderWidth: 1,
                borderColor:
                  selectedDay === "all"
                    ? colors.primary[100]
                    : colors.grayscale[500],
              }}
            >
              <AppText
                variant="caption"
                color={colors.grayscale[100]}
                style={{ fontWeight: "700" }}
              >
                {t.itinerary.allDays} ({activeTripWaypoints.length})
              </AppText>
            </TouchableOpacity>

            {/* Chips de cada Dia */}
            {allAvailableDays.map((day) => {
              const isSelected = selectedDay === day;
              const count = activeTripWaypoints.filter(
                (w) => w.dayIndex === day
              ).length;
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: radii.md,
                    backgroundColor: isSelected
                      ? colors.primary[100]
                      : colors.grayscale[600],
                    borderWidth: 1,
                    borderColor: isSelected
                      ? colors.primary[100]
                      : colors.grayscale[500],
                    alignItems: "center",
                    minWidth: 64,
                  }}
                >
                  <AppText
                    variant="caption"
                    color={colors.grayscale[100]}
                    style={{ fontWeight: "700" }}
                  >
                    {t.itinerary.dayPrefix} {day}
                  </AppText>
                  <AppText
                    variant="footnote"
                    color={
                      isSelected ? colors.grayscale[200] : colors.grayscale[400]
                    }
                  >
                    {count} {t.itinerary.stopsCount}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Lista de Dias com seus respectivos cards de atividades */}
        {Object.keys(groupedByDay).length === 0 ? (
          <View
            style={{
              padding: 30,
              alignItems: "center",
              backgroundColor: colors.grayscale[600],
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: colors.grayscale[500],
              gap: 8,
            }}
          >
            <Compass size={28} color={colors.grayscale[400]} />
            <AppText variant="subheadline" style={{ fontWeight: "600" }}>
              {t.itinerary.noActivities}
            </AppText>
            <AppText
              variant="footnote"
              color={colors.grayscale[300]}
              align="center"
            >
              {t.itinerary.noActivitiesDesc}
            </AppText>
          </View>
        ) : (
          Object.keys(groupedByDay)
            .map(Number)
            .sort((a, b) => a - b)
            .map((dayNum) => (
              <DayScheduleCard
                key={dayNum}
                dayIndex={dayNum}
                date={`${t.itinerary.dayPrefix} ${dayNum}`}
                waypoints={groupedByDay[dayNum]}
                availableDays={allAvailableDays}
                onLogExpenseForWaypoint={(wp) => setExpenseModalWaypoint(wp)}
              />
            ))
        )}
      </ScrollView>

      {/* Modal Adicionar Parada */}
      <AddWaypointModal
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultDayIndex={selectedDay === "all" ? 1 : selectedDay}
      />

      {/* Modal Lançar Gasto da Parada (Pilar 3: Integração Roteiro ⇄ Despesas) */}
      <QuickExpenseModal
        visible={!!expenseModalWaypoint}
        onClose={() => setExpenseModalWaypoint(null)}
        initialDescription={expenseModalWaypoint?.title}
        initialLocation={expenseModalWaypoint?.locationName}
        initialAmount={
          expenseModalWaypoint?.estimatedCost
            ? String(expenseModalWaypoint.estimatedCost)
            : ""
        }
        initialCurrency={
          expenseModalWaypoint?.estimatedCurrency ||
          activeTrip.localCurrencies[0] ||
          "THB"
        }
        initialCategory={
          expenseModalWaypoint
            ? mapWaypointTypeToCategory(expenseModalWaypoint.type)
            : "activity"
        }
        onExpenseCreated={(expenseId) => {
          if (expenseModalWaypoint) {
            linkExpenseToWaypoint(expenseModalWaypoint.id, expenseId);
          }
        }}
      />
    </View>
  );
};
