import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Compass, ChevronDown, Crown, Settings } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText } from "@/components/ui";
import { useDeviceChrome } from "@/components/ui/DeviceChrome";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

export const TopHeader: React.FC<{
  onOpenTripManager?: () => void;
  onOpenProModal?: () => void;
}> = ({ onOpenTripManager, onOpenProModal }) => {
  const router = useRouter();
  const { activeTrip, isPro } = useAppStore();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isFramedWeb = useDeviceChrome();

  // Em celulares físicos (iOS com Dynamic Island / Notch ou Android com punch hole),
  // ou em navegadores móveis no iPhone, respeitamos a Safe Area do topo.
  const isIOS =
    Platform.OS === "ios" ||
    (Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      /iPhone|iPad|iPod/.test(navigator.userAgent));

  const safeTopPadding = isFramedWeb
    ? 12
    : Math.max(insets.top > 0 ? insets.top + 6 : (isIOS ? 56 : 36), 16);

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
              {activeTrip?.title || t.header.myTrip}
            </AppText>
            <ChevronDown size={14} color={colors.grayscale[300]} />
          </View>
          <AppText
            variant="caption"
            color={colors.grayscale[300]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeTrip?.destination || t.header.remoteDestination} • {t.header.base}: {activeTrip?.baseCurrency}
          </AppText>
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenProModal}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: isPro
              ? "rgba(245, 158, 11, 0.15)"
              : "rgba(255, 104, 56, 0.15)",
            borderWidth: 1,
            borderColor: isPro
              ? "rgba(245, 158, 11, 0.4)"
              : "rgba(255, 104, 56, 0.3)",
            paddingHorizontal: 9,
            paddingVertical: 6,
            borderRadius: radii.pill,
            alignSelf: "center",
          }}
        >
          <Crown
            size={13}
            color={isPro ? colors.adventure.amber : colors.primary[100]}
          />
          <AppText
            variant="caption"
            color={isPro ? colors.adventure.amber : colors.primary[100]}
            style={{ fontWeight: "700" }}
          >
            {isPro ? t.header.proActive : t.header.proBadge}
          </AppText>
        </TouchableOpacity>

        {/* Botão de Configurações & Exportação */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/settings" as any)}
          accessibilityLabel={t.header.settingsTooltip}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.grayscale[600],
            borderWidth: 1,
            borderColor: colors.grayscale[500],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Settings size={15} color={colors.grayscale[200]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

