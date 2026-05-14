import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Spacing, FontSize } from "../theme/colors";

const TABS = [
  { key: "home", label: "Accueil", icon: "⌂" },
  { key: "lots", label: "Lots", icon: "☰" },
  { key: "alerts", label: "Alertes", icon: "◎" },
  { key: "profile", label: "Profil", icon: "◉" },
];

export default function BottomNav({
  activeTab,
  onTabPress,
  alertCount = 0,
}: {
  activeTab: string;
  onTabPress: (key: string) => void;
  alertCount?: number;
}) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.6}
          >
            <View style={styles.iconContainer}>
              <Text style={[styles.icon, isActive && styles.iconActive]}>
                {tab.icon}
              </Text>
              {tab.key === "alerts" && alertCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{alertCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.darkLight,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: Spacing.xs },
  iconContainer: { position: "relative", marginBottom: 2 },
  icon: { fontSize: 18, color: Colors.textMuted },
  iconActive: { color: Colors.accent },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: Colors.warning,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 9, fontWeight: "700", color: Colors.dark },
  label: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  labelActive: { color: Colors.accent, fontWeight: "600" },
});
