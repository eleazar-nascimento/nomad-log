import React, { useEffect, useState } from "react";
import { TextStyle } from "react-native";
import { AppText } from "./Typography";
import { TypographyVariant } from "@/theme";

export interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  variant?: TypographyVariant;
  color?: string;
  style?: TextStyle;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  variant = "title1",
  color,
  style,
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const duration = 500; // 500ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing cubic ease out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  const formatted = displayValue.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <AppText variant={variant} color={color} style={style}>
      {prefix}
      {formatted}
      {suffix}
    </AppText>
  );
};

