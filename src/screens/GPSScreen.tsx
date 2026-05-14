import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Colors, Spacing, BorderRadius, FontSize } from "../theme/colors";
import Button from "../components/Button";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";

export default function GPSScreen({ navigation, route }: any) {
  const [coords, setCoords] = useState({ lat: 6.12345, lng: 1.23456 });
  const [captured, setCaptured] = useState(false);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    captureLocation();
  }, []);

  const captureLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const newCoords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      setCoords(newCoords);
      setCaptured(true);
      mapRef.current?.animateToRegion(
        {
          latitude: newCoords.lat,
          longitude: newCoords.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000,
      );
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Localisation GPS</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Steps */}
      <View style={styles.steps}>
        <View style={[styles.step, styles.stepDone]}>
          <Text style={styles.stepTextDone}>✓</Text>
        </View>
        <View style={[styles.stepLine, styles.stepLineDone]} />
        <View style={[styles.step, styles.stepActive]}>
          <Text style={styles.stepTextActive}>2</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.step}>
          <Text style={styles.stepText}>3</Text>
        </View>
      </View>

      {/* Carte */}
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.loadingText}>Acquisition GPS...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: coords.lat,
              longitude: coords.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            mapType="satellite"
            customMapStyle={darkMapStyle}
          >
            <Marker
              coordinate={{ latitude: coords.lat, longitude: coords.lng }}
            >
              <View style={styles.markerOuter}>
                <View style={styles.markerInner} />
              </View>
            </Marker>
            <Circle
              center={{ latitude: coords.lat, longitude: coords.lng }}
              radius={15}
              fillColor="rgba(200,150,78,0.15)"
              strokeColor={Colors.accent}
              strokeWidth={2}
            />
          </MapView>
        )}

        {captured && (
          <View style={styles.coordsBar}>
            <View>
              <Text style={styles.coordsLabel}>Position enregistrée</Text>
              <Text style={styles.coordsValue}>
                {coords.lat.toFixed(6)}°N, {coords.lng.toFixed(6)}°E
              </Text>
            </View>
            <View style={styles.precisionBadge}>
              <Text style={styles.precisionText}>±5m</Text>
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.bottom}>
        <Button
          title="Actualiser la position"
          onPress={captureLocation}
          variant="outline"
          size="md"
          fullWidth
        />
        <Button
          title="Suivant — Photo du lot"
          onPress={() =>
            navigation.navigate("Photo", {
              lotData: { ...route.params.lotData, location: coords },
            })
          }
          variant="primary"
          size="lg"
          fullWidth
          disabled={!captured}
        />
      </View>
    </View>
  );
}

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1A1410" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#B8A99A" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0D0A07" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#2A2119" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2E261E" }],
  },
];

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
  mapContainer: {
    flex: 1,
    margin: Spacing.lg,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  map: { flex: 1 },
  loading: {
    flex: 1,
    backgroundColor: Colors.darkCard,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: Colors.textSecondary, marginTop: Spacing.md },
  markerOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(200,150,78,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  markerInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.dark,
  },
  coordsBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(13,10,7,0.9)",
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  coordsLabel: { fontSize: FontSize.xs, color: Colors.success },
  coordsValue: {
    fontFamily: "monospace",
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: "600",
    marginTop: 2,
  },
  precisionBadge: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  precisionText: {
    fontSize: FontSize.xs,
    color: Colors.success,
    fontWeight: "600",
  },
  bottom: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    backgroundColor: Colors.darkLight,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
