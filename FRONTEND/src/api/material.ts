import { apiClient } from './client';
import type { Materi } from '../types/learning';

export const materialApi = {
  getAll: () =>
    apiClient.get<Materi[]>('/materi').then((res) => res.data),

  getById: (id: number) =>
    apiClient.get<Materi>(`/materi/${id}`).then((res) => res.data),

  create: (payload: { class_id: number; title: string; content: string; video_url: string }) =>
    apiClient.post<{ message: string; data: Materi }>('/materi', payload).then((res) => res.data),

  update: (id: number, payload: Partial<Materi>) =>
    apiClient.put<{ message: string; data: Materi }>(`/materi/${id}`, payload).then((res) => res.data),

  delete: (id: number) =>
    apiClient.delete<{ message: string }>(`/materi/${id}`).then((res) => res.data),
};
