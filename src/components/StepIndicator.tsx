import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize, Spacing } from '../theme/colors';

interface Props {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function StepIndicator({ currentStep, totalSteps, labels }: Props) {
  return (
    <View style={styles.container}>
      {/* Steps */}
      <View style={styles.stepsRow}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <View
                style={[
                  styles.line,
                  index < currentStep ? styles.lineActive : styles.lineInactive,
                ]}
              />
            )}
            <View
              style={[
                styles.circle,
                index + 1 === currentStep && styles.circleActive,
                index + 1 < currentStep && styles.circleDone,
                index + 1 > currentStep && styles.circleInactive,
              ]}
            >
              <Text
                style={[
                  styles.circleText,
                  index + 1 === currentStep && styles.circleTextActive,
                ]}
              >
                {index + 1}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Labels */}
      <View style={styles.labelsRow}>
        {labels.map((label, index) => (
          <Text
            key={index}
            style={[
              styles.label,
              index + 1 === currentStep && styles.labelActive,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 50,
    height: 2,
  },
  lineActive: {
    backgroundColor: Colors.accentWarm,
  },
  lineInactive: {
    backgroundColor: Colors.grayDark,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
    backgroundColor: Colors.accentWarm,
  },
  circleDone: {
    backgroundColor: Colors.forestGreen,
  },
  circleInactive: {
    backgroundColor: Colors.grayDark,
  },
  circleText: {
    fontFamily: 'System',
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.lightNeutral,
  },
  circleTextActive: {
    color: Colors.white,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  label: {
    fontFamily: 'System',
    fontSize: FontSize.xs,
    color: Colors.gray,
    flex: 1,
    textAlign: 'center',
  },
  labelActive: {
    color: Colors.accentWarm,
    fontWeight: '700',
  },
});