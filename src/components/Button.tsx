import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? Colors.dark : Colors.accent}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              styles.text,
              styles[`text${variant}`],
              styles[`text${size}`],
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.sm,
  },
  primary: { backgroundColor: Colors.accent },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  ghost: { backgroundColor: "transparent" },
  sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 40,
  },
  md: {
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.lg,
    minHeight: 48,
  },
  lg: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minHeight: 56,
  },
  fullWidth: { width: "100%" },
  disabled: { opacity: 0.4 },
  content: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  text: { fontWeight: "600", letterSpacing: 0.3 },
  textprimary: { color: Colors.dark },
  textoutline: { color: Colors.accent },
  textghost: { color: Colors.textSecondary },
  textsm: { fontSize: FontSize.sm },
  textmd: { fontSize: FontSize.md },
  textlg: { fontSize: FontSize.lg },
});
