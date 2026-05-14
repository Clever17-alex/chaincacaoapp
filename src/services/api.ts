import axios from 'axios';
import { storage } from '../utils/storage';

// Change pour ton IP locale ou Render
//const BASE_URL = 'http://192.168.1.73:3000';
const BASE_URL = 'http://10.0.2.2:3000';
// const BASE_URL = 'https://chaincacao-backend.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) await storage.clearAll();
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };