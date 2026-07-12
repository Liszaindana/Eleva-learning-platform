import { apiClient } from './client';
import type { Exam } from '../types/learning';

export const examApi = {
  getAll: () =>
    apiClient.get<Exam[]>('/exam').then((res) => res.data),

  getById: (id: number) =>
    apiClient.get<Exam>(`/exam/${id}`).then((res) => res.data),

  create: (payload: { class_id: number; user_id: number; title: string; min_score?: number; score?: number }) =>
    apiClient.post<{ message: string; data: Exam }>('/exam', payload).then((res) => res.data),

  update: (id: number, payload: Partial<Exam>) =>
    apiClient.put<{ message: string; data: Exam }>(`/exam/${id}`, payload).then((res) => res.data),

  delete: (id: number) =>
    apiClient.delete<{ message: string }>(`/exam/${id}`).then((res) => res.data),
};
