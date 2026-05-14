import api from './api';

export const transfertService = {
  async create(data: { lotId: string; origine: string; destinataire: string; typeDestinataire: string; responsable: string; poidsTransfere: number; conditionnement: string; notes?: string; documents?: string[] }) {
    const { data: response } = await api.post('/transferts', data);
    return response;
  },
  async getAll() {
    const { data } = await api.get('/transferts');
    return data;
  },
  async getById(id: string) {
    const { data } = await api.get(`/transferts/${id}`);
    return data;
  },
  async updateStatus(id: string, statut: string) {
    const { data } = await api.patch(`/transferts/${id}/statut`, { statut });
    return data;
  },
  async addDocument(id: string, document: string) {
    const { data } = await api.post(`/transferts/${id}/documents`, { document });
    return data;
  },
  async getByLot(lotId: string) {
    const { data } = await api.get(`/transferts/lot/${lotId}`);
    return data;
  },
};