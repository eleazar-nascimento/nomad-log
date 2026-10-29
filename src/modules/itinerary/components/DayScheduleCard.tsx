import React from "react";
import { View, TouchableOpacity } from "react-native";
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
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge } from "@/components/ui";
import { Waypoint, WaypointType, useAppStore } from "@/store";

export const DayScheduleCard: React.FC<{
  dayIndex: number;
  date: string;
  waypoints: Waypoint[];
  onAddWaypointPress?: () => void;
}> = ({ dayIndex, date, waypoints, onAddWaypointPress }) => {
  const { toggleWaypointStatus, deleteWaypoint } = useAppStore();

  const getTypeIcon = (type: WaypointType) => {
    switch (type) {
      case "flight":
        return <Plane size={15} color={colors.adventure.sky} />;
      case "bus":
        return <Bus size={15} color={colors.adventure.amber} />;
      case "train":
        return <Train size={15} color={colors.adventure.indigo} />;
      case "trek":
        return <Mountain size={15} color={colors.adventure.emerald} />;
      case "hostel":
        return <Bed size={15} color={colors.adventure.purple} />;
      case "sight":
        return <Compass size={15} color={colors.primary[100]} />;
      case "food":
        return <Utensils size={15} color={colors.adventure.amber} />;
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
              paddingVertical: 4,
              borderRadius: radii.sm,
            }}
          >
            <CheckCircle2 size={13} color={colors.adventure.emerald} />
            <AppText variant="caption" color={colors.adventure.emerald}>
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
              paddingVertical: 4,
              borderRadius: radii.sm,
            }}
          >
            <PlayCircle size={13} color={colors.primary[100]} />
            <AppText variant="caption" color={colors.primary[100]}>
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
              paddingVertical: 4,
              borderRadius: radii.sm,
            }}
          >
            <Circle size={13} color={colors.grayscale[400]} />
            <AppText variant="caption" color={colors.grayscale[300]}>
              Pendente
            </AppText>
          </View>
        );
    }
  };

  return (
    <Card variant="surface" style={{ gap: 14, padding: 16 }}>
      {/* Cabeçalho do Dia */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderColor: colors.grayscale[500],
          paddingBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              backgroundColor: colors.primary[100],
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: radii.sm,
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
          <AppText variant="subheadline" style={{ fontWeight: "600" }}>
            {date}
          </AppText>
        </View>

        <AppText variant="caption" color={colors.grayscale[300]}>
          {waypoints.length} paradas planejadas
        </AppText>
      </View>

      {/* Lista de Waypoints */}
      {waypoints.length === 0 ? (
        <View style={{ paddingVertical: 12, alignItems: "center" }}>
          <AppText variant="footnote" color={colors.grayscale[400]}>
            Nenhuma atividade adicionada para este dia.
          </AppText>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {waypoints.map((wp) => (
            <View
              key={wp.id}
              style={{
                backgroundColor: colors.grayscale[700],
                borderRadius: radii.md,
                padding: 12,
                borderWidth: 1,
                borderColor: colors.grayscale[500],
                gap: 8,
              }}
            >
              {/* Linha superior: Hora, Tipo e Status */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: colors.grayscale[600],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {getTypeIcon(wp.type)}
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Clock size={12} color={colors.grayscale[300]} />
                    <AppText
                      variant="caption"
                      color={colors.grayscale[200]}
                      style={{ fontWeight: "700" }}
                    >
                      {wp.time}
                    </AppText>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleWaypointStatus(wp.id)}
                >
                  {getStatusButton(wp)}
                </TouchableOpacity>
              </View>

              {/* Título e Local */}
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

                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <MapPin size={12} color={colors.grayscale[400]} />
                  <AppText variant="footnote" color={colors.grayscale[300]}>
                    {wp.locationName}
                  </AppText>
                </View>
              </View>

              {/* Metadados: Altitude, Distância e Notas */}
              {(wp.elevationMeters || wp.distanceKm || wp.notes) && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTopWidth: 1,
                    borderColor: colors.grayscale[600],
                    paddingTop: 6,
                    marginTop: 2,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {wp.elevationMeters ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Mountain size={11} color={colors.adventure.sky} />
                        <AppText
                          variant="caption"
                          color={colors.adventure.sky}
                        >
                          {wp.elevationMeters}m alt.
                        </AppText>
                      </View>
                    ) : null}

                    {wp.distanceKm ? (
                      <AppText variant="caption" color={colors.grayscale[300]}>
                        {wp.distanceKm} km
                      </AppText>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    onPress={() => deleteWaypoint(wp.id)}
                    style={{ padding: 2 }}
                  >
                    <Trash2 size={13} color={colors.grayscale[400]} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

