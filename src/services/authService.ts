import api from './api';

interface RegisterData {
  actorID: string;
  name: string;
  role: 'FARMER';
  email: string;
  organization: string;
  password: string;
}

interface LoginData {
  emailOrPhone: string;
  password: string;
}

interface AuthResponse {
  actor: {
    id?: string;
    actorID?: string;
    name?: string;
    role?: string;
    email?: string;
    organization?: string;
  };
  token: string;
}

// Décoder un JWT sans bibliothèque
function decodeJWT(token: string): any {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    return {};
  }
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/v1/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/api/v1/auth/login', data);
    return response.data;
  },

  async getMe(): Promise<any> {
    const response = await api.get('/api/v1/auth/me');
    return response.data;
  },
};

export { decodeJWT };