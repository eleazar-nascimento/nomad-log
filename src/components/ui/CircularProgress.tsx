import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/theme";
import { AppText } from "./Typography";

export interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 a 100
  color?: string;
  trackColor?: string;
  centerText?: string;
  subtitle?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 110,
  strokeWidth = 9,
  progress = 0,
  color = colors.primary[100],
  trackColor = colors.grayscale[500],
  centerText,
  subtitle,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const strokeDashoffset = circumference - (circumference * clampedProgress) / 100;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        {/* Trilho de fundo */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Arco de progresso */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      <View
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AppText variant="title2" style={{ fontWeight: "700" }}>
          {centerText || `${Math.round(clampedProgress)}%`}
        </AppText>
        {subtitle && (
          <AppText
            variant="caption"
            color={colors.grayscale[300]}
            style={{ marginTop: -2 }}
          >
            {subtitle}
          </AppText>
        )}
      </View>
    </View>
  );
};

