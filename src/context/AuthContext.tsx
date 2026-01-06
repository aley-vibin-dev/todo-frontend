import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '@/api/api';
import { CommonActions } from '@react-navigation/native'; // ✅
import { navigationRef } from '@/navigation/RootNavigation'; // ✅
import { RootStackParamList } from '@/navigation/AppNavigator'; // ✅

type UserRole = 'admin' | 'manager' | 'user';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@auth_token');
        const storedUser = await AsyncStorage.getItem('@user_data');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setAuthToken(storedToken);
        }
      } catch (e) {
        console.error('Failed to load auth state', e);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (newToken: string, newUser: User) => {
    try {
      setToken(newToken);
      setUser(newUser);
      setAuthToken(newToken);

      await AsyncStorage.setItem('@auth_token', newToken);
      await AsyncStorage.setItem('@user_data', JSON.stringify(newUser));
      await AsyncStorage.setItem('@last_activity_time', Date.now().toString());
    } catch (e) {
      console.error('Login storage failed', e);
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      setAuthToken(undefined);

      await AsyncStorage.multiRemove([
        '@auth_token',
        '@user_data',
        '@last_activity_time',
      ]);

      // Reset navigation stack to Landing
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Landing' as keyof RootStackParamList }],
          })
        );
      }
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
