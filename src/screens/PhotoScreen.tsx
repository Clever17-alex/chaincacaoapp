import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import StepIndicator from '../components/StepIndicator';

export default function PhotoScreen({ navigation, route }: any) {
  const [photoTaken, setPhotoTaken] = useState(false);

  const handleTakePhoto = () => {
    // Simulation de prise de photo
    setPhotoTaken(true);
  };

  const handleRegister = () => {
    const lotData = route.params.lotData;
    const newLot = {
      id: `TOGO-2026-00${Math.floor(Math.random() * 9) + 1}`,
      fullId: `TOGO-2026-00${Math.floor(Math.random() * 9) + 1}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      ...lotData,
      status: 'CREATED',
      createdAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    navigation.navigate('Success', { lot: newLot });
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
        <Text style={styles.headerTitle}>Photo du lot</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Step indicator */}
      <StepIndicator
        currentStep={3}
        totalSteps={3}
        labels={['Infos', 'Localisation', 'Photo']}
      />

      <View style={styles.content}>
        {/* Camera viewfinder */}
        <View style={styles.viewfinder}>
          {/* Corner markers */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {!photoTaken ? (
            <Text style={styles.viewfinderText}>
              Photographiez votre lot de cacao
            </Text>
          ) : (
            <View style={styles.photoPreview}>
              <Text style={styles.photoEmoji}>🫘</Text>
              <Text style={styles.photoLabel}>Photo capturée</Text>
            </View>
          )}

          {/* Thumbnail preview */}
          {photoTaken && (
            <View style={styles.thumbnailPreview}>
              <Text style={styles.thumbnailEmoji}>🫘</Text>
            </View>
          )}
        </View>

        {/* Take photo button */}
        <TouchableOpacity
          style={[styles.captureBtn, photoTaken && styles.captureBtnDone]}
          activeOpacity={0.8}
          onPress={handleTakePhoto}
        >
          <Text style={styles.captureBtnText}>
            {photoTaken ? '📸 Reprendre la photo' : '📸 Prendre la photo'}
          </Text>
        </TouchableOpacity>

        {/* Register button */}
        <TouchableOpacity
          style={[styles.registerBtn, !photoTaken && styles.registerBtnDisabled]}
          activeOpacity={0.8}
          onPress={handleRegister}
          disabled={!photoTaken}
        >
          <Text style={styles.registerBtnText}>
            Enregistrer sur la blockchain →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBase,
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
  viewfinder: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.md,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.accentWarm,
  },
  topLeft: {
    top: Spacing.md,
    left: Spacing.md,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: Spacing.md,
    right: Spacing.md,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: Spacing.md,
    left: Spacing.md,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: Spacing.md,
    right: Spacing.md,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  viewfinderText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
    opacity: 0.5,
    textAlign: 'center',
  },
  photoPreview: {
    alignItems: 'center',
  },
  photoEmoji: {
    fontSize: 64,
  },
  photoLabel: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    color: Colors.forestGreen,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  thumbnailPreview: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    width: 50,
    height: 50,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.darkBase,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.accentWarm,
  },
  thumbnailEmoji: {
    fontSize: 24,
  },
  captureBtn: {
    backgroundColor: Colors.accentWarm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    minHeight: 52,
    justifyContent: 'center',
  },
  captureBtnDone: {
    opacity: 0.7,
  },
  captureBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
  registerBtn: {
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  registerBtnDisabled: {
    opacity: 0.3,
  },
  registerBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.lightNeutral,
    opacity: 0.5,
  },
});