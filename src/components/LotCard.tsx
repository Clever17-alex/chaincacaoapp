import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Colors,
  Spacing,
  BorderRadius,
  FontSize,
  Shadow,
} from "../theme/colors";
import { Lot } from "../types";

interface Props {
  lot: Lot;
  onPress: () => void;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  recu: { label: "Reçu", color: Colors.info },
  en_transfert: { label: "En transfert", color: Colors.warning },
  traite: { label: "Traité", color: Colors.accent },
  exporte: { label: "Exporté", color: Colors.success },
};

export default function LotCard({ lot, onPress }: Props) {
  const status = STATUS_MAP[lot.statut] || STATUS_MAP.recu;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.id}>#{lot.id.slice(0, 8)}</Text>
        <View style={[styles.badge, { backgroundColor: status.color + "20" }]}>
          <View style={[styles.dot, { backgroundColor: status.color }]} />
          <Text style={[styles.badgeText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{lot.producteurName}</Text>
        <Text style={styles.details}>
          {lot.poidsRecu} kg · {lot.espece} · {lot.region}
        </Text>
      </View>
      <Text style={styles.date}>
        {new Date(lot.createdAt).toLocaleDateString("fr-FR")}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  id: {
    fontFamily: "monospace",
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: Spacing.xs },
  badgeText: { fontSize: FontSize.xs, fontWeight: "600" },
  body: { marginBottom: Spacing.sm },
  name: { fontSize: FontSize.md, fontWeight: "600", color: Colors.textPrimary },
  details: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  date: { fontSize: FontSize.xs, color: Colors.textMuted },
});
