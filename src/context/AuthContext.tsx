import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '@/api/api';

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
  login: (token: string, user: User) => Promise<void>;
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
      // Sync API + memory
      setAuthToken(newToken);
      setToken(newToken);
      setUser(newUser);

      // Persist
      await AsyncStorage.multiSet([
        ['@auth_token', newToken],
        ['@user_data', JSON.stringify(newUser)],
        ['@last_activity_time', Date.now().toString()],
      ]);
    } catch (e) {
      console.error('Login storage failed', e);
    }
  };

  const logout = async () => {
    try {
      // Clear API + memory
      setAuthToken(undefined);
      setToken(null);
      setUser(null);

      // Clear persistence
      await AsyncStorage.multiRemove([
        '@auth_token',
        '@user_data',
        '@last_activity_time',
      ]);
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
