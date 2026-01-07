import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '@/api/api';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '@/navigation/RootNavigation';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@auth_token');
        const storedUser = await AsyncStorage.getItem('@user_data');

        if (storedToken && storedUser) {
          // IMPORTANT: Set token in the API module immediately
          setAuthToken(storedToken);
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
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
      // 1. Sync Memory & API
      setAuthToken(newToken);
      setToken(newToken);
      setUser(newUser);

      // 2. Sync Persistence
      await AsyncStorage.multiSet([
        ['@auth_token', newToken],
        ['@user_data', JSON.stringify(newUser)],
        ['@last_activity_time', Date.now().toString()]
      ]);
    } catch (e) {
      console.error('Login storage failed', e);
    }
  };

  const logout = async () => {
    try {
      // 1. Clear Memory & API module
      setAuthToken(undefined);
      setToken(null);
      setUser(null);

      // 2. Clear Persistence
      await AsyncStorage.multiRemove([
        '@auth_token',
        '@user_data',
        '@last_activity_time',
      ]);

      // 3. Navigate to Landing and Clear Stack History
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Landing' }],
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
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};