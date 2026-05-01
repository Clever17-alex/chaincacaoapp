import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize } from '../theme/colors';

type Tab = 'home' | 'plus' | 'history' | 'profile';

interface Props {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'home', label: 'Accueil', icon: '⌂' },
  { key: 'plus', label: 'Nouveau', icon: '+' },
  { key: 'history', label: 'Lots', icon: '☰' },
  { key: 'profile', label: 'Profil', icon: '👤' },
];

export default function BottomNav({ activeTab, onTabPress }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.6}
        >
          <Text
            style={[
              styles.icon,
              activeTab === tab.key ? styles.activeIcon : styles.inactiveIcon,
            ]}
          >
            {tab.icon}
          </Text>
          <Text
            style={[
              styles.label,
              activeTab === tab.key ? styles.activeLabel : styles.inactiveLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryDark,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  icon: {
    fontSize: FontSize.xl,
    marginBottom: 2,
  },
  activeIcon: {
    color: Colors.accentWarm,
  },
  inactiveIcon: {
    color: Colors.lightNeutral,
    opacity: 0.3,
  },
  label: {
    fontFamily: 'System',
    fontSize: 10,
  },
  activeLabel: {
    color: Colors.accentWarm,
    fontWeight: '600',
  },
  inactiveLabel: {
    color: Colors.lightNeutral,
    opacity: 0.3,
  },
});