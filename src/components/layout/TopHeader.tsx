import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Compass, ChevronDown, Crown } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText } from "@/components/ui";
import { useDeviceChrome } from "@/components/ui/DeviceChrome";
import { useAppStore } from "@/store";

export const TopHeader: React.FC<{
  onOpenTripManager?: () => void;
  onOpenProModal?: () => void;
}> = ({ onOpenTripManager, onOpenProModal }) => {
  const { activeTrip, isPro } = useAppStore();
  const insets = useSafeAreaInsets();
  const isFramedWeb = useDeviceChrome();

  // Em celulares físicos (iOS com Dynamic Island / Notch ou Android com punch hole),
  // respeitamos o topo seguro do sistema. No modo mockup web desktop, a moldura já
  // desenha a barra de status dedicada de 52px.
  const safeTopPadding = isFramedWeb
    ? 10
    : Math.max(insets.top > 0 ? insets.top + 4 : (Platform.OS === "ios" ? 54 : 32), 16);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: safeTopPadding,
        paddingBottom: 12,
        backgroundColor: colors.grayscale[700],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onOpenTripManager}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          flex: 1,
          marginRight: 10,
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: radii.md,
            backgroundColor: "rgba(255, 104, 56, 0.15)",
            borderWidth: 1,
            borderColor: "rgba(255, 104, 56, 0.35)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Compass size={20} color={colors.primary[100]} />
        </View>

        <View style={{ flex: 1, marginRight: 8, justifyContent: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <AppText
              variant="headline"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontWeight: "700", flexShrink: 1 }}
            >
              {activeTrip?.title || "Minha Viagem"}
            </AppText>
            <ChevronDown size={14} color={colors.grayscale[300]} />
          </View>
          <AppText
            variant="caption"
            color={colors.grayscale[300]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeTrip?.destination || "Destino remoto"} • Base: {activeTrip?.baseCurrency}
          </AppText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onOpenProModal}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: isPro
            ? "rgba(245, 158, 11, 0.15)"
            : "rgba(255, 104, 56, 0.15)",
          borderWidth: 1,
          borderColor: isPro
            ? "rgba(245, 158, 11, 0.4)"
            : "rgba(255, 104, 56, 0.3)",
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: radii.pill,
          alignSelf: "center",
        }}
      >
        <Crown
          size={14}
          color={isPro ? colors.adventure.amber : colors.primary[100]}
        />
        <AppText
          variant="caption"
          color={isPro ? colors.adventure.amber : colors.primary[100]}
          style={{ fontWeight: "700" }}
        >
          {isPro ? "PRO" : "PRO"}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

