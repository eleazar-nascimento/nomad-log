import React, { useState, useMemo } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import {
  Plane,
  Bus,
  Train,
  Mountain,
  Bed,
  Compass,
  Utensils,
  CheckCircle2,
  PlayCircle,
  Circle,
  Trash2,
  Clock,
  MapPin,
  Wallet,
  Coins,
  ArrowRightLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge } from "@/components/ui";
import { Waypoint, WaypointType, useAppStore, formatMoney, convertCurrency } from "@/store";

export const DayScheduleCard: React.FC<{
  dayIndex: number;
  date: string;
  waypoints: Waypoint[];
  availableDays?: number[];
  onAddWaypointPress?: () => void;
  onLogExpenseForWaypoint?: (wp: Waypoint) => void;
}> = ({
  dayIndex,
  date,
  waypoints,
  availableDays = [1, 2, 3, 4, 5],
  onAddWaypointPress,
  onLogExpenseForWaypoint,
}) => {
  const {
    activeTrip,
    activeTripExpenses,
    state,
    toggleWaypointStatus,
    deleteWaypoint,
    moveWaypointToDay,
    shiftWaypointTime,
  } = useAppStore();

  // Armazena qual waypoint está com o seletor de "Mover Dia" aberto
  const [movingWpId, setMovingWpId] = useState<string | null>(null);

  // Calcula o Custo Previsto total do dia (convertido para moeda base da viagem)
  const dayEstimatedBase = useMemo(() => {
    if (!activeTrip) return 0;
    return waypoints.reduce((sum, wp) => {
      if (!wp.estimatedCost) return sum;
      const cur = wp.estimatedCurrency || activeTrip.baseCurrency;
      const converted = convertCurrency(
        wp.estimatedCost,
        cur,
        activeTrip.baseCurrency,
        state.rates
      );
      return sum + converted;
    }, 0);
  }, [waypoints, activeTrip, state.rates]);

  // Calcula os gastos reais já lançados para este dia
  const dayRealSpentBase = useMemo(() => {
    if (!activeTrip) return 0;
    const linkedIds = new Set(waypoints.map((w) => w.linkedExpenseId).filter(Boolean));
    return activeTripExpenses
      .filter((e) => linkedIds.has(e.id) || e.date === date || e.date.endsWith(`-${String(dayIndex).padStart(2, "0")}`))
      .reduce((s, e) => s + e.convertedAmountBase, 0);
  }, [waypoints, activeTripExpenses, date, dayIndex]);

  const getTypeIcon = (type: WaypointType) => {
    switch (type) {
      case "flight":
        return <Plane size={14} color={colors.adventure.sky} />;
      case "bus":
        return <Bus size={14} color={colors.adventure.amber} />;
      case "train":
        return <Train size={14} color={colors.adventure.indigo} />;
      case "trek":
        return <Mountain size={14} color={colors.adventure.emerald} />;
      case "hostel":
        return <Bed size={14} color={colors.adventure.purple} />;
      case "sight":
        return <Compass size={14} color={colors.primary[100]} />;
      case "food":
        return <Utensils size={14} color={colors.adventure.amber} />;
    }
  };

  const getStatusButton = (wp: Waypoint) => {
    switch (wp.status) {
      case "done":
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: radii.sm,
            }}
          >
            <CheckCircle2 size={12} color={colors.adventure.emerald} />
            <AppText variant="caption" color={colors.adventure.emerald} style={{ fontWeight: "600" }}>
              Feito
            </AppText>
          </View>
        );
      case "in_progress":
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: "rgba(255, 104, 56, 0.15)",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: radii.sm,
            }}
          >
            <PlayCircle size={12} color={colors.primary[100]} />
            <AppText variant="caption" color={colors.primary[100]} style={{ fontWeight: "600" }}>
              Em Trânsito
            </AppText>
          </View>
        );
      case "pending":
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: colors.grayscale[600],
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: radii.sm,
            }}
          >
            <Circle size={12} color={colors.grayscale[400]} />
            <AppText variant="caption" color={colors.grayscale[300]}>
              Pendente
            </AppText>
          </View>
        );
    }
  };

  return (
    <Card variant="surface" style={{ gap: 14, padding: 16 }}>
      {/* 1. Cabeçalho do Dia com Balanço Financeiro (Pilar 3: Integração Roteiro ⇄ Despesas) */}
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: colors.grayscale[500],
          paddingBottom: 10,
          gap: 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <View
              style={{
                backgroundColor: colors.primary[100],
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: radii.sm,
                flexShrink: 0,
              }}
            >
              <AppText
                variant="caption"
                color={colors.grayscale[100]}
                style={{ fontWeight: "700" }}
              >
                DIA {dayIndex}
              </AppText>
            </View>
            <AppText variant="subheadline" style={{ fontWeight: "700" }} numberOfLines={1}>
              {date}
            </AppText>
          </View>

          <AppText variant="caption" color={colors.grayscale[300]} style={{ flexShrink: 0 }}>
            {waypoints.length} paradas
          </AppText>
        </View>

        {/* Termômetro Financeiro do Dia (Previsão vs Realidade) */}
        {dayEstimatedBase > 0 && activeTrip && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.grayscale[700],
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: radii.sm,
              borderWidth: 1,
              borderColor: colors.grayscale[500],
              marginTop: 2,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
              <Wallet size={13} color={colors.adventure.amber} />
              <AppText variant="caption" color={colors.grayscale[200]}>
                Previsto:{" "}
                <AppText variant="caption" color={colors.adventure.amber} style={{ fontWeight: "700" }}>
                  {formatMoney(dayEstimatedBase, activeTrip.baseCurrency)}
                </AppText>
              </AppText>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <Coins size={13} color={dayRealSpentBase > dayEstimatedBase ? colors.message.red : colors.adventure.emerald} />
              <AppText variant="caption" color={colors.grayscale[300]}>
                Gasto:{" "}
                <AppText
                  variant="caption"
                  color={dayRealSpentBase > dayEstimatedBase ? colors.message.red : colors.adventure.emerald}
                  style={{ fontWeight: "700" }}
                >
                  {formatMoney(dayRealSpentBase, activeTrip.baseCurrency)}
                </AppText>
              </AppText>
            </View>
          </View>
        )}
      </View>

      {/* 2. Lista de Atividades do Dia */}
      {waypoints.length === 0 ? (
        <View style={{ paddingVertical: 12, alignItems: "center" }}>
          <AppText variant="footnote" color={colors.grayscale[400]}>
            Nenhuma atividade adicionada para este dia.
          </AppText>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {waypoints.map((wp) => {
            const isMoving = movingWpId === wp.id;

            return (
              <View
                key={wp.id}
                style={{
                  backgroundColor: colors.grayscale[700],
                  borderRadius: radii.md,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.grayscale[500],
                  gap: 10,
                }}
              >
                {/* Linha Superior: Ícone, Horário com Ajuste Rápido (+/-30m) e Status */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: colors.grayscale[600],
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {getTypeIcon(wp.type)}
                    </View>

                    {/* Horário com botões de baixa fricção (-30m / +30m) */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Clock size={12} color={colors.grayscale[300]} />
                      <AppText
                        variant="caption"
                        color={colors.grayscale[100]}
                        style={{ fontWeight: "700" }}
                      >
                        {wp.time}
                      </AppText>

                      <View style={{ flexDirection: "row", gap: 2, marginLeft: 4 }}>
                        <TouchableOpacity
                          onPress={() => shiftWaypointTime(wp.id, -30)}
                          activeOpacity={0.7}
                          style={{
                            paddingHorizontal: 4,
                            paddingVertical: 1,
                            backgroundColor: colors.grayscale[600],
                            borderRadius: radii.xs,
                          }}
                        >
                          <AppText variant="footnote" color={colors.grayscale[300]}>
                            -30m
                          </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => shiftWaypointTime(wp.id, 30)}
                          activeOpacity={0.7}
                          style={{
                            paddingHorizontal: 4,
                            paddingVertical: 1,
                            backgroundColor: colors.grayscale[600],
                            borderRadius: radii.xs,
                          }}
                        >
                          <AppText variant="footnote" color={colors.grayscale[300]}>
                            +30m
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleWaypointStatus(wp.id)}
                    style={{ flexShrink: 0 }}
                  >
                    {getStatusButton(wp)}
                  </TouchableOpacity>
                </View>

                {/* Título e Localização */}
                <View style={{ gap: 2 }}>
                  <AppText
                    variant="subheadline"
                    color={
                      wp.status === "done"
                        ? colors.grayscale[300]
                        : colors.grayscale[100]
                    }
                    style={{
                      fontWeight: "700",
                      textDecorationLine:
                        wp.status === "done" ? "line-through" : "none",
                    }}
                  >
                    {wp.title}
                  </AppText>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <MapPin size={12} color={colors.grayscale[400]} />
                    <AppText variant="footnote" color={colors.grayscale[300]} numberOfLines={1}>
                      {wp.locationName}
                    </AppText>
                  </View>
                </View>

                {/* Custo Previsto vs Botão "+ Lançar Gasto" (Pilar 3) */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: colors.grayscale[800] || "rgba(10, 13, 20, 0.4)",
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    borderRadius: radii.sm,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
                    {wp.estimatedCost ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Wallet size={12} color={colors.adventure.amber} />
                        <AppText variant="caption" color={colors.adventure.amber} style={{ fontWeight: "600" }}>
                          Previsto: {wp.estimatedCurrency || "BRL"} {wp.estimatedCost}
                        </AppText>
                      </View>
                    ) : (
                      <AppText variant="footnote" color={colors.grayscale[400]}>
                        Sem custo previsto
                      </AppText>
                    )}
                  </View>

                  {/* Ação rápida de vincular / lançar despesa offline */}
                  <TouchableOpacity
                    onPress={() => onLogExpenseForWaypoint?.(wp)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: wp.linkedExpenseId
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(255, 104, 56, 0.15)",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: radii.pill,
                      borderWidth: 1,
                      borderColor: wp.linkedExpenseId
                        ? "rgba(16, 185, 129, 0.3)"
                        : "rgba(255, 104, 56, 0.3)",
                      flexShrink: 0,
                    }}
                  >
                    <Coins
                      size={12}
                      color={
                        wp.linkedExpenseId
                          ? colors.adventure.emerald
                          : colors.primary[100]
                      }
                    />
                    <AppText
                      variant="caption"
                      color={
                        wp.linkedExpenseId
                          ? colors.adventure.emerald
                          : colors.primary[100]
                      }
                      style={{ fontWeight: "700" }}
                    >
                      {wp.linkedExpenseId ? "✓ Gasto Pago" : "+ Lançar Gasto"}
                    </AppText>
                  </TouchableOpacity>
                </View>

                {/* Seletor Rápido de Mover Dia (Pilar 1: Baixa Fricção de Linha do Tempo) */}
                {isMoving && (
                  <View
                    style={{
                      backgroundColor: colors.grayscale[600],
                      padding: 8,
                      borderRadius: radii.sm,
                      gap: 6,
                    }}
                  >
                    <AppText variant="footnote" color={colors.grayscale[200]} style={{ fontWeight: "600" }}>
                      Mover parada para qual dia?
                    </AppText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                      {availableDays.map((d) => (
                        <TouchableOpacity
                          key={d}
                          onPress={() => {
                            moveWaypointToDay(wp.id, d);
                            setMovingWpId(null);
                          }}
                          activeOpacity={0.7}
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: radii.sm,
                            backgroundColor: d === wp.dayIndex ? colors.primary[100] : colors.grayscale[700],
                            borderWidth: 1,
                            borderColor: colors.grayscale[500],
                          }}
                        >
                          <AppText
                            variant="caption"
                            color={d === wp.dayIndex ? colors.grayscale[100] : colors.grayscale[300]}
                            style={{ fontWeight: "700" }}
                          >
                            Dia {d}
                          </AppText>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Metadados: Altitude, Distância e Botão Mover / Excluir */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTopWidth: 1,
                    borderColor: colors.grayscale[600],
                    paddingTop: 6,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    {wp.elevationMeters ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                        <Mountain size={11} color={colors.adventure.sky} />
                        <AppText variant="footnote" color={colors.adventure.sky}>
                          {wp.elevationMeters}m alt.
                        </AppText>
                      </View>
                    ) : null}

                    {wp.distanceKm ? (
                      <AppText variant="footnote" color={colors.grayscale[300]}>
                        {wp.distanceKm} km
                      </AppText>
                    ) : null}
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    {/* Botão Mover de Dia */}
                    <TouchableOpacity
                      onPress={() => setMovingWpId(isMoving ? null : wp.id)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        backgroundColor: colors.grayscale[600],
                        borderRadius: radii.xs,
                      }}
                    >
                      <ArrowRightLeft size={11} color={colors.grayscale[200]} />
                      <AppText variant="footnote" color={colors.grayscale[200]}>
                        {isMoving ? "Cancelar" : "Mover Dia"}
                      </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteWaypoint(wp.id)}
                      style={{ padding: 2 }}
                    >
                      <Trash2 size={13} color={colors.grayscale[400]} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </Card>
  );
};
