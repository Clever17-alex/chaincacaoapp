import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import { Notification } from '../types';

interface Props {
  notification: Notification;
}

const TYPE_STYLES = {
  success: {
    borderColor: Colors.forestGreen,
    bg: Colors.successBg,
    titleColor: Colors.white,
  },
  info: {
    borderColor: Colors.accentWarm,
    bg: Colors.warningBg,
    titleColor: Colors.white,
  },
  alert: {
    borderColor: Colors.alertRed,
    bg: Colors.errorBg,
    titleColor: Colors.alertRed,
  },
};

export default function NotificationCard({ notification }: Props) {
  const style = TYPE_STYLES[notification.type];

  return (
    <View style={[styles.card, { borderLeftColor: style.borderColor, backgroundColor: style.bg }]}>
      <Text style={[styles.title, { color: style.titleColor }]}>
        {notification.title}
      </Text>
      <Text style={styles.subtitle}>{notification.subtitle}</Text>
      <Text style={styles.timestamp}>{notification.timestamp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 3,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm + 2,
  },
  title: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.lightNeutral,
    opacity: 0.5,
    marginBottom: Spacing.xs,
  },
  timestamp: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.lightNeutral,
    opacity: 0.3,
  },
});