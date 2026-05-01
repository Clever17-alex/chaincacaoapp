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
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigation.navigate('Home');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erreur de connexion. Vérifiez vos identifiants.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.hexagon}>
            <Text style={styles.hexChar}>₵</Text>
          </View>
          <Text style={styles.appName}>ChainCacao</Text>
          <Text style={styles.tagline}>
            De la ferme togolaise à l'Europe.{'\n'}En 3 minutes. Sans fraude.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Se connecter</Text>

          {/* Message d'erreur */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Email ou Téléphone</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            placeholder="kofi@email.com ou +228 90 00 00 00"
            placeholderTextColor={Colors.gray}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              placeholder="••••••••"
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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.loginBtnText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerLinkText}>
              Pas encore de compte ?{' '}
              <Text style={styles.registerLinkBold}>Créer un compte</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.badge}>Hackathon MIABE 2026 · Darollo Technologies</Text>
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
  logoArea: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  hexagon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentWarm,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
    marginBottom: Spacing.lg,
  },
  hexChar: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: 'bold',
    transform: [{ rotate: '-45deg' }],
  },
  appName: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  formTitle: {
    fontFamily: 'serif',
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  errorBox: {
    backgroundColor: Colors.errorBg,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.alertRed,
  },
  errorText: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.alertRed,
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
    marginLeft: Spacing.xs,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
  },
  forgotPasswordText: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.accentWarm,
  },
  loginBtn: {
    backgroundColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    minHeight: 52,
    justifyContent: 'center',
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.gray,
  },
  registerLink: {
    alignItems: 'center',
  },
  registerLinkText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
  },
  registerLinkBold: {
    color: Colors.accentWarm,
    fontWeight: '700',
  },
  badge: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.lightNeutral,
    opacity: 0.3,
    textAlign: 'center',
  },
});