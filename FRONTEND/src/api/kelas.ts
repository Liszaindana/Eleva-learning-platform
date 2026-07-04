import { apiClient } from './client';
import type { Class } from '../types/learning';

export const kelasApi = {
  getAll: () => apiClient.get<Class[]>('/class').then((res) => res.data),
  getById: (id: number) => apiClient.get<Class>(`/class/${id}`).then((res) => res.data),
};
