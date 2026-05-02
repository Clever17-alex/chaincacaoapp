import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import Logo from "../components/Logo";

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo area */}
      <Animated.View
        style={[
          styles.logoArea,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: logoScale }],
          },
        ]}
      >
        <Logo size={100} showText={true} showTagline={true} />
      </Animated.View>

      {/* Buttons */}
      <Animated.View style={[styles.buttonArea, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryBtnText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          activeOpacity={0.6}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.outlineBtnText}>Créer un compte</Text>
        </TouchableOpacity>

        {/* Badge */}
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
    backgroundColor: Colors.darkBase,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg * 2,
    paddingVertical: Spacing.xxl * 2,
  },
  logoArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonArea: {
    gap: Spacing.md,
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    width: "100%",
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  primaryBtnText: {
    fontFamily: "System",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.white,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: Colors.white,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    width: "100%",
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  outlineBtnText: {
    fontFamily: "System",
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.white,
  },
  badge: {
    fontFamily: "System",
    fontSize: FontSize.xs,
    color: Colors.lightNeutral,
    opacity: 0.3,
    marginTop: Spacing.lg,
  },
});
