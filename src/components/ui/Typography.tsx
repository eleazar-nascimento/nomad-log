import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { colors, typography, TypographyVariant } from "@/theme";

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle["textAlign"];
  children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = "body",
  color = colors.grayscale[100],
  align = "left",
  style,
  children,
  ...props
}) => {
  const typo = typography[variant] || typography.body;

  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: typo.fontFamily,
          fontSize: typo.fontSize,
          lineHeight: typo.lineHeight,
          letterSpacing: typo.letterSpacing,
          color,
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

