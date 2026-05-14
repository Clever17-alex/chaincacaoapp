import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import Button from "../components/Button";
import { lotService } from "../services/lotService";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

export default function SuccessScreen({ navigation, route }: any) {
  const { lot } = route.params;
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const qrFade = useRef(new Animated.Value(0)).current;
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(true);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(qrFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    try {
      const lotId = lot.id || lot.lotID || lot.fullId;
      if (!lotId) {
        setLoadingQR(false);
        return;
      }
      const qrData = await lotService.getQRCode(lotId);
      if (qrData?.qrCode) setQrCode(qrData.qrCode);
    } catch (err) {
      console.log("QR non disponible");
    } finally {
      setLoadingQR(false);
    }
  };

  const handlePrint = async () => {
    try {
      if (!qrCode) {
        Alert.alert("QR non disponible");
        return;
      }

      const html = `<html><body style="text-align:center;font-family:sans-serif;padding:20px;background:#fff;"><h1>ChainCacao</h1><h2>Lot: ${lot.id?.slice(0, 12) || "N/A"}</h2><img src="${qrCode}" style="width:250px;height:250px;"/><hr/><p>Poids: ${lot.poidsRecu || 0} kg</p><p>Espèce: ${lot.espece || "N/A"}</p><p>Région: ${lot.region || "N/A"}</p><p>Producteur: ${lot.producteurName || "N/A"}</p><p style="font-size:10px;color:#999;">ChainCacao · EUDR</p></body></html>`;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Imprimer le QR code",
      });
    } catch (err) {
      Alert.alert("Erreur", "Impossible d'imprimer");
    }
  };
  
  const handleSave = async () => {
    try {
      if (!qrCode) {
        Alert.alert("QR code non disponible");
        return;
      }
  
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "Autorisez l'accès à la galerie dans les paramètres");
        return;
      }
  
      // Créer le fichier temporaire
      const filename = `ChainCacao_${Date.now()}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
  
      if (qrCode.startsWith("data:image")) {
        // Data URL → on écrit le base64 manuellement
        const base64 = qrCode.split(",")[1];
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: "base64" as any,
        });
      } else {
        // URL normale → on télécharge
        await FileSystem.downloadAsync(qrCode, fileUri);
      }
  
      // Sauvegarder dans la galerie
      await MediaLibrary.saveToLibraryAsync(fileUri);
      
      // Nettoyer
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
  
      Alert.alert("Succès", "QR code enregistré dans votre galerie");
    } catch (err: any) {
      console.log("Erreur sauvegarde:", err.message);
      Alert.alert("Erreur", "Impossible d'enregistrer. Essayez l'impression.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lot enregistré</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}>
          <Text style={styles.checkmark}>✓</Text>
        </Animated.View>

        <Animated.View
          style={{ opacity: fade, alignItems: "center", width: "100%" }}
        >
          <Text style={styles.title}>Enregistré sur la blockchain</Text>

          <View style={styles.idCard}>
            <Text style={styles.idLabel}>Identifiant du lot</Text>
            <Text style={styles.idValue}>
              {lot.id?.slice(0, 12) || lot.fullId || "N/A"}
            </Text>
          </View>

          <Animated.View style={[styles.qrContainer, { opacity: qrFade }]}>
            {loadingQR ? (
              <View style={styles.qrLoading}>
                <Text style={styles.qrLoadingText}>
                  Génération du QR code...
                </Text>
              </View>
            ) : qrCode ? (
              <View style={styles.qrWrapper}>
                <Image
                  source={{ uri: qrCode }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View style={styles.qrMock}>
                <View style={styles.qrRow}>
                  <View style={styles.qrSquare} />
                  <View style={styles.qrSpace} />
                  <View style={styles.qrSquare} />
                </View>
                <View style={styles.qrRow}>
                  <View style={styles.qrSpace} />
                  <View style={styles.qrDot}>
                    <Text style={styles.qrDotText}>₵</Text>
                  </View>
                  <View style={styles.qrSpace} />
                </View>
                <View style={styles.qrRow}>
                  <View style={styles.qrSquare} />
                  <View style={styles.qrSpace} />
                  <View style={styles.qrSquare} />
                </View>
              </View>
            )}
          </Animated.View>

          <View style={styles.detailsCard}>
            <Row label="Poids" value={`${lot.poidsRecu || 0} kg`} />
            <Row label="Espèce" value={lot.espece || "N/A"} />
            <Row label="Région" value={lot.region || "N/A"} />
            <Row label="Producteur" value={lot.producteurName || "N/A"} last />
          </View>

          <Button
            title="Imprimer le QR code"
            onPress={handlePrint}
            variant="outline"
            size="md"
            fullWidth
          />
          <View style={{ height: Spacing.sm }} />
          <Button
            title="Enregistrer comme image"
            onPress={handleSave}
            variant="primary"
            size="md"
            fullWidth
          />
          <View style={{ height: Spacing.md }} />
          <Button
            title="Retour à l'accueil"
            onPress={() => navigation.navigate("Home")}
            variant="ghost"
            size="md"
            fullWidth
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <>
      <View style={r.row}>
        <Text style={r.label}>{label}</Text>
        <Text style={r.value}>{value}</Text>
      </View>
      {!last && <View style={r.divider} />}
    </>
  );
}

const r = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  label: { fontSize: FontSize.sm, color: Colors.textMuted },
  value: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  divider: { height: 1, backgroundColor: Colors.border },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  scroll: {
    alignItems: "center",
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.successBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  checkmark: { fontSize: 32, color: Colors.success, fontWeight: "bold" },
  title: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  idCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: "100%",
    alignItems: "center",
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  idLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  idValue: {
    fontFamily: "monospace",
    fontSize: FontSize.lg,
    color: Colors.accent,
    fontWeight: "700",
  },
  qrContainer: { marginBottom: Spacing.lg, alignItems: "center" },
  qrWrapper: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  qrImage: { width: 170, height: 170 },
  qrLoading: {
    width: 170,
    height: 170,
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qrLoadingText: { fontSize: FontSize.sm, color: Colors.textMuted },
  qrMock: {
    width: 170,
    height: 170,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    justifyContent: "center",
  },
  qrRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qrSquare: {
    width: 34,
    height: 34,
    backgroundColor: Colors.dark,
    borderRadius: 4,
  },
  qrSpace: { flex: 1 },
  qrDot: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  qrDotText: { fontSize: 18, color: Colors.dark, fontWeight: "bold" },
  detailsCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.md,
    width: "100%",
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
