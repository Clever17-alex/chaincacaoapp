import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import StatusBadge from './StatusBadge';
import { Lot } from '../types';

interface Props {
  lot: Lot;
  onPress?: () => void;
}

export default function LotCard({ lot, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Top row: ID + Status */}
      <View style={styles.topRow}>
        <Text style={styles.lotId}>{lot.id}</Text>
        <StatusBadge status={lot.status} />
      </View>

      {/* Info row */}
      <View style={styles.infoRow}>
        <Text style={styles.weight} numberOfLines={1}>
          {lot.weight.toLocaleString()} kg
        </Text>
        <Text style={styles.separator}>·</Text>
        <Text style={styles.species} numberOfLines={1}>
          {lot.species}
        </Text>
        <Text style={styles.separator}>·</Text>
        <Text style={styles.mode} numberOfLines={1}>
          {lot.cultureMode}
        </Text>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <Text style={styles.date}>{lot.createdAt}</Text>
        {lot.cooperative && (
          <Text style={styles.coop} numberOfLines={1}>
            {lot.cooperative}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  lotId: {
    fontFamily: 'monospace',
    fontSize: FontSize.sm,
    color: Colors.gray,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  weight: {
    fontFamily: 'serif',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.goldText,
  },
  separator: {
    color: Colors.grayDark,
    marginHorizontal: Spacing.xs,
    fontSize: FontSize.sm,
  },
  species: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
    fontWeight: '500',
  },
  mode: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.gray,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
  },
  coop: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.accentWarm,
    fontWeight: '500',
  },
});