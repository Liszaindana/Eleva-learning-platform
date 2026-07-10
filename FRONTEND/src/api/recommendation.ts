import { apiClient } from './client';
import type { ApiResponse } from '../types/api';
import type { Category, Periode } from '../types/learning';
import type {
  RecommendationRequest,
  CreateRecommendationPayload,
  Kriteria,
} from '../types/recommendation';

export const recommendationApi = {
  create: (payload: CreateRecommendationPayload) =>
    apiClient
      .post<ApiResponse<RecommendationRequest>>('/recommendation', payload)
      .then((res) => res.data),

  getHistory: () =>
    apiClient
      .get<ApiResponse<RecommendationRequest[]>>('/recommendation/history')
      .then((res) => res.data),

  getDetail: (id: number) =>
    apiClient
      .get<ApiResponse<RecommendationRequest>>(`/recommendation/${id}`)
      .then((res) => res.data),

  remove: (id: number) =>
    apiClient.delete(`/recommendation/${id}`).then((res) => res.data),
};

export const kriteriaApi = {
  getAll: () => apiClient.get<Kriteria[]>('/kriteria').then((res) => res.data),
};

// Dipakai buat isi dropdown kategori & periode di form rekomendasi
export const referenceApi = {
  getCategories: () => apiClient.get<Category[]>('/category').then((res) => res.data),
  getPeriodes: () => apiClient.get<Periode[]>('/periode').then((res) => res.data),
};