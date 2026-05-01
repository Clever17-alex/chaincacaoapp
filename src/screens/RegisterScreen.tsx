import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleNext = () => setStep(2);
  const handleRegister = () => navigation.navigate('Home');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (step === 2) setStep(1);
            else navigation.goBack();
          }}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>
          Rejoignez les producteurs de cacao traçable
        </Text>

        {/* Step indicator */}
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.stepActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step === 2 && styles.stepActive]} />
        </View>

        {step === 1 ? (
          <>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Kofi Mensah"
              placeholderTextColor={Colors.gray}
            />

            <Text style={styles.label}>Village / Localité</Text>
            <TextInput
              style={styles.input}
              value={village}
              onChangeText={setVillage}
              placeholder="Womé, Plateaux"
              placeholderTextColor={Colors.gray}
            />

            <Text style={styles.label}>Téléphone</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+228</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="90 00 00 00"
                placeholderTextColor={Colors.gray}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.8}
              onPress={handleNext}
            >
              <Text style={styles.primaryBtnText}>Suivant →</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 6 caractères"
                placeholderTextColor={Colors.gray}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.idPreview}>
              Votre ID: AGRI-TOGO-{Math.floor(1000 + Math.random() * 9000)}
            </Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.8}
              onPress={handleRegister}
            >
              <Text style={styles.primaryBtnText}>Créer mon compte</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>
            Déjà un compte ? <Text style={styles.loginLinkBold}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBase,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl * 2,
    paddingBottom: Spacing.xl,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  backArrow: {
    fontSize: 28,
    color: Colors.white,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.gray,
    marginBottom: Spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.grayDark,
  },
  stepActive: {
    backgroundColor: Colors.accentWarm,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.grayDark,
    marginHorizontal: Spacing.sm,
  },
  label: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.lightNeutral,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: 'System',
    color: Colors.white,
    minHeight: 50,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  countryCode: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    minHeight: 50,
  },
  countryCodeText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.white,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: 'System',
    color: Colors.white,
    minHeight: 50,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: 'System',
    color: Colors.white,
    minHeight: 50,
  },
  eyeBtn: {
    padding: Spacing.sm,
  },
  eyeIcon: {
    fontSize: 20,
  },
  idPreview: {
    fontFamily: 'monospace',
    fontSize: FontSize.sm,
    color: Colors.accentWarm,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
    minHeight: 52,
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  loginLinkText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
  },
  loginLinkBold: {
    color: Colors.accentWarm,
    fontWeight: '700',
  },
});