import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';

interface User {
  id: string;
  actorID: string;
  name: string;
  role: string;
  email: string;
  organization: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await storage.getToken();
      const storedUser = await storage.getUser();
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (e) {
      console.error('Erreur chargement auth:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (emailOrPhone: string, password: string) => {
    const response = await authService.login({ emailOrPhone, password });
    await storage.setToken(response.token);
    await storage.setUser(response.actor);
    setToken(response.token);
    setUser(response.actor);
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    await storage.setToken(response.token);
    await storage.setUser(response.actor);
    setToken(response.token);
    setUser(response.actor);
  };

  const logout = async () => {
    await storage.clearAll();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);