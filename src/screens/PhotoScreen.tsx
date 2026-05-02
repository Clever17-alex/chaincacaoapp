import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import StepIndicator from "../components/StepIndicator";
import { lotService } from "../services/lotService";
import { useAuth } from "../contexts/AuthContext";
import { useLots } from "../contexts/LotContext";
import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions } from "expo-camera";


export default function PhotoScreen({ navigation, route }: any) {
  const { user } = useAuth();
  const { addLot } = useLots();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
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
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setPhotoBase64(result.assets[0].base64 || null);
    }
  };

  const takePhoto = async () => {
    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        Alert.alert(
          "Permission refusée",
          "La caméra est nécessaire pour photographier vos lots."
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const handleCameraCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.7,
        });
        setPhotoUri(photo.uri);
        setPhotoBase64(photo.base64 || null);
        setShowCamera(false);
      } catch (err) {
        Alert.alert("Erreur", "Impossible de prendre la photo.");
      }
    }
  };

  const handleRegister = async () => {
    const { lotData } = route.params;

    if (!lotData.weight || lotData.weight <= 0) {
      Alert.alert("Erreur", "Le poids du lot doit être supérieur à 0");
      navigation.navigate("CreateLot");
      return;
    }
    setLoading(true);

    try {
      const lotID = `LOT-${Date.now().toString(36).toUpperCase()}`;
      const harvestDateISO = new Date().toISOString();

      console.log("Date envoyée:", harvestDateISO);

      const body = {
        lotID,
        farmerID: user?.actorID || "TEST",
        weightKg: lotData.weight || 0,
        harvestDate: harvestDateISO,
        region: lotData.cultureMode || "Agroforesterie",
        latitude: lotData.location?.lat || 6.12345,
        longitude: lotData.location?.lng || 1.23456,
        ipfsPhotoHash: photoBase64
          ? `ipfs://photo-${Date.now()}`
          : "ipfs://no-photo",
        areaHectares: 2.5,
      };

      console.log("Envoi lot:", JSON.stringify(body, null, 2));

      const response = await lotService.create(body);
      console.log("Lot créé avec succès:", response);

      // Construire l'objet lot pour le contexte
      const newLot = {
        id: response?.lotID || lotID,
        fullId: response?.lotID || lotID,
        species: lotData.species || "Cacao",
        weight: lotData.weight || 0,
        cultureMode: lotData.cultureMode || "Agroforesterie",
        harvestDate: new Date().toLocaleDateString("fr-FR"),
        location: lotData.location,
        photoUri: photoUri || undefined,
        status: "CREATED",
        createdAt: new Date().toLocaleDateString("fr-FR"),
      };

      // AJOUTER AU CONTEXTE POUR HOME SCREEN
      addLot(newLot);    // ✅ CORRIGÉ

      // Naviguer vers succès
      navigation.navigate("Success", { lot: newLot });
    } catch (err: any) {
      console.log(
        "Erreur création lot:",
        JSON.stringify(err.response?.data || err.message)
      );
      Alert.alert(
        "Erreur",
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Échec de l'enregistrement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal caméra */}
      <Modal visible={showCamera} animationType="slide" style={styles.modal}>
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back">
            <View style={styles.cameraOverlay}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </CameraView>
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraCloseBtn}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cameraCloseText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraCaptureBtn}
              onPress={handleCameraCapture}
            >
              <View style={styles.cameraCaptureInner} />
            </TouchableOpacity>
            <View style={{ width: 50 }} />
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Photo du lot</Text>
        <View style={styles.backBtn} />
      </View>

      <StepIndicator
        currentStep={3}
        totalSteps={3}
        labels={["Infos", "Localisation", "Photo"]}
      />

      <View style={styles.content}>
        <View style={styles.viewfinder}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
          ) : (
            <>
              <View style={[styles.cornerStatic, styles.topLeftStatic]} />
              <View style={[styles.cornerStatic, styles.topRightStatic]} />
              <View style={[styles.cornerStatic, styles.bottomLeftStatic]} />
              <View style={[styles.cornerStatic, styles.bottomRightStatic]} />
              <Text style={styles.viewfinderText}>
                Photographiez votre lot de cacao
              </Text>
            </>
          )}
        </View>

        <View style={styles.photoButtons}>
          <TouchableOpacity
            style={styles.photoBtn}
            activeOpacity={0.8}
            onPress={takePhoto}
          >
            <Text style={styles.photoBtnText}>📸 Prendre une photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.galleryBtn}
            activeOpacity={0.8}
            onPress={pickImage}
          >
            <Text style={styles.galleryBtnText}>🖼️ Galerie</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.registerBtn,
            (!photoUri || loading) && styles.registerBtnDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleRegister}
          disabled={!photoUri || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.lightNeutral} />
          ) : (
            <Text style={styles.registerBtnText}>
              Enregistrer sur la blockchain →
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.darkBase },
  modal: { flex: 1 },
  cameraContainer: { flex: 1, backgroundColor: Colors.black },
  camera: { flex: 1 },
  cameraOverlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.darkBase,
  },
  cameraCloseBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraCloseText: { fontSize: 20, color: Colors.white },
  cameraCaptureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: Colors.accentWarm,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraCaptureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Colors.accentWarm,
  },
  topLeft: { top: 60, left: 30, borderTopWidth: 3, borderLeftWidth: 3 },
  topRight: { top: 60, right: 30, borderTopWidth: 3, borderRightWidth: 3 },
  bottomLeft: {
    bottom: 60,
    left: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 60,
    right: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  header: {
    backgroundColor: Colors.primaryDark,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: { fontSize: FontSize.xl, color: Colors.white },
  headerTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.white,
  },
  content: { flex: 1, padding: Spacing.lg, justifyContent: "center" },
  viewfinder: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.md,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  cornerStatic: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Colors.accentWarm,
  },
  topLeftStatic: {
    top: Spacing.md,
    left: Spacing.md,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRightStatic: {
    top: Spacing.md,
    right: Spacing.md,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeftStatic: {
    bottom: Spacing.md,
    left: Spacing.md,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRightStatic: {
    bottom: Spacing.md,
    right: Spacing.md,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  viewfinderText: {
    fontFamily: "System",
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
    opacity: 0.5,
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.md,
  },
  photoButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  photoBtn: {
    flex: 1,
    backgroundColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  photoBtnText: {
    fontFamily: "System",
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.white,
  },
  galleryBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  galleryBtnText: {
    fontFamily: "System",
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.accentWarm,
  },
  registerBtn: {
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  registerBtnDisabled: { opacity: 0.3 },
  registerBtnText: {
    fontFamily: "System",
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
    opacity: 0.7,
  },
});
