import React from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { colors, radii } from "@/theme";
import { AppText } from "./Typography";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  return (
    <View style={{ width: "100%", gap: 6 }}>
      {label && (
        <AppText variant="caption" color={colors.grayscale[200]}>
          {label}
        </AppText>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.grayscale[700],
          borderWidth: 1,
          borderColor: error ? colors.message.red : colors.grayscale[500],
          borderRadius: radii.md,
          paddingHorizontal: 12,
          height: 48,
          gap: 10,
        }}
      >
        {leftIcon && <View>{leftIcon}</View>}
        <TextInput
          placeholderTextColor={colors.grayscale[400]}
          style={[
            {
              flex: 1,
              color: colors.grayscale[100],
              fontSize: 15,
              fontFamily: "SpaceGrotesk_400Regular",
            },
            style,
          ]}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            disabled={!onRightIconPress}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <AppText variant="footnote" color={colors.message.red}>
          {error}
        </AppText>
      )}
    </View>
  );
};

