import React from "react";
import { View, ViewProps, TouchableOpacity } from "react-native";
import { colors, radii, shadows } from "@/theme";

export interface CardProps extends ViewProps {
  variant?: "surface" | "elevated" | "accent" | "highlight";
  onPress?: () => void;
  accentBorderColor?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = "surface",
  onPress,
  accentBorderColor,
  style,
  children,
  ...props
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case "surface":
        return {
          backgroundColor: colors.grayscale[600],
          borderColor: accentBorderColor || colors.grayscale[500],
        };
      case "elevated":
        return {
          backgroundColor: "#1A202C",
          borderColor: accentBorderColor || colors.grayscale[400],
        };
      case "accent":
        return {
          backgroundColor: "rgba(255, 104, 56, 0.08)",
          borderColor: accentBorderColor || "rgba(255, 104, 56, 0.3)",
        };
      case "highlight":
        return {
          backgroundColor: "rgba(245, 158, 11, 0.08)",
          borderColor: accentBorderColor || "rgba(245, 158, 11, 0.3)",
        };
    }
  };

  const current = getCardStyle();

  const containerStyle = [
    {
      borderRadius: radii.lg,
      borderWidth: 1,
      padding: 16,
      backgroundColor: current.backgroundColor,
      borderColor: current.borderColor,
      ...shadows.sm,
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={containerStyle}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

