import api from './api';

interface EUDRRequest {
  lotCode: string;
  latitude: number;
  longitude: number;
}

interface EUDRResponse {
  lotID?: string;
  isCompliant: boolean;
  additionalData?: any;
}

export const eudrService = {
  async verify(data: EUDRRequest): Promise<EUDRResponse> {
    const response = await api.post('/api/v1/eudr', data);
    return response.data;
  },

  async verifyWithQR(data: EUDRRequest): Promise<{ eudr: EUDRResponse; qrCode: string; timestamp: string }> {
    const response = await api.post('/api/v1/eudr-qr', data);
    return response.data;
  },
};