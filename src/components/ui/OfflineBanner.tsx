import React from "react";
import { View, TouchableOpacity } from "react-native";
import { WifiOff, RefreshCw, CheckCircle2, ShieldCheck } from "lucide-react-native";
import { colors, radii } from "@/theme";
import { AppText } from "./Typography";
import { useAppStore } from "@/store";
import { useTranslation } from "@/i18n";

export const OfflineBanner: React.FC<{ onPress?: () => void }> = ({
  onPress,
}) => {
  const { state } = useAppStore();
  const { t, isPt } = useTranslation();
  const queueCount = state.mutationQueue.length;

  const getHoursAgo = (ts: number) => {
    const diff = Math.max(0, Date.now() - ts);
    const hours = Math.floor(diff / 3600000);
    if (isPt) {
      if (hours === 0) return "há menos de 1h";
      if (hours === 1) return "há 1h";
      return `há ${hours}h`;
    } else {
      if (hours === 0) return "<1h ago";
      if (hours === 1) return "1h ago";
      return `${hours}h ago`;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderBottomWidth: 1,
        borderColor: colors.grayscale[500],
        paddingHorizontal: 16,
        paddingVertical: 7,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          flex: 1,
          minWidth: 0,
          marginRight: 8,
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: state.isOfflineMode
              ? "rgba(245, 158, 11, 0.15)"
              : "rgba(16, 185, 129, 0.15)",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {state.isOfflineMode ? (
            <WifiOff size={14} color={colors.adventure.amber} />
          ) : (
            <ShieldCheck size={14} color={colors.adventure.emerald} />
          )}
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText
            variant="caption"
            numberOfLines={1}
            ellipsizeMode="tail"
            color={
              state.isOfflineMode
                ? colors.adventure.amber
                : colors.adventure.emerald
            }
            style={{ fontWeight: "700" }}
          >
            {state.isOfflineMode
              ? t.header.offlineModeActive
              : t.header.onlineWithBackup}
          </AppText>
          <AppText
            variant="footnote"
            numberOfLines={1}
            ellipsizeMode="tail"
            color={colors.grayscale[300]}
          >
            {isPt ? "Câmbio atualizado" : "FX rates updated"}{" "}
            {getHoursAgo(state.ratesSnapshotTimestamp)}
          </AppText>
        </View>
      </View>

      <View style={{ flexShrink: 0 }}>
        {queueCount > 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: "rgba(255, 104, 56, 0.15)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: radii.pill,
              borderWidth: 1,
              borderColor: "rgba(255, 104, 56, 0.3)",
            }}
          >
            <RefreshCw size={11} color={colors.primary[100]} />
            <AppText
              variant="caption"
              color={colors.primary[100]}
              style={{ fontWeight: "600" }}
            >
              {queueCount} {t.header.queuePending}
            </AppText>
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <CheckCircle2 size={13} color={colors.adventure.emerald} />
            <AppText variant="caption" color={colors.adventure.emerald}>
              {t.header.savedLocally}
            </AppText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
