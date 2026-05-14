import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, BackHandler, Animated, ActivityIndicator } from 'react-native';
import { Colors } from './src/theme/colors';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import LotsScreen from './src/screens/LotsScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NewLotScreen from './src/screens/NewLotScreen';
import GPSScreen from './src/screens/GPSScreen';
import PhotoScreen from './src/screens/PhotoScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import LotDetailScreen from './src/screens/LotDetailScreen';

function Navigator() {
  const { isLoading } = useAuth();
  const [stack, setStack] = useState([{ name: 'Splash', params: {} }]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) { setStack(prev => prev.slice(0, -1)); return true; }
      return false;
    });
    return () => handler.remove();
  }, [stack.length]);

  const navigate = useCallback((name: string, params = {}) => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setStack(prev => {
      if (name === 'Login' || name === 'Register' || name === 'Home') return [{ name, params }];
      return [...prev, { name, params }];
    });
  }, []);

  const goBack = () => setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);

  if (isLoading) return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.accent} /></View>;

  const current = stack[stack.length - 1];
  const props = { navigation: { navigate, goBack }, route: { params: current.params }, currentRoute: current.name };

  const renderScreen = () => {
    switch (current.name) {
      case 'Splash': return <SplashScreen {...props} />;
      case 'Login': return <LoginScreen {...props} />;
      case 'Register': return <RegisterScreen {...props} />;
      case 'Home': return <HomeScreen {...props} />;
      case 'Lots': return <LotsScreen {...props} />;
      case 'Alerts': return <AlertsScreen {...props} />;
      case 'Profile': return <ProfileScreen {...props} />;
      case 'NewLot': return <NewLotScreen {...props} />;
      case 'GPS': return <GPSScreen {...props} />;
      case 'Photo': return <PhotoScreen {...props} />;
      case 'Success': return <SuccessScreen {...props} />;
      case 'LotDetail': return <LotDetailScreen {...props} />;
      default: return <SplashScreen {...props} />;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>{renderScreen()}</Animated.View>
    </View>
  );
}

export default function App() {
  return <AuthProvider><Navigator /></AuthProvider>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark },
});