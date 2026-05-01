import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize, Spacing } from '../theme/colors';
import { LotStatus } from '../types';

const STATUS_CONFIG: Record<LotStatus, { label: string; color: string; bg: string }> = {
  CREATED: { label: 'CRÉÉ', color: Colors.gray, bg: 'rgba(156,163,175,0.15)' },
  RECEIVED: { label: 'REÇU', color: Colors.accentWarm, bg: Colors.warningBg },
  PROCESSING: { label: 'EN TRAITEMENT', color: Colors.accentWarm, bg: Colors.warningBg },
  EXPORTED: { label: 'EXPORTÉ', color: Colors.forestGreen, bg: Colors.successBg },
  EUDR_STATEMENT: { label: 'EUDR OK', color: Colors.forestGreen, bg: Colors.successBg },
  DELIVERED: { label: 'LIVRÉ', color: Colors.forestGreen, bg: Colors.successBg },
};

interface Props {
  status: LotStatus;
}

export default function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.CREATED;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.color }]}>
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});