import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';

export default function SplashScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Logo area */}
      <View style={styles.logoArea}>
        {/* Hexagon icon placeholder */}
        <View style={styles.hexagon}>
          <Text style={styles.hexagonChar}>₵</Text>
        </View>
        <Text style={styles.appName}>ChainCacao</Text>
        <Text style={styles.tagline}>
          De la ferme togolaise à l'Europe.{'\n'}En 3 minutes. Sans fraude.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryBtnText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.outlineBtnText}>Créer un compte</Text>
        </TouchableOpacity>

        {/* Badge */}
        <Text style={styles.badge}>
          Hackathon MIABE 2026 · Darollo Technologies
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBase,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg * 2,
    paddingVertical: Spacing.xxl * 2,
  },
  logoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentWarm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    transform: [{ rotate: '45deg' }],
  },
  hexagonChar: {
    fontSize: 36,
    color: Colors.white,
    fontWeight: 'bold',
    transform: [{ rotate: '-45deg' }],
  },
  appName: {
    fontFamily: 'serif',
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  tagline: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonArea: {
    gap: Spacing.md,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    width: '100%',
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: Colors.white,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    width: '100%',
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  outlineBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.white,
  },
  badge: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.lightNeutral,
    opacity: 0.3,
    marginTop: Spacing.lg,
  },
});