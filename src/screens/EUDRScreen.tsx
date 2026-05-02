import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import BottomNav from "../components/BottomNav";
import { eudrService } from "../services/eudrService";

export default function EUDRScreen({ navigation }: any) {
  const { navigate } = navigation;
  const [lotCode, setLotCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async () => {
    if (!lotCode || !latitude || !longitude) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await eudrService.verify({
        lotCode,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      setResult(response);
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err.response?.data?.error || "Échec de la vérification EUDR"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyWithQR = async () => {
    if (!lotCode || !latitude || !longitude) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await eudrService.verifyWithQR({
        lotCode,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      setResult({ ...response.eudr, qrCode: response.qrCode });
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err.response?.data?.error || "Échec de la vérification EUDR"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vérification EUDR</Text>
        <Text style={styles.headerSubtitle}>
          Règlement Européen Anti-Déforestation
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>🌍</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Qu'est-ce que l'EUDR ?</Text>
            <Text style={styles.infoText}>
              Le Règlement Européen contre la Déforestation exige que tout
              produit agricole importé en Europe prouve qu'il ne provient pas de
              terres déboisées après 2020.
            </Text>
          </View>
        </View>

        {/* Formulaire */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Vérifier un lot</Text>

          <Text style={styles.label}>Code du lot</Text>
          <TextInput
            style={styles.input}
            value={lotCode}
            onChangeText={setLotCode}
            placeholder="LOT-MONLSKBI"
            placeholderTextColor={Colors.gray}
            autoCapitalize="characters"
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.input}
                value={latitude}
                onChangeText={setLatitude}
                placeholder="6.19100"
                placeholderTextColor={Colors.gray}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput
                style={styles.input}
                value={longitude}
                onChangeText={setLongitude}
                placeholder="1.27170"
                placeholderTextColor={Colors.gray}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.verifyBtn}
              activeOpacity={0.8}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.verifyBtnText}>🛰️ Vérifier EUDR</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.qrBtn}
              activeOpacity={0.8}
              onPress={handleVerifyWithQR}
              disabled={loading}
            >
              <Text style={styles.qrBtnText}>📱 Avec QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Résultat */}
        {result && (
          <View
            style={[
              styles.resultCard,
              result.isCompliant
                ? styles.resultCompliant
                : styles.resultNonCompliant,
            ]}
          >
            <View style={styles.resultHeader}>
              <Text style={styles.resultIcon}>
                {result.isCompliant ? "✅" : "❌"}
              </Text>
              <View style={styles.resultHeaderText}>
                <Text
                  style={[
                    styles.resultTitle,
                    result.isCompliant
                      ? styles.textCompliant
                      : styles.textNonCompliant,
                  ]}
                >
                  {result.isCompliant
                    ? "Lot conforme EUDR"
                    : "Lot non conforme EUDR"}
                </Text>
                <Text style={styles.resultSubtitle}>
                  {result.isCompliant
                    ? "Ce lot peut être exporté vers l'Union Européenne"
                    : "Ce lot ne respecte pas les critères EUDR"}
                </Text>
              </View>
            </View>

            <View style={styles.resultDivider} />

            {/* Détails */}
            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Lot</Text>
                <Text style={styles.detailValue}>{lotCode}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Analyse satellite</Text>
                <Text style={styles.detailValue}>
                  {result.isCompliant
                    ? "Aucune déforestation détectée"
                    : "Déforestation détectée"}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Coordonnées</Text>
                <Text style={[styles.detailValue, { fontFamily: "monospace" }]}>
                  {latitude}° N, {longitude}° E
                </Text>
              </View>
              {result.additionalData?.deforestationDate && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Date déforestation</Text>
                  <Text
                    style={[styles.detailValue, { color: Colors.alertRed }]}
                  >
                    {result.additionalData.deforestationDate}
                  </Text>
                </View>
              )}
            </View>

            {result.isCompliant && (
              <View style={styles.certificatePreview}>
                <Text style={styles.certificateTitle}>
                  📜 Certificat EUDR disponible
                </Text>
                <Text style={styles.certificateText}>
                  Un certificat de conformité EUDR a été généré et enregistré
                  sur la blockchain
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Historique des vérifications */}
        <Text style={styles.sectionTitle}>Vérifications récentes</Text>
        <View style={styles.historyCard}>
          <View style={styles.historyItem}>
            <View
              style={[
                styles.historyDot,
                { backgroundColor: Colors.forestGreen },
              ]}
            />
            <View style={styles.historyContent}>
              <Text style={styles.historyLabel}>LOT-MONLSKBI</Text>
              <Text style={styles.historyDate}>02 mai 2026</Text>
            </View>
            <Text style={styles.historyStatus}>✅ Conforme</Text>
          </View>
          <View style={styles.historyDivider} />
          <View style={styles.historyItem}>
            <View
              style={[styles.historyDot, { backgroundColor: Colors.alertRed }]}
            />
            <View style={styles.historyContent}>
              <Text style={styles.historyLabel}>LOT-TEST-002</Text>
              <Text style={styles.historyDate}>01 mai 2026</Text>
            </View>
            <Text style={[styles.historyStatus, { color: Colors.alertRed }]}>
              ❌ Non conforme
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav
        activeTab="plus"
        onTabPress={(tab) => {
          if (tab === "home") navigate("Home");
          else if (tab === "plus") navigate("EUDR");
          else if (tab === "history") navigate("History");
          else if (tab === "profile") navigate("Profile");
          else if (tab === 'plus') navigate('EUDR');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightNeutral },
  header: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "serif",
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.white,
  },
  headerSubtitle: {
    fontFamily: "System",
    fontSize: FontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg },

  // Bannière info
  infoBanner: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: "row",
    marginBottom: Spacing.lg,
  },
  infoIcon: { fontSize: 32, marginRight: Spacing.md },
  infoTextContainer: { flex: 1 },
  infoTitle: {
    fontFamily: "serif",
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    color: Colors.gray,
    lineHeight: 20,
  },

  // Formulaire
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  formTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.primaryDark,
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.lightNeutral,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    fontFamily: "System",
    color: Colors.primaryDark,
    minHeight: 48,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  row: { flexDirection: "row", gap: Spacing.md },
  halfField: { flex: 1 },
  buttonRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  verifyBtn: {
    flex: 2,
    backgroundColor: Colors.forestGreen,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  verifyBtnText: {
    fontFamily: "System",
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.white,
  },
  qrBtn: {
    flex: 1,
    backgroundColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  qrBtnText: {
    fontFamily: "System",
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.white,
  },

  // Résultat
  resultCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  resultCompliant: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.forestGreen,
  },
  resultNonCompliant: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.alertRed,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  resultIcon: { fontSize: 36, marginRight: Spacing.md },
  resultHeaderText: { flex: 1 },
  resultTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  textCompliant: { color: Colors.forestGreen },
  textNonCompliant: { color: Colors.alertRed },
  resultSubtitle: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    color: Colors.grayDark,
  },
  resultDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginBottom: Spacing.md,
  },
  detailGrid: { gap: Spacing.sm },
  detailItem: { marginBottom: Spacing.sm },
  detailLabel: {
    fontFamily: "System",
    fontSize: FontSize.xs,
    color: Colors.gray,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: "System",
    fontSize: FontSize.md,
    color: Colors.primaryDark,
    fontWeight: "500",
  },
  certificatePreview: {
    backgroundColor: "rgba(45,106,79,0.1)",
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  certificateTitle: {
    fontFamily: "serif",
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.forestGreen,
    marginBottom: Spacing.xs,
  },
  certificateText: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    color: Colors.grayDark,
  },

  // Historique
  sectionTitle: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    color: Colors.gray,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.xxl,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: Spacing.md,
  },
  historyContent: { flex: 1 },
  historyLabel: {
    fontFamily: "monospace",
    fontSize: FontSize.sm,
    color: Colors.primaryDark,
    fontWeight: "600",
  },
  historyDate: {
    fontFamily: "System",
    fontSize: FontSize.xs,
    color: Colors.gray,
  },
  historyStatus: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.forestGreen,
  },
  historyDivider: {
    height: 1,
    backgroundColor: "rgba(59,31,14,0.06)",
    marginVertical: Spacing.xs,
  },
});
