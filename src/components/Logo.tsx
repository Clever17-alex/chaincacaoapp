import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../theme/colors';

interface LogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
}

export default function Logo({ size = 80, showText = false, showTagline = false }: LogoProps) {
  const innerSize = size * 0.55;
  const fontSize = size * 0.35;

  return (
    <View style={styles.container}>
      {/* Hexagone principal */}
      <View
        style={[
          styles.hexagonOuter,
          {
            width: size,
            height: size,
            borderRadius: size * 0.2,
          },
        ]}
      >
        {/* Hexagone intérieur */}
        <View
          style={[
            styles.hexagonInner,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize * 0.18,
            },
          ]}
        >
          {/* Icône cacao + blockchain */}
          <Text style={[styles.icon, { fontSize }]}>₵</Text>
        </View>

        {/* Points blockchain décoratifs */}
        <View style={[styles.dot, styles.dotTop, { width: size * 0.08, height: size * 0.08, borderRadius: size * 0.04 }]} />
        <View style={[styles.dot, styles.dotRight, { width: size * 0.08, height: size * 0.08, borderRadius: size * 0.04 }]} />
        <View style={[styles.dot, styles.dotBottom, { width: size * 0.08, height: size * 0.08, borderRadius: size * 0.04 }]} />
      </View>

      {/* Texte du logo */}
      {showText && (
        <Text style={[styles.appName, { fontSize: size * 0.35 }]}>ChainCacao</Text>
      )}

      {showTagline && (
        <Text style={[styles.tagline, { fontSize: size * 0.14 }]}>
          De la ferme togolaise à l'Europe.{'\n'}En 3 minutes. Sans fraude.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagonOuter: {
    backgroundColor: Colors.accentWarm,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  hexagonInner: {
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  icon: {
    color: Colors.accentWarm,
    fontWeight: 'bold',
    transform: [{ rotate: '0deg' }],
  },
  dot: {
    position: 'absolute',
    backgroundColor: Colors.white,
    opacity: 0.6,
  },
  dotTop: {
    top: -4,
    alignSelf: 'center',
  },
  dotRight: {
    right: -4,
    top: '50%',
    marginTop: -2,
  },
  dotBottom: {
    bottom: -4,
    alignSelf: 'center',
  },
  appName: {
    fontFamily: 'serif',
    fontWeight: '700',
    color: Colors.white,
    marginTop: 16,
  },
  tagline: {
    fontFamily: 'System',
    color: Colors.lightNeutral,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
});