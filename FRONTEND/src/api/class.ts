import { apiClient } from './client';
import type { Class } from '../types/learning';

// ── Class Endpoints ─────────────────────────────────────────

export const classApi = {
  getAll: () =>
    apiClient.get<Class[]>('/class').then((res) => res.data),

  getById: (id: number) =>
    apiClient.get<Class>(`/class/${id}`).then((res) => res.data),

  getCategories: () =>
    apiClient.get<any[]>('/category').then((res) => res.data),

  create: (data: any) =>
    apiClient.post<any>('/class', data).then((res) => res.data),

  update: (id: number, data: any) =>
    apiClient.put<any>(`/class/${id}`, data).then((res) => res.data),

  delete: (id: number) =>
    apiClient.delete<any>(`/class/${id}`).then((res) => res.data),
};

export const kelasApi = classApi;