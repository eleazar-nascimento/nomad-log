import React from "react";
import { View, TouchableOpacity } from "react-native";
import {
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  PlayCircle,
  Mountain,
  ArrowRight,
} from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Card, Badge } from "@/components/ui";
import { useAppStore, Waypoint } from "@/store";

export const TodayTimelineWidget: React.FC<{
  onViewItineraryPress?: () => void;
}> = ({ onViewItineraryPress }) => {
  const { activeTripWaypoints, toggleWaypointStatus } = useAppStore();

  // Pega os 3 primeiros waypoints pendentes ou em andamento
  const upcomingWaypoints = activeTripWaypoints.slice(0, 3);

  const getStatusIcon = (status: Waypoint["status"]) => {
    switch (status) {
      case "done":
        return <CheckCircle2 size={18} color={colors.adventure.emerald} />;
      case "in_progress":
        return <PlayCircle size={18} color={colors.primary[100]} />;
      case "pending":
        return <Circle size={18} color={colors.grayscale[400]} />;
    }
  };

  return (
    <Card variant="surface" style={{ gap: 14, padding: 16 }}>
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
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              borderWidth: 1,
              borderColor: "rgba(56, 189, 248, 0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Clock size={16} color={colors.adventure.sky} />
          </View>
          <View>
            <AppText variant="headline" style={{ fontWeight: "700" }}>
              Cronograma da Viagem
            </AppText>
            <AppText variant="caption" color={colors.grayscale[300]}>
              Pontos de parada & trilhas offline
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          onPress={onViewItineraryPress}
          activeOpacity={0.7}
          style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
        >
          <AppText variant="caption" color={colors.primary[100]}>
            Roteiro completo
          </AppText>
          <ArrowRight size={12} color={colors.primary[100]} />
        </TouchableOpacity>
      </View>

      {/* Linha do tempo dos waypoints */}
      <View style={{ gap: 12 }}>
        {upcomingWaypoints.map((wp, index) => (
          <TouchableOpacity
            key={wp.id}
            activeOpacity={0.8}
            onPress={() => toggleWaypointStatus(wp.id)}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 12,
              paddingVertical: 4,
            }}
          >
            {/* Ícone de status clicável */}
            <View style={{ marginTop: 2 }}>{getStatusIcon(wp.status)}</View>

            <View style={{ flex: 1, gap: 2 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <AppText
                  variant="subheadline"
                  color={
                    wp.status === "done"
                      ? colors.grayscale[300]
                      : colors.grayscale[100]
                  }
                  style={{
                    fontWeight: "600",
                    textDecorationLine:
                      wp.status === "done" ? "line-through" : "none",
                  }}
                >
                  {wp.title}
                </AppText>
                <Badge
                  label={wp.time}
                  variant="neutral"
                  size="sm"
                  style={{ backgroundColor: colors.grayscale[700] }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <MapPin size={11} color={colors.grayscale[400]} />
                  <AppText variant="footnote" color={colors.grayscale[300]}>
                    {wp.locationName}
                  </AppText>
                </View>

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
                      variant="footnote"
                      color={colors.adventure.sky}
                      style={{ fontWeight: "500" }}
                    >
                      {wp.elevationMeters}m
                    </AppText>
                  </View>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
};

