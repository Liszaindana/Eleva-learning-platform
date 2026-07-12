import { apiClient } from './client';
import type { Review } from '../types/learning';

export const reviewApi = {
  getAll: () =>
    apiClient.get<Review[]>('/review').then((res) => res.data),

  getById: (id: number) =>
    apiClient.get<Review>(`/review/${id}`).then((res) => res.data),

  create: (payload: { user_id: number; class_id: number; rating: number; comment: string }) =>
    apiClient.post<{ message: string; data: Review }>('/review', payload).then((res) => res.data),

  update: (id: number, payload: Partial<Review>) =>
    apiClient.put<{ message: string; data: Review }>(`/review/${id}`, payload).then((res) => res.data),

  delete: (id: number) =>
    apiClient.delete<{ message: string }>(`/review/${id}`).then((res) => res.data),
};
