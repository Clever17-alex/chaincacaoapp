import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';
import { User } from '../types';

function decodeJWT(token: string): any {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch { return {}; }
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadStoredAuth(); }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([storage.getToken(), storage.getUser()]);
      if (storedToken && storedUser && storedUser.email) {
        setToken(storedToken);
        setUser(storedUser);
      } else if (storedToken) {
        const payload = decodeJWT(storedToken);
        const rebuilt: User = {
          id: payload.userId || payload.sub || '',
          name: payload.name || payload.email?.split('@')[0] || 'Producteur',
          email: payload.email || '',
          role: payload.role || 'agriculteur',
          region: payload.region || '',
          organisation: payload.organisation || '',
          phone: payload.phone || '',
        };
        setUser(rebuilt);
        setToken(storedToken);
      }
    } catch (e) {} finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const payload = decodeJWT(response.token);
    
    const userData: User = {
      id: payload.userId || payload.sub || '',
      name: payload.name || response.user?.name || email.split('@')[0],
      email: payload.email || email,
      role: payload.role || response.user?.role || 'agriculteur',
      region: payload.region || response.user?.region || '',
      organisation: payload.organisation || response.user?.organisation || '',
      phone: payload.phone || response.user?.phone || '',
    };

    await storage.setToken(response.token);
    await storage.setUser(userData);
    setToken(response.token);
    setUser(userData);
    console.log('USER LOGGED IN:', JSON.stringify(userData));
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    const payload = decodeJWT(response.token);
    
    const userData: User = {
      id: payload.userId || payload.sub || '',
      name: data.name,
      email: data.email,
      role: data.role || 'agriculteur',
      region: data.region || '',
      organisation: data.organisation || '',
      phone: data.phone || '',
    };

    await storage.setToken(response.token);
    await storage.setUser(userData);
    setToken(response.token);
    setUser(userData);
  };

  const logout = async () => {
    await storage.clearAll();
    setToken(null);
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      storage.setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!token && !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);