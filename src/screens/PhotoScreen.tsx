import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import Button from "../components/Button";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { lotService } from "../services/lotService";

export default function PhotoScreen({ navigation, route }: any) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert("Permission refusée");
        return;
      }
    }
    setShowCamera(true);
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPhotoUri(photo.uri);
      setShowCamera(false);
    }
  };

  const handleRegister = async () => {
    const { lotData } = route.params;
    setLoading(true);
    try {
      const response = await lotService.create({
        producteurName: lotData.producteurName,
        espece: lotData.espece,
        poidsRecu: lotData.poidsRecu,
        region: lotData.region,
      });
      navigation.navigate("Success", {
        lot: {
          ...response,
          poidsRecu: lotData.poidsRecu,
          espece: lotData.espece,
          region: lotData.region,
          producteurName: lotData.producteurName,
        },
      });
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err.response?.data?.error || "Échec enregistrement",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal Caméra */}
      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <View style={styles.cameraControls}>
            <TouchableOpacity onPress={() => setShowCamera(false)}>
              <Text style={styles.cameraClose}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
            <View style={{ width: 50 }} />
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Photo du lot</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        <View style={[styles.step, styles.stepDone]}>
          <Text style={styles.stepTextDone}>✓</Text>
        </View>
        <View style={[styles.stepLine, styles.stepLineDone]} />
        <View style={[styles.step, styles.stepDone]}>
          <Text style={styles.stepTextDone}>✓</Text>
        </View>
        <View style={[styles.stepLine, styles.stepLineDone]} />
        <View style={[styles.step, styles.stepActive]}>
          <Text style={styles.stepTextActive}>3</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.viewfinder}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.preview} />
          ) : (
            <View style={styles.placeholder}>
              <View style={styles.placeholderIcon}>
                <Text style={styles.placeholderSymbol}>◉</Text>
              </View>
              <Text style={styles.placeholderText}>
                Photographiez votre lot de cacao
              </Text>
              <Text style={styles.placeholderSub}>
                La photo est obligatoire pour la traçabilité
              </Text>
            </View>
          )}
        </View>

        <View style={styles.photoActions}>
          <Button
            title="Prendre une photo"
            onPress={takePhoto}
            variant="primary"
            size="md"
          />
          <Button
            title="Galerie"
            onPress={pickImage}
            variant="outline"
            size="md"
          />
        </View>

        <Button
          title="Enregistrer sur la blockchain"
          onPress={handleRegister}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!photoUri}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
  },
  back: { color: Colors.accent, fontSize: FontSize.md },
  headerTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  steps: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    backgroundColor: Colors.darkLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  step: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.darkInput,
    alignItems: "center",
    justifyContent: "center",
  },
  stepActive: { backgroundColor: Colors.accent },
  stepDone: { backgroundColor: Colors.success },
  stepText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.textMuted,
  },
  stepTextActive: { color: Colors.dark, fontWeight: "700" },
  stepTextDone: { color: Colors.textPrimary },
  stepLine: { width: 36, height: 2, backgroundColor: Colors.border },
  stepLineDone: { backgroundColor: Colors.success },
  body: { flex: 1, padding: Spacing.lg },
  viewfinder: {
    flex: 1,
    backgroundColor: Colors.darkCard,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  placeholderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.darkInput,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  placeholderSymbol: { fontSize: 24, color: Colors.textMuted },
  placeholderText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  placeholderSub: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  preview: { width: "100%", height: "100%" },
  photoActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: Spacing.xl,
    backgroundColor: "#000",
  },
  cameraClose: { fontSize: 24, color: Colors.textPrimary },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.textPrimary,
  },
});
