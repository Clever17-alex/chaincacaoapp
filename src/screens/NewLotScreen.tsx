import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Colors,
  Spacing,
  BorderRadius,
  FontSize,
  Shadow,
} from "../theme/colors";
import Input from "../components/Input";
import Button from "../components/Button";

const SPECES = ["Trinitario", "Forastero", "Criollo"];
const REGIONS = ["Maritime", "Plateaux", "Centrale", "Kara", "Savanes"];

export default function NewLotScreen({ navigation }: any) {
  const [producteurName, setProducteurName] = useState("");
  const [espece, setEspece] = useState("Trinitario");
  const [poids, setPoids] = useState("");
  const [region, setRegion] = useState("Plateaux");

  const handleNext = () => {
    const poidsNum = parseFloat(poids);
    if (!producteurName || !poids || poidsNum <= 0) return;
    navigation.navigate("GPS", {
      lotData: { producteurName, espece, poidsRecu: poidsNum, region },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouveau lot</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.steps}>
        <View style={[styles.step, styles.stepActive]}>
          <Text style={styles.stepTextActive}>1</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.step}>
          <Text style={styles.stepText}>2</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.step}>
          <Text style={styles.stepText}>3</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Informations du lot</Text>

        <Input
          label="Nom du producteur"
          value={producteurName}
          onChangeText={setProducteurName}
          placeholder="Kofi Mensah"
        />
        <Input
          label="Poids estimé (kg)"
          value={poids}
          onChangeText={setPoids}
          placeholder="1500"
          keyboardType="numeric"
        />

        <Text style={styles.selectLabel}>Espèce de cacao</Text>
        <View style={styles.selectRow}>
          {SPECES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.selectBtn, espece === s && styles.selectBtnActive]}
              onPress={() => setEspece(s)}
            >
              <Text
                style={[
                  styles.selectText,
                  espece === s && styles.selectTextActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.selectLabel}>Région</Text>
        <View style={styles.selectRow}>
          {REGIONS.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.selectBtn, region === r && styles.selectBtnActive]}
              onPress={() => setRegion(r)}
            >
              <Text
                style={[
                  styles.selectText,
                  region === r && styles.selectTextActive,
                ]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Suivant — Localisation GPS"
          onPress={handleNext}
          variant="primary"
          size="lg"
          fullWidth
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightBg },
  header: {
    backgroundColor: Colors.dark,
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
    color: Colors.white,
  },
  steps: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepActive: { backgroundColor: Colors.accent },
  stepText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.textMuted,
  },
  stepTextActive: { color: Colors.white },
  stepLine: { width: 40, height: 2, backgroundColor: Colors.borderLight },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  sectionTitle: {
    fontFamily: "serif",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  selectLabel: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  selectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  selectBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  selectBtnActive: {
    backgroundColor: Colors.accentBg,
    borderColor: Colors.accent,
  },
  selectText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  selectTextActive: { color: Colors.accent, fontWeight: "600" },
});
