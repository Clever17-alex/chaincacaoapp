import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import StatusBadge from '../components/StatusBadge';
import BottomNav from '../components/BottomNav';
import { MOCK_TIMELINE } from '../data/mockData';

export default function LotDetailScreen({ navigation, route }: any) {
  const { lot } = route.params;
  const { navigate } = navigation;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lot.id}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status banner */}
        <View style={styles.statusBanner}>
          <Text style={styles.statusLabel}>Statut actuel</Text>
          <Text style={styles.statusValue}>
            En traitement — {lot.cooperative || 'Coopérative Koffah'}
          </Text>
          <StatusBadge status="PROCESSING" />
        </View>

        {/* Lot info summary */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Espèce</Text>
            <Text style={styles.infoValue}>{lot.species}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Poids</Text>
            <Text style={styles.infoValue}>{lot.weight.toLocaleString()} kg</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Culture</Text>
            <Text style={styles.infoValue}>{lot.cultureMode}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Récolte</Text>
            <Text style={styles.infoValue}>{lot.harvestDate}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>GPS</Text>
            <Text style={[styles.infoValue, { fontFamily: 'monospace' }]}>
              {lot.location.lat}° N, {lot.location.lng}° E
            </Text>
          </View>
        </View>

        {/* Timeline title */}
        <Text style={styles.timelineTitle}>Traçabilité</Text>

        {/* Timeline */}
        <View style={styles.timeline}>
          {MOCK_TIMELINE.map((step, index) => (
            <View key={index} style={styles.timelineStep}>
              {/* Dot + Line */}
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.dot,
                    step.done ? styles.dotDone : styles.dotPending,
                    index === 2 && styles.dotActive,
                  ]}
                />
                {index < MOCK_TIMELINE.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      step.done && MOCK_TIMELINE[index + 1]?.done
                        ? styles.lineDone
                        : styles.linePending,
                    ]}
                  />
                )}
              </View>

              {/* Content */}
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineLabel,
                    index === 2 && styles.timelineLabelActive,
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
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav
        activeTab="history"
        onTabPress={(tab) => {
          if (tab === 'home') navigation.navigate('Home');
          else if (tab === 'profile') navigate('Profile');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightNeutral,
  },
  header: {
    backgroundColor: Colors.primaryDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  headerTitle: {
    fontFamily: 'monospace',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  statusBanner: {
    backgroundColor: Colors.warningBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  statusLabel: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
    textTransform: 'uppercase',
  },
  statusValue: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '700',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.gray,
  },
  infoValue: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(59,31,14,0.06)',
  },
  timelineTitle: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  timeline: {
    paddingLeft: Spacing.sm,
  },
  timelineStep: {
    flexDirection: 'row',
    minHeight: 60,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  dotDone: {
    backgroundColor: Colors.forestGreen,
  },
  dotActive: {
    backgroundColor: Colors.accentWarm,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotPending: {
    backgroundColor: Colors.grayLight,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: 4,
  },
  lineDone: {
    backgroundColor: Colors.forestGreen,
  },
  linePending: {
    backgroundColor: Colors.grayLight,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Spacing.lg,
  },
  timelineLabel: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  timelineLabelActive: {
    color: Colors.accentWarm,
    fontWeight: '700',
  },
  timelineSubtitle: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.accentWarm,
    marginBottom: 2,
  },
  timelineDate: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
  },
});