import axios from 'axios';
import { storage } from '../utils/storage';

// CHANGE CETTE URL si tu testes sur téléphone physique
// Windows : ipconfig → Adresse IPv4
//const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'http://192.168.1.77:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter le token à chaque requête
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gérer les 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.clearAll();
    }
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };