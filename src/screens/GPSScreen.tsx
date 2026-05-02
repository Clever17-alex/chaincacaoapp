import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import StepIndicator from '../components/StepIndicator';
import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';

export default function GPSScreen({ navigation, route }: any) {
  const [captured, setCaptured] = useState(false);
  const [coords, setCoords] = useState({ lat: 6.12345, lng: 1.23456 });
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  // Obtenir la position au démarrage
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La localisation GPS est nécessaire pour la traçabilité EUDR.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const newCoords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      setCoords(newCoords);
      setCaptured(true);

      // Centrer la carte sur la position
      mapRef.current?.animateToRegion({
        latitude: newCoords.lat,
        longitude: newCoords.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    } catch (err) {
      Alert.alert('Erreur GPS', 'Impossible d\'obtenir votre position. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleCapture = async () => {
    await getCurrentLocation();
  };

  const handleNext = () => {
    navigation.navigate('Photo', {
      lotData: { ...route.params.lotData, location: coords },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Localisation GPS</Text>
        <View style={styles.backBtn} />
      </View>

      <StepIndicator currentStep={2} totalSteps={3} labels={['Infos', 'Localisation', 'Photo']} />

      <View style={styles.content}>
        {/* CARTE RÉELLE */}
        <View style={styles.mapContainer}>
          {loading ? (
            <View style={styles.mapLoading}>
              <ActivityIndicator size="large" color={Colors.accentWarm} />
              <Text style={styles.mapLoadingText}>Acquisition GPS...</Text>
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
              showsUserLocation
              showsMyLocationButton
              mapType="satellite"
            >
              {/* Cercle de précision */}
              <Circle
                center={{ latitude: coords.lat, longitude: coords.lng }}
                radius={15}
                fillColor="rgba(196,122,43,0.2)"
                strokeColor={Colors.accentWarm}
                strokeWidth={2}
              />

              {/* Marqueur de la parcelle */}
              <Marker
                coordinate={{ latitude: coords.lat, longitude: coords.lng }}
                title="Parcelle de cacao"
                description={`${coords.lat.toFixed(5)}° N, ${coords.lng.toFixed(5)}° E`}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.markerOuter}>
                    <Text style={styles.markerIcon}>🌱</Text>
                  </View>
                  <View style={styles.markerArrow} />
                </View>
              </Marker>
            </MapView>
          )}

          {/* Overlay d'info en bas de la carte */}
          {captured && (
            <View style={styles.coordsOverlay}>
              <View style={styles.coordsRow}>
                <View style={styles.greenDot} />
                <Text style={styles.coordsLabel}>Position GPS précise</Text>
              </View>
              <Text style={styles.coordsValue}>
                {coords.lat.toFixed(6)}° N / {coords.lng.toFixed(6)}° E
              </Text>
              <Text style={styles.coordsHint}>
                Cette position sera enregistrée sur la blockchain pour la conformité EUDR
              </Text>
            </View>
          )}
        </View>

        {/* Boutons */}
        <TouchableOpacity
          style={styles.captureBtn}
          activeOpacity={0.7}
          onPress={handleCapture}
          disabled={loading}
        >
          <Text style={styles.captureBtnText}>
            {loading ? 'Acquisition...' : captured ? '📍 Actualiser ma position' : '📍 Capturer ma position'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, !captured && styles.nextBtnDisabled]}
          activeOpacity={0.8}
          onPress={handleNext}
          disabled={!captured}
        >
          <Text style={styles.nextBtnText}>Suivant — Photo →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightNeutral },
  header: {
    backgroundColor: Colors.primaryDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backArrow: { fontSize: FontSize.xl, color: Colors.white },
  headerTitle: { fontFamily: 'serif', fontSize: FontSize.lg, fontWeight: '700', color: Colors.white },
  content: { flex: 1, padding: Spacing.lg },
  
  // Carte
  mapContainer: {
    flex: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.accentWarm,
  },
  map: {
    flex: 1,
  },
  mapLoading: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLoadingText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
    marginTop: Spacing.md,
    opacity: 0.6,
  },
  
  // Marqueur personnalisé
  markerContainer: {
    alignItems: 'center',
  },
  markerOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentWarm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  markerIcon: {
    fontSize: 22,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.accentWarm,
    marginTop: -2,
  },
  
  // Overlay coordonnées
  coordsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(14,13,11,0.85)',
    padding: Spacing.md,
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
  },
  coordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.forestGreen,
    marginRight: Spacing.sm,
  },
  coordsLabel: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.forestGreen,
    fontWeight: '600',
  },
  coordsValue: {
    fontFamily: 'monospace',
    fontSize: FontSize.md,
    color: Colors.accentWarm,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  coordsHint: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
  },
  
  // Boutons
  captureBtn: {
    borderWidth: 2,
    borderColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
  },
  captureBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.accentWarm,
  },
  nextBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
});