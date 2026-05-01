import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, BackHandler, Animated, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateLotScreen from '../screens/CreateLotScreen';
import GPSScreen from '../screens/GPSScreen';
import PhotoScreen from '../screens/PhotoScreen';
import SuccessScreen from '../screens/SuccessScreen';
import LotDetailScreen from '../screens/LotDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

export interface NavParams {
  lot?: any;
  lotData?: any;
}

interface Route {
  name: string;
  params?: NavParams;
}

export const NavContext = React.createContext<{
  navigate: (name: string, params?: NavParams) => void;
  goBack: () => void;
  currentRoute: string;
}>({
  navigate: () => {},
  goBack: () => {},
  currentRoute: 'Splash',
});

const DARK_SCREENS = ['Splash', 'Login', 'Register', 'Photo', 'Success'];

function NavigatorContent() {
  const { isLoading, isAuthenticated } = useAuth();
  const [stack, setStack] = useState<Route[]>([{ name: 'Splash' }]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) {
        animateTransition('back');
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [stack.length]);

  const animateTransition = (direction: 'forward' | 'back' = 'forward') => {
    fadeAnim.setValue(0);
    slideAnim.setValue(direction === 'forward' ? 30 : -30);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const navigate = useCallback((name: string, params?: NavParams) => {
    animateTransition('forward');
    setStack((prev) => {
      if (name === 'Home') {
        return [{ name: 'Home', params }];
      }
      return [...prev, { name, params }];
    });
  }, []);

  const goBack = useCallback(() => {
    animateTransition('back');
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  const currentRoute = stack[stack.length - 1];
  const isDark = DARK_SCREENS.includes(currentRoute.name);

  // Loading screen
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.darkBase, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.accentWarm} />
      </View>
    );
  }

  const renderScreen = () => {
    const props = {
      navigation: { navigate, goBack },
      route: { params: currentRoute.params || {} },
    };

    switch (currentRoute.name) {
      case 'Splash':
        return <SplashScreen {...props} />;
      case 'Login':
        return <LoginScreen {...props} />;
      case 'Register':
        return <RegisterScreen {...props} />;
      case 'Home':
        return <HomeScreen {...props} />;
      case 'CreateLot':
        return <CreateLotScreen {...props} />;
      case 'GPS':
        return <GPSScreen {...props} />;
      case 'Photo':
        return <PhotoScreen {...props} />;
      case 'Success':
        return <SuccessScreen {...props} />;
      case 'LotDetail':
        return <LotDetailScreen {...props} />;
      case 'Notifications':
        return <NotificationsScreen {...props} />;
      case 'History':
        return <HistoryScreen {...props} />;
      case 'Profile':
        return <ProfileScreen {...props} />;
      default:
        return <SplashScreen {...props} />;
    }
  };

  return (
    <NavContext.Provider value={{ navigate, goBack, currentRoute: currentRoute.name }}>
      <View style={[styles.container, { backgroundColor: isDark ? Colors.darkBase : Colors.lightNeutral }]}>
        <Animated.View
          style={[
            styles.animatedScreen,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {renderScreen()}
        </Animated.View>
      </View>
    </NavContext.Provider>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigatorContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedScreen: {
    flex: 1,
  },
});