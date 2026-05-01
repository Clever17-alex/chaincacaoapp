import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import StepIndicator from '../components/StepIndicator';

export default function GPSScreen({ navigation, route }: any) {
  const [captured, setCaptured] = useState(false);
  const [coords, setCoords] = useState({ lat: '6.12345', lng: '1.23456' });

  const handleCapture = () => {
    setCaptured(true);
    // Simule une capture GPS
    setCoords({
      lat: (6.12345 + Math.random() * 0.01).toFixed(5),
      lng: (1.23456 + Math.random() * 0.01).toFixed(5),
    });
  };

  const handleNext = () => {
    navigation.navigate('Photo', {
      lotData: { ...route.params.lotData, location: coords },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Localisation GPS</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Step indicator */}
      <StepIndicator
        currentStep={2}
        totalSteps={3}
        labels={['Infos', 'Localisation', 'Photo']}
      />

      <View style={styles.content}>
        {/* Map placeholder */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.pinIcon}>📍</Text>
          {captured && (
            <Text style={styles.coordsText}>
              {coords.lat}° N / {coords.lng}° E
            </Text>
          )}
        </View>

        {/* Accuracy */}
        {captured && (
          <View style={styles.accuracyRow}>
            <View style={styles.greenDot} />
            <Text style={styles.accuracyText}>Précision: ±5m GPS</Text>
          </View>
        )}

        {/* Capture button */}
        <TouchableOpacity
          style={styles.captureBtn}
          activeOpacity={0.7}
          onPress={handleCapture}
        >
          <Text style={styles.captureBtnText}>
            {captured ? '📍 Re-capturer ma position' : '📍 Capturer ma position'}
          </Text>
        </TouchableOpacity>

        {/* Next button */}
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
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  mapPlaceholder: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.md,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.accentWarm,
    borderStyle: 'dashed',
  },
  pinIcon: {
    fontSize: 48,
  },
  coordsText: {
    fontFamily: 'monospace',
    fontSize: FontSize.lg,
    color: Colors.accentWarm,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
  accuracyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.forestGreen,
    marginRight: Spacing.sm,
  },
  accuracyText: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.forestGreen,
    fontWeight: '600',
  },
  captureBtn: {
    borderWidth: 2,
    borderColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    minHeight: 52,
    justifyContent: 'center',
  },
  captureBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.accentWarm,
  },
  nextBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  nextBtnDisabled: {
    opacity: 0.4,
  },
  nextBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
});