import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, FontSize } from '../theme/colors';
import LotCard from '../components/LotCard';
import BottomNav from '../components/BottomNav';
import { MOCK_LOTS } from '../data/mockData';

export default function HistoryScreen({ navigation }: any) {
  const { navigate } = navigation;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes lots</Text>
        <Text style={styles.headerCount}>{MOCK_LOTS.length} lots</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_LOTS.map((lot) => (
          <LotCard
            key={lot.id}
            lot={lot}
            onPress={() => navigate('LotDetail', { lot })}
          />
        ))}
      </ScrollView>

      <BottomNav
        activeTab="history"
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.white,
  },
  headerCount: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.gray,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
});