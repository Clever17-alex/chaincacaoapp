import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme/colors';
import BottomNav from '../components/BottomNav';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

export default function NotificationsScreen({ navigation }: any) {
  const { navigate } = navigation;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      case 'alert': return '⚠️';
      default: return '📌';
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success': return Colors.forestGreen;
      case 'info': return Colors.accentWarm;
      case 'alert': return Colors.alertRed;
      default: return Colors.gray;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return '#F0F7F3';
      case 'info': return '#FFF8F0';
      case 'alert': return '#FFF0F0';
      default: return Colors.white;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>3</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_NOTIFICATIONS.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.card, { 
              borderLeftColor: getBorderColor(notif.type),
              backgroundColor: getBgColor(notif.type),
            }]}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{getIcon(notif.type)}</Text>
              <Text style={[styles.cardTitle, notif.type === 'alert' && { color: Colors.alertRed }]}>
                {notif.title}
              </Text>
            </View>
            <Text style={styles.cardSubtitle}>{notif.subtitle}</Text>
            <Text style={styles.cardTimestamp}>{notif.timestamp}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav
        activeTab="profile"
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
  headerTitle: {
    fontFamily: 'serif',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
  badge: {
    backgroundColor: Colors.alertRed,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    borderLeftWidth: 4,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  cardIcon: {
    fontSize: 16,
  },
  cardTitle: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.primaryDark,
    flex: 1,
  },
  cardSubtitle: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.grayDark,
    marginBottom: Spacing.sm,
    paddingLeft: 24,
  },
  cardTimestamp: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
    paddingLeft: 24,
  },
});