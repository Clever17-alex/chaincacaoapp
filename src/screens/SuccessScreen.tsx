import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import { lotService } from "../services/lotService";

export default function SuccessScreen({ navigation, route }: any) {
  const { lot } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const qrFadeAnim = useRef(new Animated.Value(0)).current;
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(true);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 10,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(qrFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    try {
      const lotId = lot.id || lot.fullId || "LOT-UNKNOWN";
      console.log("Récupération QR pour:", lotId);
      const qrData = await lotService.getQRCode(lotId);
      if (qrData && qrData.qrCode) {
        setQrBase64(qrData.qrCode);
      }
    } catch (err) {
      console.log("QR non disponible, affichage mock");
    } finally {
      setLoadingQR(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lot enregistré</Text>
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.checkmark}>✓</Text>
        </Animated.View>

        <Animated.Text style={[styles.confirmationText, { opacity: fadeAnim }]}>
          Enregistré sur la blockchain
        </Animated.Text>

        <Animated.View style={[styles.idCard, { opacity: fadeAnim }]}>
          <Text style={styles.idLabel}>ID du lot</Text>
          <Text style={styles.idText}>
            {lot.id || lot.fullId || lot.lotID || "LOT-UNKNOWN"}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.qrContainer, { opacity: qrFadeAnim }]}>
          {loadingQR ? (
            <View style={styles.qrLoading}>
              <ActivityIndicator color={Colors.accentWarm} size="large" />
              <Text style={styles.qrLoadingText}>Génération du QR code...</Text>
            </View>
          ) : qrBase64 ? (
            <Image
              source={{ uri: `data:image/png;base64,${qrBase64}` }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.qrCode}>
              <View style={styles.qrInner}>
                <View style={styles.qrRow}>
                  <View style={styles.qrLargeSquare} />
                  <View style={styles.qrSpace} />
                  <View style={styles.qrLargeSquare} />
                </View>
                <View style={styles.qrRow}>
                  <View style={styles.qrSpace} />
                  <View style={styles.qrCenterLogo}>
                    <Text style={styles.qrLogoText}>₵</Text>
                  </View>
                  <View style={styles.qrSpace} />
                </View>
                <View style={styles.qrRow}>
                  <View style={styles.qrLargeSquare} />
                  <View style={styles.qrSpace} />
                  <View style={styles.qrLargeSquare} />
                </View>
              </View>
              <Text style={styles.qrMockLabel}>QR Code Mock</Text>
            </View>
          )}
        </Animated.View>

        <Text style={styles.lotInfo}>
          {lot.weight || 0} kg · {lot.species || "Cacao"} ·{" "}
          {lot.cultureMode || lot.region || ""}
        </Text>
        <Text style={styles.lotInfoSecondary}>
          {lot.harvestDate || ""} · Womé
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.7}>
            <Text style={styles.outlineBtnText}>🖨️ Imprimer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
            <Text style={styles.primaryBtnText}>📤 Partager</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.homeLink}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeLinkText}>← Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.darkBase },
  header: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.successBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  checkmark: { fontSize: 36, color: Colors.forestGreen, fontWeight: "bold" },
  confirmationText: {
    fontFamily: "System",
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
    opacity: 0.7,
    marginBottom: Spacing.xl,
  },
  idCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: "100%",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  idLabel: {
    fontFamily: "System",
    fontSize: FontSize.xs,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  idText: {
    fontFamily: "monospace",
    fontSize: FontSize.lg,
    color: Colors.goldText,
    fontWeight: "700",
    letterSpacing: 1,
  },
  qrContainer: { marginBottom: Spacing.lg },
  qrLoading: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
  },
  qrLoadingText: {
    fontFamily: "System",
    fontSize: FontSize.xs,
    color: Colors.gray,
    marginTop: Spacing.sm,
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
  },
  qrCode: {
    width: 180,
    height: 180,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  qrInner: { width: "100%", height: "70%" },
  qrRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qrLargeSquare: {
    width: 36,
    height: 36,
    backgroundColor: Colors.primaryDark,
    borderRadius: 4,
  },
  qrSpace: { flex: 1 },
  qrCenterLogo: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.accentWarm,
    justifyContent: "center",
    alignItems: "center",
  },
  qrLogoText: { fontSize: 20, color: Colors.white, fontWeight: "bold" },
  qrMockLabel: {
    fontFamily: "System",
    fontSize: FontSize.xs,
    color: Colors.gray,
    marginTop: Spacing.sm,
  },
  lotInfo: {
    fontFamily: "System",
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
    opacity: 0.5,
    textAlign: "center",
    lineHeight: 22,
  },
  lotInfoSecondary: {
    fontFamily: "System",
    fontSize: FontSize.sm,
    color: Colors.lightNeutral,
    opacity: 0.4,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  buttonRow: { flexDirection: "row", gap: Spacing.md, width: "100%" },
  outlineBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  outlineBtnText: {
    fontFamily: "System",
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.lightNeutral,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  primaryBtnText: {
    fontFamily: "System",
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.white,
  },
  homeLink: { marginTop: Spacing.lg },
  homeLinkText: {
    fontFamily: "System",
    fontSize: FontSize.md,
    color: Colors.accentWarm,
    fontWeight: "600",
  },
});
