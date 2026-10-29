import React from "react";
import { ViewProps, Platform } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

export interface AnimatedContainerProps extends ViewProps {
  delay?: number;
  direction?: "up" | "down" | "fade";
  duration?: number;
  spring?: boolean;
  enableLayoutTransition?: boolean;
  children: React.ReactNode;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  delay = 0,
  direction = "down",
  duration = 450,
  spring = true,
  enableLayoutTransition = true,
  style,
  children,
  ...props
}) => {
  const getEntering = () => {
    let anim =
      direction === "down"
        ? FadeInDown
        : direction === "up"
        ? FadeInUp
        : FadeIn;

    let configured = anim.duration(duration).delay(delay);
    if (spring) {
      configured = configured.springify().damping(16).mass(0.8);
    }
    return configured;
  };

  return (
    <Animated.View
      entering={getEntering()}
      exiting={FadeOut.duration(200)}
      layout={enableLayoutTransition ? LinearTransition.springify().damping(18) : undefined}
      style={style}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

