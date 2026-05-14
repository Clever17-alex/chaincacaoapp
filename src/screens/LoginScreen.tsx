import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Tous les champs sont requis'); return; }
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigation.navigate('Home');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Email ou mot de passe incorrect');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoRing}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.appName}>ChainCacao</Text>
          <Text style={styles.tagline}>Traçabilité blockchain du cacao togolais</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Connexion</Text>
          
          <Input 
            label="Email" 
            value={email} 
            onChangeText={(t) => { setEmail(t); setError(''); }} 
            placeholder="votre@email.com" 
            keyboardType="email-address" 
            autoCapitalize="none"
            dark 
          />
          
          <Input 
            label="Mot de passe" 
            value={password} 
            onChangeText={(t) => { setPassword(t); setError(''); }} 
            placeholder="••••••••" 
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? '◉' : '○'} 
            onRightIconPress={() => setShowPassword(!showPassword)}
            dark 
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button title="Se connecter" onPress={handleLogin} variant="primary" size="lg" fullWidth loading={loading} />
        </View>

        {/* Lien register */}
        <TouchableOpacity style={styles.linkArea} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            Nouveau sur ChainCacao ? <Text style={styles.linkBold}>Créer un compte</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },
  logoSection: { alignItems: 'center', marginBottom: Spacing.xl },
  logoRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.darkCard, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  logo: { width: 48, height: 48 },
  appName: { fontFamily: 'serif', fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 1 },
  tagline: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  formCard: { backgroundColor: Colors.darkCard, borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  formTitle: { fontFamily: 'serif', fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.lg },
  errorBox: { backgroundColor: Colors.errorBg, borderRadius: BorderRadius.sm, padding: Spacing.md, marginBottom: Spacing.md, borderLeftWidth: 2, borderLeftColor: Colors.error },
  errorText: { color: Colors.error, fontSize: FontSize.sm },
  linkArea: { alignItems: 'center', marginTop: Spacing.xl },
  linkText: { fontSize: FontSize.md, color: Colors.textSecondary },
  linkBold: { color: Colors.accent, fontWeight: '600' },
});