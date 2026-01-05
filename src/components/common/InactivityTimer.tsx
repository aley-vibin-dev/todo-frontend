import React, { useEffect, useRef } from 'react';
import { View, PanResponder, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const INACTIVITY_TIMEOUT = 0.5 * 60 * 1000; // 5 Minutes
const STORAGE_KEY = '@last_activity_time';

export const InactivityTimer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();
  const navigation = useNavigation<any>();
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  const handleAutoLogout = async () => {
    if (timerId.current) clearTimeout(timerId.current);
    await logout();
    // Redirect to login with the session error message
    navigation.navigate('Login', { sessionout_error: true });
  };

  const resetTimer = async () => {
    if (timerId.current) clearTimeout(timerId.current);
    
    if (user) {
      // Update persistent storage for background check
      await AsyncStorage.setItem(STORAGE_KEY, Date.now().toString());

      timerId.current = setTimeout(() => {
        handleAutoLogout();
      }, INACTIVITY_TIMEOUT);
    }
  };

  const checkInactivityOnForeground = async () => {
    const lastTime = await AsyncStorage.getItem(STORAGE_KEY);
    if (lastTime && user) {
      const elapsed = Date.now() - parseInt(lastTime, 10);
      if (elapsed >= INACTIVITY_TIMEOUT) {
        handleAutoLogout();
      } else {
        resetTimer(); // Resume timer
      }
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        checkInactivityOnForeground();
      }
      appState.current = nextAppState;
    });

    // Start timer on mount if user exists
    if (user) resetTimer();

    return () => {
      subscription.remove();
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, [user]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => {
        resetTimer();
        return false;
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};