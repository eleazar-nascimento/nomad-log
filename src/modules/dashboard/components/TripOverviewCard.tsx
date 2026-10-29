import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { MapPin, Calendar, Compass, ArrowUpRight } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText, Badge } from "@/components/ui";
import { Trip } from "@/store";

export const TripOverviewCard: React.FC<{
  trip: Trip;
  onPress?: () => void;
}> = ({ trip, onPress }) => {
  // Calcula duração e dias restantes
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const diffDays = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24))
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        borderRadius: radii["2xl"],
        overflow: "hidden",
        backgroundColor: colors.grayscale[600],
        borderWidth: 1,
        borderColor: colors.grayscale[500],
      }}
    >
      <View style={{ height: 160, position: "relative" }}>
        <Image
          source={{ uri: trip.coverImage }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        {/* Gradiente escuro para legibilidade */}
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(15, 18, 26, 0.65)",
          }}
        />

        {/* Badges superiores */}
        <View
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            right: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", gap: 6 }}>
            {trip.countries.map((c) => (
              <Badge key={c} label={c} variant="neutral" size="sm" />
            ))}
          </View>
          <Badge
            label={`${diffDays} dias`}
            variant="primary"
            size="sm"
            icon={<Calendar size={11} color={colors.primary[100]} />}
          />
        </View>

        {/* Título inferior sobre a foto */}
        <View style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
          <AppText
            variant="title3"
            color={colors.grayscale[100]}
            style={{ fontWeight: "700" }}
          >
            {trip.title}
          </AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 3,
            }}
          >
            <MapPin size={13} color={colors.adventure.amber} />
            <AppText variant="caption" color={colors.grayscale[200]}>
              {trip.destination}
            </AppText>
          </View>
        </View>
      </View>

      {/* Barra de moedas da viagem */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.grayscale[600],
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <AppText variant="caption" color={colors.grayscale[300]}>
            Moedas ativas:
          </AppText>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {trip.localCurrencies.map((cur) => (
              <View
                key={cur}
                style={{
                  backgroundColor: colors.grayscale[700],
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: radii.sm,
                  borderWidth: 1,
                  borderColor: colors.grayscale[500],
                }}
              >
                <AppText
                  variant="caption"
                  color={colors.adventure.amber}
                  style={{ fontWeight: "600" }}
                >
                  {cur}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <AppText variant="caption" color={colors.primary[100]}>
            Ver detalhes
          </AppText>
          <ArrowUpRight size={13} color={colors.primary[100]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

