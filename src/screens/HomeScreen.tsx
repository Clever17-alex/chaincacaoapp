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
import { useAuth } from "../contexts/AuthContext";
import { lotService } from "../services/lotService";
import { alerteService } from "../services/alerteService";

export default function HomeScreen({ navigation, currentRoute }: any) {
  const { user } = useAuth();
  const [lots, setLots] = useState<any[]>([]);
  const [alertCount, setAlertCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const activeTab =
    currentRoute === "Home"
      ? "home"
      : currentRoute === "Lots"
        ? "lots"
        : currentRoute === "Alerts"
          ? "alerts"
          : "profile";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lotsData, alertesData] = await Promise.all([
        lotService.getAll(),
        alerteService.getAll(),
      ]);
      setLots(lotsData || []);
      setAlertCount(
        alertesData?.filter((a: any) => a.status === "active")?.length || 0,
      );
    } catch (e) {}
  };

  const handleTabPress = (tab: string) => {
    if (tab === "home") return;
    if (tab === "lots") navigation.navigate("Lots");
    else if (tab === "alerts") navigation.navigate("Alerts");
    else if (tab === "profile") navigation.navigate("Profile");
  };

  const activeLots = lots.filter(
    (l: any) => l.statut === "recu" || l.statut === "en_transfert",
  ).length;
  const transitLots = lots.filter(
    (l: any) => l.statut === "en_transfert",
  ).length;
  const exportLots = lots.filter((l: any) => l.statut === "exporte").length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>
            Bonjour, {user?.name?.split(" ")[0] || "Producteur"}
          </Text>
          <Text style={styles.headerSub}>
            {user?.organisation || "Coopérative"} · {user?.region || "Togo"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.avatarText}>
            {(user?.name || "CC").slice(0, 2).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await loadData();
              setRefreshing(false);
            }}
            tintColor={Colors.accent}
          />
        }
      >
        {/* Carte CTA principale */}
        <TouchableOpacity
          style={styles.ctaCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("NewLot")}
        >
          <View style={styles.ctaIconCircle}>
            <Text style={styles.ctaIcon}>+</Text>
          </View>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Enregistrer un nouveau lot</Text>
            <Text style={styles.ctaSub}>Photo · GPS · Blockchain EUDR</Text>
          </View>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>

        {/* Statistiques */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{lots.length}</Text>
            <Text style={styles.statLabel}>Lots</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: Colors.warning }]}>
              {transitLots}
            </Text>
            <Text style={styles.statLabel}>En transit</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: Colors.success }]}>
              {exportLots}
            </Text>
            <Text style={styles.statLabel}>Exportés</Text>
          </View>
        </View>

        {/* Alerte banner */}
        {alertCount > 0 && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => navigation.navigate("Alerts")}
          >
            <Text style={styles.alertDot}>●</Text>
            <Text style={styles.alertText}>
              {alertCount} alerte{alertCount > 1 ? "s" : ""} active
              {alertCount > 1 ? "s" : ""}
            </Text>
            <Text style={styles.alertArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Lots récents */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lots récents</Text>
          {lots.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate("Lots")}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          )}
        </View>

        {lots.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyCircle}>
              <Text style={styles.emptyIcon}>+</Text>
            </View>
            <Text style={styles.emptyTitle}>Aucun lot</Text>
            <Text style={styles.emptySub}>Créez votre premier lot</Text>
          </View>
        ) : (
          lots.slice(0, 5).map((lot: any) => (
            <TouchableOpacity
              key={lot.id}
              style={styles.lotCard}
              onPress={() => navigation.navigate("LotDetail", { lot })}
              activeOpacity={0.7}
            >
              <View style={styles.lotCardLeft}>
                <Text style={styles.lotId}>#{lot.id?.slice(0, 8)}</Text>
                <Text style={styles.lotName}>{lot.producteurName}</Text>
                <Text style={styles.lotDetail}>
                  {lot.poidsRecu} kg · {lot.espece}
                </Text>
              </View>
              <View
                style={[
                  styles.lotStatus,
                  { backgroundColor: getStatusColor(lot.statut) + "25" },
                ]}
              >
                <Text
                  style={[
                    styles.lotStatusText,
                    { color: getStatusColor(lot.statut) },
                  ]}
                >
                  {getStatusLabel(lot.statut)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BottomNav
        activeTab={activeTab}
        onTabPress={handleTabPress}
        alertCount={alertCount}
      />
    </View>
  );
}

function getStatusLabel(s: string) {
  return (
    {
      recu: "Reçu",
      en_transfert: "En transit",
      traite: "Traité",
      exporte: "Exporté",
    }[s] || s
  );
}
function getStatusColor(s: string) {
  return (
    {
      recu: Colors.info,
      en_transfert: Colors.warning,
      traite: Colors.accent,
      exporte: Colors.success,
    }[s] || Colors.textMuted
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
    paddingBottom: Spacing.lg,
  },
  headerLeft: { flex: 1 },
  greeting: {
    fontFamily: "serif",
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  avatarBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: FontSize.md, fontWeight: "700", color: Colors.dark },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  ctaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  ctaIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaIcon: { fontSize: 26, color: Colors.dark, fontWeight: "400" },
  ctaContent: { flex: 1 },
  ctaTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  ctaSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  ctaArrow: { fontSize: 20, color: Colors.accent },
  statsRow: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNum: {
    fontFamily: "serif",
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.accent,
  },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.warningBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.warning + "30",
  },
  alertDot: { color: Colors.warning, fontSize: 10, marginRight: Spacing.sm },
  alertText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.warning,
  },
  alertArrow: { color: Colors.warning, fontSize: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  seeAll: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: "600" },
  lotCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lotCardLeft: { flex: 1 },
  lotId: {
    fontFamily: "monospace",
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  lotName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  lotDetail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  lotStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  lotStatusText: { fontSize: FontSize.xs, fontWeight: "600" },
  emptyState: { alignItems: "center", paddingVertical: Spacing.xxl },
  emptyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.darkCard,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  emptyIcon: { fontSize: 24, color: Colors.textMuted },
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
