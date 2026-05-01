import api from './api';

interface CreateLotData {
  lotID: string;
  weightKg: number;
  harvestDate: string;
  region: string;
  latitude: number;
  longitude: number;
  ipfsPhotoHash?: string;
}

export const lotService = {
  async create(data: CreateLotData): Promise<any> {
    const response = await api.post('/api/v1/lots', data);
    return response.data;
  },

  async getById(lotId: string): Promise<any> {
    const response = await api.get(`/api/v1/lots/${lotId}`);
    return response.data;
  },

  async verify(lotId: string): Promise<any> {
    const response = await api.get(`/api/v1/verify/${lotId}`);
    return response.data;
  },

  async getQRCode(lotId: string): Promise<{ lotId: string; qrCode: string; verifyUrl: string; timestamp: string }> {
    const response = await api.get(`/api/v1/qr/${lotId}`);
    return response.data;
  },

  async generateEUDR(lotCode: string, latitude: number, longitude: number): Promise<any> {
    const response = await api.post('/api/v1/eudr', { lotCode, latitude, longitude });
    return response.data;
  },
};