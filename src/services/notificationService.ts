import api from './api';

export const notificationService = {
  async getAll() {
    const { data } = await api.get('/notifications');
    return data;
  },
  async getById(id: string) {
    const { data } = await api.get(`/notifications/${id}`);
    return data;
  },
  async markAsRead(id: string) {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },
  async markAllAsRead() {
    const { data } = await api.patch('/notifications/read-all');
    return data;
  },
  async getUserUnread(userId: string) {
    const { data } = await api.get(`/notifications/user/${userId}/unread`);
    return data;
  },
};