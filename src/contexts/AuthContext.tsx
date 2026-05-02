import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';
import api from '../services/api';

function getActorIDFromToken(token: string): string | null {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload.actorID || null;
  } catch { return null; }
}

interface User {
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

  useEffect(() => { loadStoredAuth(); }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await storage.getToken();
      const storedUser = await storage.getUser();
      if (storedToken) {
        setToken(storedToken);
        if (storedUser && storedUser.actorID) {
          setUser(storedUser);
        } else {
          const actorID = getActorIDFromToken(storedToken);
          if (actorID) {
            const rebuiltUser: User = { actorID, name: actorID, role: 'FARMER', email: '', organization: '' };
            setUser(rebuiltUser);
            await storage.setUser(rebuiltUser);
          }
        }
      }
    } catch (e) {
      console.error('Erreur chargement auth:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const createActorIfNeeded = async (actorID: string, email: string, name: string) => {
    try {
      console.log('Tentative création acteur:', actorID);
      await api.post('/api/v1/auth/register', {
        actorID,
        name: name || actorID,
        role: 'FARMER',
        email: email,
        organization: 'Coopérative',
        password: 'autocreated123',
      });
      console.log('Acteur créé avec succès:', actorID);
    } catch (err: any) {
      // Si l'acteur existe déjà, c'est OK
      if (err.response?.status === 400 && err.response?.data?.error?.includes('already exists')) {
        console.log('Acteur existe déjà:', actorID);
      } else {
        console.log('Erreur création acteur (peut être normal):', err.response?.data || err.message);
      }
    }
  };

  const login = async (emailOrPhone: string, password: string) => {
    const response = await authService.login({ emailOrPhone, password });
    await storage.setToken(response.token);
    setToken(response.token);

    const actorID = getActorIDFromToken(response.token) || emailOrPhone.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Créer l'acteur automatiquement après le login
    await createActorIfNeeded(actorID, emailOrPhone, response.actor?.name || actorID);

    const userData: User = {
      actorID,
      name: response.actor?.name || actorID,
      role: 'FARMER',
      email: emailOrPhone,
      organization: response.actor?.organization || '',
    };

    await storage.setUser(userData);
    setUser(userData);
    console.log('User connecté:', userData.actorID);
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    await storage.setToken(response.token);
    setToken(response.token);

    const actorID = getActorIDFromToken(response.token) || data.actorID;
    const userData: User = {
      actorID,
      name: response.actor?.name || data.name,
      role: 'FARMER',
      email: response.actor?.email || data.email,
      organization: response.actor?.organization || data.organization,
    };

    await storage.setUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    await storage.clearAll();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!token && !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);