import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import { lotService } from "../services/lotService";
import { transfertService } from "../services/transfertService";

export default function LotDetailScreen({ navigation, route }: any) {
  const { lot } = route.params;
  const [transfers, setTransfers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const [histData, transfData] = await Promise.all([
        lotService.getHistory(lot.id),
        transfertService.getByLot(lot.id),
      ]);
      setHistory(histData || []);
      setTransfers(transfData || []);
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lot #{lot.id?.slice(0, 8)}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Infos principales */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations du lot</Text>

          <InfoRow label="Producteur" value={lot.producteurName} />
          <InfoRow label="Espèce" value={lot.espece} />
          <InfoRow label="Poids" value={`${lot.poidsRecu} kg`} />
          <InfoRow label="Région" value={lot.region} />
          <InfoRow label="Statut" value={lot.statut} accent last />
        </View>

        {/* Historique */}
        {history.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Historique</Text>
            {history.map((item: any, i: number) => (
              <View key={i} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.dot, i === 0 && styles.dotActive]} />
                  {i < history.length - 1 && <View style={styles.line} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>
                    {item.action || item.label || "Étape"}
                  </Text>
                  <Text style={styles.timelineDate}>
                    {item.date || item.createdAt || ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Transferts */}
        {transfers.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Transferts ({transfers.length})
            </Text>
            {transfers.map((t, i) => (
              <View key={i} style={styles.transferCard}>
                <View style={styles.transferHeader}>
                  <Text style={styles.transferFrom}>{t.origine}</Text>
                  <Text style={styles.transferArrow}>→</Text>
                  <Text style={styles.transferTo}>{t.destinataire}</Text>
                </View>
                <Text style={styles.transferDetail}>
                  {t.poidsTransfere} kg · {t.conditionnement}
                </Text>
                <View style={styles.transferBottom}>
                  <View
                    style={[
                      styles.transferStatus,
                      { backgroundColor: transfertColor(t.statut) + "25" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.transferStatusText,
                        { color: transfertColor(t.statut) },
                      ]}
                    >
                      {t.statut}
                    </Text>
                  </View>
                  <Text style={styles.transferResp}>{t.responsable}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({
  label,
  value,
  accent = false,
  last = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  last?: boolean;
}) {
  return (
    <>
      <View style={infoStyles.row}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={[infoStyles.value, accent && { color: Colors.accent }]}>
          {value}
        </Text>
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
    fontWeight: "600",
  },
  divider: { height: 1, backgroundColor: Colors.border },
});

function transfertColor(s: string) {
  const map: Record<string, string> = {
    signe: Colors.success,
    confirme: Colors.success,
    en_attente: Colors.warning,
    rejete: Colors.error,
  };
  return map[s] || Colors.textMuted;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
  },
  back: { color: Colors.accent, fontSize: FontSize.md },
  headerTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  timelineItem: { flexDirection: "row", minHeight: 50 },
  timelineLeft: { width: 20, alignItems: "center", marginRight: Spacing.md },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  dotActive: {
    backgroundColor: Colors.accent,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: { flex: 1, width: 2, backgroundColor: Colors.border, marginTop: 4 },
  timelineContent: { flex: 1, paddingBottom: Spacing.md },
  timelineTitle: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  timelineDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  transferCard: {
    backgroundColor: Colors.darkLight,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  transferHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  transferFrom: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  transferArrow: { marginHorizontal: Spacing.sm, color: Colors.accent },
  transferTo: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  transferDetail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  transferBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transferStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  transferStatusText: { fontSize: FontSize.xs, fontWeight: "600" },
  transferResp: { fontSize: FontSize.xs, color: Colors.textMuted },
});
