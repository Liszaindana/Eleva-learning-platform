import { apiClient } from './client';

export const adminApi = {
  getDashboard: () => apiClient.get('/admin/dashboard').then((res) => res.data),
  getUsers: () => apiClient.get('/admin/users').then((res) => res.data),
  getCategories: () => apiClient.get('/admin/categories').then((res) => res.data),
};
