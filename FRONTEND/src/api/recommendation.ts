import { apiClient } from './client';
import type { ApiResponse } from '../types/api';
import type { Category, Periode } from '../types/learning';
import type {
  RecommendationRequest,
  CreateRecommendationPayload,
  Kriteria,
  KriteriaValue,
} from '../types/recommendation';

// 📄 File: api/endpoints.ts (Frontend)
export const recommendationApi = {
  create: (payload: CreateRecommendationPayload) =>
    apiClient
      .post<ApiResponse<RecommendationRequest>>('/recommendation', payload)
      .then((res) => res.data),

  // 💡 Hapus '/recommendation' di tengah karena di backend cukup '/history'
  getHistory: () =>
    apiClient
      .get<ApiResponse<RecommendationRequest[]>>('/recommendation/history')
      .then((res) => res.data),

  // 💡 Cukup /recommendation/admin/all
  getAllAdmin: () =>
    apiClient
      .get<ApiResponse<RecommendationRequest[]>>('/recommendation/admin/all')
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

export const updateKriteriaBobot = (id: number, bobot: number) =>
  apiClient.put(`/kriteria/${id}`, { bobot }).then((res) => res.data);

export const kriteriaValueApi = {
  getByKriteria: (id_kriteria: number) =>
    apiClient.get<KriteriaValue[]>(`/kriteria/${id_kriteria}/values`).then((res) => res.data),

  create: (payload: { id_kriteria: number; value: string; score: number }) =>
    apiClient.post('/kriteria-value', payload).then((res) => res.data),

  update: (id_value: number, payload: { value?: string; score?: number }) =>
    apiClient.put(`/kriteria-value/${id_value}`, payload).then((res) => res.data),

  remove: (id_value: number) =>
    apiClient.delete(`/kriteria-value/${id_value}`).then((res) => res.data),
};