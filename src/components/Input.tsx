import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  error?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  dark?: boolean;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
  error,
  rightIcon,
  onRightIconPress,
  dark = false,
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          dark && styles.inputWrapperDark,
          error && styles.inputError,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            dark && styles.inputDark,
            multiline && styles.multiline,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={
            dark ? Colors.textMuted : Colors.textLightSecondary
          }
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconBtn}
          >
            <Text style={[styles.rightIcon, dark && styles.rightIconDark]}>
              {rightIcon}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.textLightSecondary,
    marginBottom: Spacing.xs,
  },
  labelDark: { color: Colors.textSecondary },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightBg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputWrapperDark: {
    backgroundColor: Colors.darkInput,
    borderColor: Colors.border,
  },
  inputError: { borderColor: Colors.error },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
    fontSize: FontSize.md,
    color: Colors.textLight,
  },
  inputDark: { color: Colors.textPrimary },
  multiline: { minHeight: 100, textAlignVertical: "top" },
  rightIconBtn: { paddingRight: Spacing.md, paddingLeft: Spacing.sm },
  rightIcon: { fontSize: 16, color: Colors.textLightSecondary },
  rightIconDark: { color: Colors.textMuted },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
