import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme/colors';
import BottomNav from '../components/BottomNav';

export default function ProfileScreen({ navigation }: any) {
  const { navigate } = navigation;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Kofi Mensah');
  const [village, setVillage] = useState('Womé, Plateaux');
  const [phone, setPhone] = useState('+228 90 00 00 00');
  const [email, setEmail] = useState('kofi.mensah@email.tg');
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleSave = () => {
    setEditing(false);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const menuItems = [
    { icon: '📋', label: 'Mes certificats', color: Colors.forestGreen },
    { icon: '📍', label: 'Parcelles enregistrées', color: Colors.accentWarm },
    { icon: '💰', label: 'Paiements', color: Colors.forestGreen },
    { icon: '📖', label: 'Guide EUDR', color: Colors.accentWarm },
    { icon: '❓', label: 'Aide & Support', color: Colors.grayDark },
    { icon: '⚙️', label: 'Paramètres', color: Colors.grayDark },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditing(!editing)}
        >
          <Text style={styles.editBtnText}>
            {editing ? 'Annuler' : 'Modifier'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + ID */}
        <View style={styles.avatarSection}>
          <TouchableOpacity activeOpacity={0.8}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>KM</Text>
              <View style={styles.cameraBadge}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.farmerId}>AGRI-TOGO-0045</Text>
          <Text style={styles.farmerLabel}>Producteur vérifié</Text>
        </View>

        {/* Informations */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informations personnelles</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Nom complet</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={name}
                onChangeText={setName}
              />
            ) : (
              <Text style={styles.fieldValue}>{name}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Village / Localité</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={village}
                onChangeText={setVillage}
              />
            ) : (
              <Text style={styles.fieldValue}>{village}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Téléphone</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{phone}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.fieldValue}>{email}</Text>
            )}
          </View>
        </View>

        {/* Bouton sauvegarder */}
        {editing && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={styles.saveBtn}
              activeOpacity={0.8}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>💾 Enregistrer les modifications</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Menu */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <View style={styles.menuDivider} />}
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.6}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>→</Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Lots actifs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Lots totaux</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Note qualité</Text>
          </View>
        </View>

        {/* Déconnexion */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.7}
          onPress={() => navigate('Login')}
        >
          <Text style={styles.logoutBtnText}>🚪 Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.version}>ChainCacao v1.0.0 · Hackathon MIABE 2026</Text>
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
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.white,
  },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.lg,
  },
  editBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.white,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentWarm,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  cameraIcon: {
    fontSize: 14,
  },
  farmerId: {
    fontFamily: 'monospace',
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginTop: Spacing.sm,
  },
  farmerLabel: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.forestGreen,
    fontWeight: '600',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardTitle: {
    fontFamily: 'serif',
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: Spacing.md,
  },
  field: {
    paddingVertical: Spacing.sm,
  },
  fieldLabel: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
  fieldInput: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.primaryDark,
    fontWeight: '500',
    borderBottomWidth: 2,
    borderBottomColor: Colors.accentWarm,
    paddingVertical: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(59,31,14,0.06)',
  },
  saveBtn: {
    backgroundColor: Colors.forestGreen,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    minHeight: 52,
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.white,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.sm,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  menuLabel: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.primaryDark,
    fontWeight: '500',
    flex: 1,
  },
  menuArrow: {
    fontSize: 16,
    color: Colors.gray,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(59,31,14,0.05)',
    marginLeft: 44,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statNumber: {
    fontFamily: 'serif',
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.accentWarm,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
    textAlign: 'center',
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: Colors.alertRed,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoutBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.alertRed,
  },
  version: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});