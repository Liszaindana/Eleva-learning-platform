import { apiClient } from './client';
import type { Class } from '../types/learning';

export const kelasApi = {
  getAll: () => apiClient.get<Class[]>('/class').then((res) => res.data),
  getById: (id: number) => apiClient.get<Class>(`/class/${id}`).then((res) => res.data),
  create: (data: any) => apiClient.post('/class', data).then((res) => res.data),
  update: (id: number, data: any) => apiClient.put(`/class/${id}`, data).then((res) => res.data),
  delete: (id: number | string) => apiClient.delete(`/class/${id}`).then((res) => res.data),
  getCategories: () => apiClient.get<any[]>('/category').then((res) => res.data),
};
