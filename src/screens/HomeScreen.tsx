import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import StatsCard from '../components/StatsCard';
import LotCard from '../components/LotCard';
import BottomNav from '../components/BottomNav';
import { MOCK_LOTS } from '../data/mockData';

export default function HomeScreen({ navigation }: any) {
  const { navigate } = navigation;

  const activeLots = MOCK_LOTS.filter(
    (l) => l.status === 'CREATED' || l.status === 'PROCESSING'
  ).length;
  const inTransit = MOCK_LOTS.filter((l) => l.status === 'EXPORTED').length;
  const exported = MOCK_LOTS.filter(
    (l) => l.status === 'DELIVERED' || l.status === 'EUDR_STATEMENT'
  ).length;

  const stats = [
    { value: `${activeLots}`, label: 'Lots actifs' },
    { value: `${inTransit}`, label: 'En transit' },
    { value: `${exported}`, label: 'Exportés' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Bonjour, Kofi</Text>
          <Text style={styles.subtitle}>AGRI-TOGO-0045 · Womé</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>KM</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <StatsCard stats={stats} />

        {/* Section title */}
        <Text style={styles.sectionTitle}>Mes lots récents</Text>

        {/* Lot cards */}
        {MOCK_LOTS.map((lot) => (
          <LotCard
            key={lot.id}
            lot={lot}
            onPress={() => navigate('LotDetail', { lot })}
          />
        ))}

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.8}
          onPress={() => navigate('CreateLot')}
        >
          <Text style={styles.ctaText}>+ Enregistrer un nouveau lot</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav
        activeTab="home"
        onTabPress={(tab) => {
          if (tab === 'home') navigate('Home');
          else if (tab === 'plus') navigate('CreateLot');
          else if (tab === 'history') navigate('History');
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
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontFamily: 'serif',
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.white,
  },
  subtitle: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.accentWarm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.grayDark,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  ctaButton: {
    backgroundColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    minHeight: 52,
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
});