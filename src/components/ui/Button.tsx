import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from "react-native";
import { colors, radii } from "@/theme";
import { AppText } from "./Typography";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled,
  style,
  ...props
}) => {
  const getColors = () => {
    if (disabled) {
      return {
        bg: colors.grayscale[500],
        text: colors.grayscale[300],
        border: "transparent",
      };
    }
    switch (variant) {
      case "primary":
        return {
          bg: colors.primary[100],
          text: colors.grayscale[100],
          border: "transparent",
        };
      case "secondary":
        return {
          bg: colors.grayscale[500],
          text: colors.grayscale[100],
          border: colors.grayscale[400],
        };
      case "outline":
        return {
          bg: "transparent",
          text: colors.primary[100],
          border: colors.primary[100],
        };
      case "danger":
        return {
          bg: colors.message.red,
          text: colors.grayscale[100],
          border: "transparent",
        };
      case "ghost":
        return {
          bg: "transparent",
          text: colors.grayscale[200],
          border: "transparent",
        };
    }
  };

  const getPadding = () => {
    switch (size) {
      case "sm":
        return { py: 8, px: 14, height: 36 };
      case "md":
        return { py: 12, px: 18, height: 46 };
      case "lg":
        return { py: 15, px: 24, height: 54 };
    }
  };

  const c = getColors();
  const p = getPadding();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: c.bg,
          borderWidth: c.border !== "transparent" ? 1 : 0,
          borderColor: c.border,
          borderRadius: radii.md,
          height: p.height,
          paddingHorizontal: p.px,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={c.text} />
      ) : (
        <>
          {icon && iconPosition === "left" && <View>{icon}</View>}
          <AppText
            variant={size === "sm" ? "caption" : "headline"}
            color={c.text}
          >
            {title}
          </AppText>
          {icon && iconPosition === "right" && <View>{icon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

export const IconButton: React.FC<{
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number;
  bg?: string;
  borderColor?: string;
}> = ({
  icon,
  onPress,
  size = 40,
  bg = colors.grayscale[600],
  borderColor = colors.grayscale[500],
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: borderColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </TouchableOpacity>
  );
};

