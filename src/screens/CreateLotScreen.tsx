import { Alert } from 'react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme/colors';
import StepIndicator from '../components/StepIndicator';

const SPECIES = ['Trinitario', 'Forastero', 'Criollo', 'Nacional'];
const CULTURE_MODES = ['Agroforesterie', 'Monoculture', 'Biologique', 'Mixte'];

export default function CreateLotScreen({ navigation }: any) {
  const [species, setSpecies] = useState('Trinitario');
  const [weight, setWeight] = useState('');
  const [cultureMode, setCultureMode] = useState('Agroforesterie');
  const [harvestDate, setHarvestDate] = useState('');
  const [note, setNote] = useState('');
  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const handleNext = () => {
  const weightNum = parseInt(weight.replace(/\s/g, ''), 10) || 0;
  if (weightNum <= 0) {
    Alert.alert('Erreur', 'Veuillez entrer un poids valide');
    return;
  }
  navigation.navigate('GPS', {
    lotData: { 
      species, 
      weight: weightNum, 
      cultureMode, 
      harvestDate, 
      note 
    },
  });
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouveau lot</Text>
        <View style={styles.backBtn} />
      </View>

      <StepIndicator currentStep={1} totalSteps={3} labels={['Infos', 'Localisation', 'Photo']} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Espèce de cacao</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowSpeciesDropdown(!showSpeciesDropdown)}>
          <Text style={styles.inputText}>{species}</Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>
        {showSpeciesDropdown && (
          <View style={styles.dropdown}>
            {SPECIES.map((s) => (
              <TouchableOpacity key={s} style={styles.dropdownItem} onPress={() => { setSpecies(s); setShowSpeciesDropdown(false); }}>
                <Text style={styles.dropdownText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Poids estimé (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="1500"
          placeholderTextColor={Colors.gray}
        />

        <Text style={styles.label}>Mode de culture</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowModeDropdown(!showModeDropdown)}>
          <Text style={styles.inputText}>{cultureMode}</Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>
        {showModeDropdown && (
          <View style={styles.dropdown}>
            {CULTURE_MODES.map((m) => (
              <TouchableOpacity key={m} style={styles.dropdownItem} onPress={() => { setCultureMode(m); setShowModeDropdown(false); }}>
                <Text style={styles.dropdownText}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Date de récolte</Text>
        <TextInput
          style={styles.input}
          value={harvestDate}
          onChangeText={setHarvestDate}
          placeholder="2025-12-15"
          placeholderTextColor={Colors.gray}
        />

        <Text style={styles.label}>Note (optionnel)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={note}
          onChangeText={setNote}
          placeholder="Détails supplémentaires..."
          placeholderTextColor={Colors.gray}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.nextBtn} activeOpacity={0.8} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Suivant — Localisation →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ... styles (identiques à l'ancien fichier) ...

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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  label: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(59,31,14,0.15)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
    fontSize: FontSize.md,
    fontFamily: 'System',
    color: Colors.primaryDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  inputText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.primaryDark,
    flex: 1,
  },
  chevron: {
    fontSize: FontSize.sm,
    color: Colors.gray,
    marginLeft: Spacing.sm,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: 'rgba(59,31,14,0.15)',
    borderRadius: BorderRadius.sm,
    marginTop: 2,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59,31,14,0.05)',
  },
  dropdownText: {
    fontFamily: 'System',
    fontSize: FontSize.md,
    color: Colors.primaryDark,
  },
  nextBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
    minHeight: 52,
    justifyContent: 'center',
  },
  nextBtnText: {
    fontFamily: 'System',
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
  },
});