import api from './api';

export const lotService = {
  async create(data: { producteurName: string; espece: string; poidsRecu: number; region: string; certification?: string; producteurId?: string }) {
    const { data: response } = await api.post('/lots', data);
    return response;
  },
  async getAll() {
    const { data } = await api.get('/lots');
    return data;
  },
  async getById(id: string) {
    const { data } = await api.get(`/lots/${id}`);
    return data;
  },
  async getHistory(id: string) {
    const { data } = await api.get(`/lots/${id}/history`);
    return data;
  },
  async updateStatus(id: string, statut: string) {
    const { data } = await api.patch(`/lots/${id}/statut`, { statut });
    return data;
  },
  async getByProducteur(producteurId: string) {
    const { data } = await api.get(`/lots/producteur/${producteurId}`);
    return data;
  },
  async getByRegion(region: string) {
    const { data } = await api.get(`/lots/region/${region}`);
    return data;
  },
  async getByStatus(status: string) {
    const { data } = await api.get(`/lots/status/${status}`);
    return data;
  },
  async getQRCode(id: string) {
    const { data } = await api.get(`/lots/${id}/qr`);
    return data;
  },
};