import api from './api';

export const certificationService = {
  async create(data: { lotId: string; type: string; organisme: string; organismeId: string; numero: string; dateEmission: string; dateExpiration: string; notes?: string }) {
    const { data: response } = await api.post('/certifications', data);
    return response;
  },
  async getAll() {
    const { data } = await api.get('/certifications');
    return data;
  },
  async getById(id: string) {
    const { data } = await api.get(`/certifications/${id}`);
    return data;
  },
  async updateStatus(id: string, statut: string) {
    const { data } = await api.patch(`/certifications/${id}/statut`, { statut });
    return data;
  },
  async getByLot(lotId: string) {
    const { data } = await api.get(`/certifications/lot/${lotId}`);
    return data;
  },
};