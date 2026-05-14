import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Colors, Spacing, FontSize, BorderRadius } from "../theme/colors";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";

const REGIONS = ["Maritime", "Plateaux", "Centrale", "Kara", "Savanes"];

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [region, setRegion] = useState("Plateaux");
  const [phone, setPhone] = useState("");
  const [showRegions, setShowRegions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Champs obligatoires manquants");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register({
        name,
        email,
        password,
        role: "agriculteur",
        organisation,
        region,
        phone,
      });
      navigation.navigate("Home");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez la traçabilité blockchain</Text>

        <View style={styles.formCard}>
          <Input
            label="Nom complet"
            value={name}
            onChangeText={setName}
            placeholder="Kofi Mensah"
            dark
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            dark
          />
          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="Minimum 8 caractères"
            secureTextEntry
            dark
          />
          <Input
            label="Téléphone"
            value={phone}
            onChangeText={setPhone}
            placeholder="+228 90 00 00 00"
            keyboardType="phone-pad"
            dark
          />
          <Input
            label="Organisation"
            value={organisation}
            onChangeText={setOrganisation}
            placeholder="Coopérative Koffah"
            dark
          />

          {/* Sélecteur région */}
          <Text style={styles.selectLabel}>Région</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setShowRegions(!showRegions)}
          >
            <Text style={styles.selectText}>{region || "Sélectionnez"}</Text>
            <Text style={styles.selectArrow}>▼</Text>
          </TouchableOpacity>
          {showRegions && (
            <View style={styles.dropdown}>
              {REGIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setRegion(r);
                    setShowRegions(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      r === region && styles.dropdownActive,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button
            title="Créer mon compte"
            onPress={handleRegister}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          />
        </View>

        <TouchableOpacity
          style={styles.linkArea}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>
            Déjà un compte ? <Text style={styles.linkBold}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  scroll: { flexGrow: 1, padding: Spacing.lg },
  backBtn: { marginBottom: Spacing.md },
  backText: { color: Colors.accent, fontSize: FontSize.md },
  title: {
    fontFamily: "serif",
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  formCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectLabel: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  select: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.darkInput,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
  },
  selectText: { fontSize: FontSize.md, color: Colors.textPrimary },
  selectArrow: { fontSize: 10, color: Colors.textMuted },
  dropdown: {
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.xs,
    overflow: "hidden",
  },
  dropdownItem: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md },
  dropdownText: { fontSize: FontSize.md, color: Colors.textSecondary },
  dropdownActive: { color: Colors.accent, fontWeight: "600" },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  linkArea: {
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  linkText: { fontSize: FontSize.md, color: Colors.textSecondary },
  linkBold: { color: Colors.accent, fontWeight: "600" },
});
