import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import BottomNav from "./BottomNav";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen({ navigation, currentRoute }: any) {
  const { user, logout, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [organisation, setOrganisation] = useState(user?.organisation || "");

  const activeTab =
    currentRoute === "Home"
      ? "home"
      : currentRoute === "Lots"
        ? "lots"
        : currentRoute === "Alerts"
          ? "alerts"
          : "profile";

  const handleLogout = async () => {
    await logout();
    navigation.navigate("Login");
  };

  const handleTabPress = (tab: string) => {
    if (tab === "home") navigation.navigate("Home");
    else if (tab === "lots") navigation.navigate("Lots");
    else if (tab === "alerts") navigation.navigate("Alerts");
  };

  const handleSave = () => {
    updateUser({ name, phone, organisation });
    setEditing(false);
  };

  const getInitials = () => {
    if (!user?.name || user.name === "Producteur") return "CC";
    const parts = user.name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return user.name.slice(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || "Utilisateur"}</Text>
          <Text style={styles.userRole}>{user?.role || "agriculteur"}</Text>
          <Text style={styles.userRegion}>{user?.region || "Togo"}</Text>
        </View>

        {/* Informations */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Informations</Text>
            <TouchableOpacity onPress={() => setEditing(!editing)}>
              <Text style={styles.editBtn}>
                {editing ? "Annuler" : "Modifier"}
              </Text>
            </TouchableOpacity>
          </View>

          {editing ? (
            <>
              <Input label="Nom" value={name} onChangeText={setName} dark />
              <Input
                label="Téléphone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                dark
              />
              <Input
                label="Organisation"
                value={organisation}
                onChangeText={setOrganisation}
                dark
              />
              <Button
                title="Enregistrer"
                onPress={handleSave}
                variant="primary"
                size="md"
                fullWidth
              />
            </>
          ) : (
            <>
              <InfoRow label="Email" value={user?.email || "—"} />
              <InfoRow label="Téléphone" value={user?.phone || name || "—"} />
              <InfoRow
                label="Organisation"
                value={user?.organisation || organisation || "—"}
              />
              <InfoRow label="Région" value={user?.region || "—"} last />
            </>
          )}
        </View>

        {/* Déconnexion */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.version}>ChainCacao v1.0 · MIABE 2026</Text>
      </ScrollView>

      <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <>
      <View style={infoStyles.row}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
      {!last && <View style={infoStyles.divider} />}
    </>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  label: { fontSize: FontSize.md, color: Colors.textMuted },
  value: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  divider: { height: 1, backgroundColor: Colors.border },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "serif",
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  avatarSection: { alignItems: "center", marginBottom: Spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  avatarText: { fontSize: FontSize.xxl, fontWeight: "700", color: Colors.dark },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  userRole: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    marginTop: 2,
    textTransform: "capitalize",
  },
  userRegion: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  editBtn: { fontSize: FontSize.md, color: Colors.accent, fontWeight: "600" },
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  logoutText: { fontSize: FontSize.md, fontWeight: "600", color: Colors.error },
  version: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: Spacing.xxl,
  },
});
