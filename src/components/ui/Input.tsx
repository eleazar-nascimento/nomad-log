import React from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Platform,
} from "react-native";
import { colors, radii } from "@/theme";
import { AppText } from "./Typography";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...props
}) => {
  const isMultiline = props.multiline;

  return (
    <View style={{ width: "100%", gap: 6 }}>
      {label && (
        <AppText variant="caption" color={colors.grayscale[200]}>
          {label}
        </AppText>
      )}
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: isMultiline ? "flex-start" : "center",
            backgroundColor: colors.grayscale[700],
            borderWidth: 1,
            borderColor: error ? colors.message.red : colors.grayscale[500],
            borderRadius: radii.md,
            paddingHorizontal: 12,
            paddingVertical: isMultiline ? 10 : 0,
            minHeight: isMultiline ? 84 : 48,
            height: isMultiline ? undefined : 48,
            gap: 10,
          },
          containerStyle,
        ]}
      >
        {leftIcon && (
          <View style={{ marginTop: isMultiline ? 2 : 0 }}>{leftIcon}</View>
        )}
        <TextInput
          placeholderTextColor={colors.grayscale[400]}
          textAlignVertical={isMultiline ? "top" : "center"}
          style={[
            {
              flex: 1,
              color: colors.grayscale[100],
              fontSize: 15,
              fontFamily: "SpaceGrotesk_400Regular",
              paddingTop: isMultiline ? (Platform.OS === "android" ? 0 : 2) : 0,
              paddingBottom: 0,
              textAlignVertical: isMultiline ? "top" : "center",
            },
            style,
          ]}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            disabled={!onRightIconPress}
            onPress={onRightIconPress}
            style={{ marginTop: isMultiline ? 2 : 0 }}
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


