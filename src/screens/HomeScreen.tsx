import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import StatsCard from '../components/StatsCard';
import LotCard from '../components/LotCard';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { lotService } from '../services/lotService';

export default function HomeScreen({ navigation }: any) {
  const { navigate } = navigation;
  const { user, logout } = useAuth();
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pour l'instant on garde les données mock
    // Plus tard : remplacer par lotService.getAll()
    setLoading(false);
  }, []);

  const activeLots = lots.filter(
    (l) => l.status === 'CREATED' || l.status === 'PROCESSING'
  ).length;
  const inTransit = lots.filter((l) => l.status === 'EXPORTED').length;
  const exported = lots.filter(
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
          <Text style={styles.greeting}>Bonjour, {user?.name || 'Kofi'}</Text>
          <Text style={styles.subtitle}>
            {user?.actorID || 'AGRI-TOGO-0045'} · {user?.organization || 'Womé'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'K'}
              {user?.name ? user.name.split(' ')[1]?.charAt(0).toUpperCase() || '' : 'M'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatsCard stats={stats} />

        <Text style={styles.sectionTitle}>Mes lots récents</Text>

        {loading ? (
          <ActivityIndicator color={Colors.accentWarm} style={{ marginTop: 20 }} />
        ) : lots.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌱</Text>
            <Text style={styles.emptyText}>Aucun lot pour le moment</Text>
            <Text style={styles.emptySubtext}>
              Enregistrez votre première récolte
            </Text>
          </View>
        ) : (
          lots.map((lot) => (
            <LotCard
              key={lot.id}
              lot={lot}
              onPress={() => navigate('LotDetail', { lot })}
            />
          ))
        )}

        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.8}
          onPress={() => navigate('CreateLot')}
        >
          <Text style={styles.ctaText}>+ Enregistrer un nouveau lot</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav
        activeTab="home"
        onTabPress={(tab) => {
          if (tab === 'home') navigate('Home');
          else if (tab === 'history') navigate('History');
          else if (tab === 'profile') navigate('Profile');
          else if (tab === 'plus') navigate('EUDR');
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  emptySubtext: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.gray,
    marginTop: 4,
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