import { apiClient } from './client';
import type { Enrollment } from '../types/learning';

export const enrollmentApi = {
  getAll: () =>
    apiClient.get<Enrollment[]>('/enrollment').then((res) => res.data),

  getById: (id: number) =>
    apiClient.get<Enrollment>(`/enrollment/${id}`).then((res) => res.data),

  create: (payload: { user_id: number; class_id: number; role_in_class: 'siswa' | 'mentor' }) =>
    apiClient.post<{ message: string; data: Enrollment }>('/enrollment', payload).then((res) => res.data),

  update: (id: number, payload: { progress?: number; role_in_class?: 'siswa' | 'mentor' }) =>
    apiClient.put<{ message: string; data: Enrollment }>(`/enrollment/${id}`, payload).then((res) => res.data),

  delete: (id: number) =>
    apiClient.delete<{ message: string }>(`/enrollment/${id}`).then((res) => res.data),
};
