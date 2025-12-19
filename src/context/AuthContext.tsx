import React, { createContext, useState, ReactNode } from 'react';
import API, { setAuthToken } from '../api/api';
import { User } from '../types';

interface AuthContextProps {
  userToken: string | null;
  roles: string[];
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  userToken: null,
  roles: [],
  login: async () => ({ id: 0, name: '', email: '', roles: [] }),
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserTokenState] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await API.post('/auth/login', { email, password });
    const data = res.data;

    setUserTokenState(data.token);
    setRoles(data.roles);
    setAuthToken(data.token);

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      roles: data.roles,
    };
  };

  const logout = () => {
    setUserTokenState(null);
    setRoles([]);
    setAuthToken(undefined);
  };

  return (
    <AuthContext.Provider value={{ userToken, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};