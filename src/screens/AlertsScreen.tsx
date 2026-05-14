import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import BottomNav from "./BottomNav";
import { alerteService } from "../services/alerteService";

const SEVERITY_CONFIG: Record<string, { color: string; label: string }> = {
  critique: { color: Colors.error, label: "Critique" },
  priorite: { color: Colors.warning, label: "Priorité" },
  warning: { color: Colors.info, label: "Alerte" },
  info: { color: Colors.textMuted, label: "Info" },
};

export default function AlertsScreen({ navigation, currentRoute }: any) {
  const [alertes, setAlertes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const activeTab = currentRoute === "Alerts" ? "alerts" : "profile";

  useEffect(() => {
    loadAlertes();
  }, []);

  const loadAlertes = async () => {
    try {
      const data = await alerteService.getAll();
      setAlertes(data || []);
    } catch (e) {}
  };

  const handleResolve = async (id: string) => {
    try {
      await alerteService.updateStatus(id, "resolved");
      setAlertes((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "resolved" } : a)),
      );
    } catch (e) {}
  };

  const handleTabPress = (tab: string) => {
    if (tab === "home") navigation.navigate("Home");
    else if (tab === "lots") navigation.navigate("Lots");
    else if (tab === "profile") navigation.navigate("Profile");
  };

  const activeAlerts = alertes.filter((a) => a.status === "active");
  const resolvedAlerts = alertes.filter((a) => a.status === "resolved");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alertes</Text>
        {activeAlerts.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {activeAlerts.length} active{activeAlerts.length > 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await loadAlertes();
              setRefreshing(false);
            }}
            tintColor={Colors.accent}
          />
        }
      >
        {alertes.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyCircle}>
              <Text style={styles.emptyIcon}>✓</Text>
            </View>
            <Text style={styles.emptyTitle}>Aucune alerte</Text>
            <Text style={styles.emptySub}>Tout est en ordre</Text>
          </View>
        ) : (
          <>
            {/* Alertes actives */}
            {activeAlerts.length > 0 && (
              <Text style={styles.sectionTitle}>Actives</Text>
            )}
            {activeAlerts.map((alerte) => {
              const sev =
                SEVERITY_CONFIG[alerte.severity] || SEVERITY_CONFIG.info;
              return (
                <View
                  key={alerte.id}
                  style={[styles.card, { borderLeftColor: sev.color }]}
                >
                  <View style={styles.cardTop}>
                    <View
                      style={[
                        styles.sevBadge,
                        { backgroundColor: sev.color + "20" },
                      ]}
                    >
                      <Text style={[styles.sevText, { color: sev.color }]}>
                        {sev.label}
                      </Text>
                    </View>
                    <Text style={styles.cardCategory}>{alerte.categorie}</Text>
                    <TouchableOpacity
                      style={styles.resolveBtn}
                      onPress={() => handleResolve(alerte.id)}
                    >
                      <Text style={styles.resolveText}>Résoudre</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardTitle}>{alerte.titre}</Text>
                  <Text style={styles.cardDescription}>
                    {alerte.description}
                  </Text>
                  <View style={styles.cardBottom}>
                    <Text style={styles.cardTime}>
                      {alerte.tempsMoyen || "—"}
                    </Text>
                    {alerte.lotId && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("LotDetail", {
                            lot: { id: alerte.lotId },
                          })
                        }
                      >
                        <Text style={styles.cardLink}>Voir le lot →</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Alertes résolues */}
            {resolvedAlerts.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
                  Résolues
                </Text>
                {resolvedAlerts.map((alerte) => (
                  <View
                    key={alerte.id}
                    style={[styles.card, styles.cardResolved]}
                  >
                    <Text style={styles.cardTitle}>{alerte.titre}</Text>
                    <Text style={styles.cardTime}>Résolue</Text>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontFamily: "serif",
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  countBadge: {
    backgroundColor: Colors.errorBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  countText: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.error },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
  },
  cardResolved: { opacity: 0.5, borderLeftColor: Colors.success },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  sevBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  sevText: { fontSize: FontSize.xs, fontWeight: "700" },
  cardCategory: { fontSize: FontSize.xs, color: Colors.textMuted, flex: 1 },
  resolveBtn: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  resolveText: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTime: { fontSize: FontSize.xs, color: Colors.textMuted },
  cardLink: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: "600" },
  empty: { alignItems: "center", paddingVertical: Spacing.xxl },
  emptyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.successBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  emptyIcon: { fontSize: 24, color: Colors.success },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  emptySub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
