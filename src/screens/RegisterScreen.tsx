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

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateActorID = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `AGRI-TOGO-${num}`;
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !organization) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const actorID = generateActorID();
      await register({
        actorID,
        name,
        role: 'FARMER',
        email,
        organization,
        password,
      });
      navigation.navigate('Home');
    } catch (err: any) {
      const message = err.response?.data?.error || "Erreur lors de l'inscription.";
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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>
          Rejoignez les producteurs de cacao traçable
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Nom complet</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Kofi Mensah"
          placeholderTextColor={Colors.gray}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="kofi@email.com"
          placeholderTextColor={Colors.gray}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Village / Organisation</Text>
        <TextInput
          style={styles.input}
          value={organization}
          onChangeText={setOrganization}
          placeholder="Coopérative Koffah, Womé"
          placeholderTextColor={Colors.gray}
        />

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
          Votre ID: {generateActorID()}
        </Text>

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          activeOpacity={0.8}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.primaryBtnText}>Créer mon compte</Text>
          )}
        </TouchableOpacity>

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
  primaryBtnDisabled: {
    opacity: 0.7,
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