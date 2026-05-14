import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import Button from "../components/Button";

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoArea,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>ChainCacao</Text>
        <Text style={styles.tagline}>
          Traçabilité blockchain{"\n"}du cacao togolais
        </Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>
          Conforme EUDR · 3 minutes · Sans fraude
        </Text>
      </Animated.View>

      <Animated.View style={[styles.buttonArea, { opacity: fadeAnim }]}>
        <View style={styles.glassCard}>
          <Button
            title="Se connecter"
            onPress={() => navigation.navigate("Login")}
            variant="primary"
            size="lg"
            fullWidth
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Créer un compte"
            onPress={() => navigation.navigate("Register")}
            variant="outline"
            size="lg"
            fullWidth
          />
        </View>
        <Text style={styles.badge}>
          Hackathon MIABE 2026 · Darollo Technologies
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  logoArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.darkCard,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  logo: { width: 64, height: 64 },
  appName: {
    fontFamily: "serif",
    fontSize: FontSize.title,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginTop: Spacing.sm,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: Colors.accent,
    marginVertical: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.accentLight,
    letterSpacing: 0.5,
  },
  buttonArea: { gap: Spacing.md },
  glassCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  buttonSpacer: { height: Spacing.sm },
  badge: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});
