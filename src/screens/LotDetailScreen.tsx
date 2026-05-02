import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import StatusBadge from "../components/StatusBadge";
import BottomNav from "../components/BottomNav";
import { lotService } from "../services/lotService";

export default function LotDetailScreen({ navigation, route }: any) {
  const { navigate, goBack } = navigation;
  const { lot } = route.params;
  const [lotData, setLotData] = useState<any>(lot);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLotDetails();
  }, []);

  const fetchLotDetails = async () => {
    try {
      const data = await lotService.verify(lot.id || lot.lotID);
      if (data) {
        setLotData(data);
        setTimeline(data.custodyChain || []);
      }
    } catch (err) {
      console.log("Erreur chargement lot, utilisation données mock");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    try {
      const qrData = await lotService.getQRCode(lot.id || lot.lotID);
      // Stocker le QR code pour l'afficher
      navigate("Success", {
        lot: { ...lotData, qrCode: qrData.qrCode, fullId: qrData.lotId },
      });
    } catch (err) {
      console.log("QR non disponible en mode mock");
    }
  };

  const timelineEvents =
    timeline.length > 0
      ? timeline.map((t: any) => ({
          status: t.status || "CREATED",
          label: t.label || t.action || "Étape",
          date: t.date || t.timestamp || "",
          done: t.done !== false,
        }))
      : [
          {
            status: "CREATED",
            label: "Lot créé",
            date: lot.createdAt || "",
            done: true,
          },
          {
            status: "PROCESSING",
            label: "En traitement",
            subtitle: "En attente de transfert",
            date: "En cours",
            done: false,
          },
          { status: "EXPORTED", label: "Export", date: "À venir", done: false },
          {
            status: "DELIVERED",
            label: "Livraison UE",
            date: "À venir",
            done: false,
          },
        ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {lotData?.lotID || lotData?.id || "Lot"}
        </Text>
        <TouchableOpacity style={styles.qrBtn} onPress={handleGenerateQR}>
          <Text style={styles.qrBtnText}>QR</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accentWarm} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statusBanner}>
            <Text style={styles.statusLabel}>Statut actuel</Text>
            <Text style={styles.statusValue}>
              {lotData?.status === "CREATED"
                ? "Lot créé"
                : lotData?.status === "PROCESSING"
                ? "En traitement"
                : lotData?.status === "EXPORTED"
                ? "Exporté"
                : "En attente"}
            </Text>
            <StatusBadge status={lotData?.status || "CREATED"} />
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Espèce</Text>
              <Text style={styles.infoValue}>
                {lotData?.species || "Trinitario"}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Poids</Text>
              <Text style={styles.infoValue}>
                {lotData?.weightKg || lotData?.weight || 0} kg
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Région</Text>
              <Text style={styles.infoValue}>
                {lotData?.region || lotData?.cultureMode || "N/A"}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>GPS</Text>
              <Text style={[styles.infoValue, { fontFamily: "monospace" }]}>
                {lotData?.latitude || lotData?.location?.lat || "?"}° N,{" "}
                {lotData?.longitude || lotData?.location?.lng || "?"}° E
              </Text>
            </View>
            {lotData?.origin && (
              <>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Producteur</Text>
                  <Text style={styles.infoValue}>
                    {lotData.origin.farmerName || "N/A"}
                  </Text>
                </View>
              </>
            )}
          </View>

          <Text style={styles.timelineTitle}>Traçabilité</Text>

          <View style={styles.timeline}>
            {timelineEvents.map((step: any, index: number) => (
              <View key={index} style={styles.timelineStep}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.dot,
                      step.done ? styles.dotDone : styles.dotPending,
                      index === timelineEvents.findIndex((s: any) => !s.done) &&
                        styles.dotActive,
                    ]}
                  />
                  {index < timelineEvents.length - 1 && (
                    <View
                      style={[
                        styles.line,
                        step.done && timelineEvents[index + 1]?.done
                          ? styles.lineDone
                          : styles.linePending,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineLabel,
                      !step.done &&
                        index ===
                          timelineEvents.findIndex((s: any) => !s.done) &&
                        styles.timelineLabelActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                  {step.subtitle && (
                    <Text style={styles.timelineSubtitle}>{step.subtitle}</Text>
                  )}
                  <Text style={styles.timelineDate}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>

          {lotData?.eudr && (
            <View style={styles.eudrCard}>
              <Text style={styles.eudrTitle}>🌍 EUDR Compliance</Text>
              <Text style={styles.eudrStatus}>
                {lotData.eudr.isCompliant ? "✅ Conforme" : "❌ Non conforme"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <BottomNav
        activeTab="history"
        onTabPress={(tab) => {
          if (tab === "home") navigate("Home");
          else if (tab === "plus") navigate("CreateLot");
          else if (tab === "history") navigate("History");
          else if (tab === "profile") navigate("Profile");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightNeutral },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: Colors.primaryDark,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: { fontSize: FontSize.xl, color: Colors.white },
  headerTitle: {
    fontFamily: "monospace",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.white,
  },
  qrBtn: {
    backgroundColor: Colors.accentWarm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  qrBtnText: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.white,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  statusBanner: {
    backgroundColor: Colors.warningBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  statusLabel: {
    fontFamily: "System",
    fontSize: FontSize.xs,
    color: Colors.gray,
    textTransform: "uppercase",
  },
  statusValue: {
    fontFamily: "System",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    color: Colors.gray,
  },
  infoValue: {
    fontFamily: "System",
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.primaryDark,
  },
  infoDivider: { height: 1, backgroundColor: "rgba(59,31,14,0.06)" },
  timelineTitle: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    color: Colors.gray,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  timeline: { paddingLeft: Spacing.sm },
  timelineStep: { flexDirection: "row", minHeight: 60 },
  timelineLeft: { width: 24, alignItems: "center", marginRight: Spacing.md },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  dotDone: { backgroundColor: Colors.forestGreen },
  dotActive: {
    backgroundColor: Colors.accentWarm,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotPending: { backgroundColor: Colors.grayLight },
  line: { flex: 1, width: 2, marginTop: 4 },
  lineDone: { backgroundColor: Colors.forestGreen },
  linePending: { backgroundColor: Colors.grayLight },
  timelineContent: { flex: 1, paddingBottom: Spacing.lg },
  timelineLabel: {
    fontFamily: "System",
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  timelineLabelActive: { color: Colors.accentWarm, fontWeight: "700" },
  timelineSubtitle: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    color: Colors.accentWarm,
    marginBottom: 2,
  },
  timelineDate: {
    fontFamily: "System",
    fontSize: FontSize.xs,
    color: Colors.gray,
  },
  eudrCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.forestGreen,
  },
  eudrTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },
  eudrStatus: {
    fontFamily: "System",
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.forestGreen,
  },
});
