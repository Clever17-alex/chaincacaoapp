import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';

interface StatItem {
  label: string;
  value: string;
}

interface Props {
  stats: StatItem[];
}

export default function StatsCard({ stats }: Props) {
  return (
    <View style={styles.card}>
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          {index > 0 && <View style={styles.divider} />}
          <View style={styles.statItem}>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  value: {
    fontFamily: 'serif',
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.goldText,
    marginBottom: Spacing.xs,
  },
  label: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
    textAlign: 'center',
  },
});