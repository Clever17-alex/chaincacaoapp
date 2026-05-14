import api from './api';

export const alerteService = {
  async getAll() {
    const { data } = await api.get('/alertes');
    return data;
  },
  async getById(id: string) {
    const { data } = await api.get(`/alertes/${id}`);
    return data;
  },
  async updateStatus(id: string, status: string) {
    const { data } = await api.patch(`/alertes/${id}/status`, { status });
    return data;
  },
  async getByLot(lotId: string) {
    const { data } = await api.get(`/alertes/lot/${lotId}`);
    return data;
  },
  async getByStatus(status: string) {
    const { data } = await api.get(`/alertes/status/${status}`);
    return data;
  },
  async getBySeverity(severity: string) {
    const { data } = await api.get(`/alertes/severity/${severity}`);
    return data;
  },
};