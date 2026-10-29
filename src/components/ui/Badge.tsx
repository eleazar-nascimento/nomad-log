import React from "react";
import { View, ViewStyle } from "react-native";
import { colors, radii } from "@/theme";
import { AppText } from "./Typography";

export interface BadgeProps {
  label: string;
  variant?: "primary" | "emerald" | "amber" | "sky" | "purple" | "neutral";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  size = "md",
  icon,
  style,
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case "primary":
        return {
          bg: "rgba(255, 104, 56, 0.15)",
          border: "rgba(255, 104, 56, 0.4)",
          text: colors.primary[100],
        };
      case "emerald":
        return {
          bg: "rgba(16, 185, 129, 0.15)",
          border: "rgba(16, 185, 129, 0.4)",
          text: colors.adventure.emerald,
        };
      case "amber":
        return {
          bg: "rgba(245, 158, 11, 0.15)",
          border: "rgba(245, 158, 11, 0.4)",
          text: colors.adventure.amber,
        };
      case "sky":
        return {
          bg: "rgba(56, 189, 248, 0.15)",
          border: "rgba(56, 189, 248, 0.4)",
          text: colors.adventure.sky,
        };
      case "purple":
        return {
          bg: "rgba(168, 85, 247, 0.15)",
          border: "rgba(168, 85, 247, 0.4)",
          text: colors.adventure.purple,
        };
      case "neutral":
        return {
          bg: colors.grayscale[500],
          border: colors.grayscale[400],
          text: colors.grayscale[200],
        };
    }
  };

  const st = getBadgeStyle();
  const isSm = size === "sm";

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 6 : 10,
          borderRadius: radii.pill,
          backgroundColor: st.bg,
          borderWidth: 1,
          borderColor: st.border,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      {icon && <View>{icon}</View>}
      <AppText variant="caption" color={st.text} style={{ fontWeight: "600" }}>
        {label}
      </AppText>
    </View>
  );
};

