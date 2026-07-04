import { apiClient } from './client';
import type { Class, User, RegisterPayload } from '../types/learning';
import type { ApiResponse } from '../types/api';

// ── Class Endpoints ─────────────────────────────────────────

export const classApi = {
  getAll: () =>
    apiClient.get<Class[]>('/class').then((res) => res.data),

  getById: (id: number) =>
    apiClient.get<Class>(`/class/${id}`).then((res) => res.data),
};

// ── User / Auth Endpoints ───────────────────────────────────

export const userApi = {
  register: (payload: RegisterPayload) =>
    apiClient
      .post<ApiResponse<User>>('/users', payload)
      .then((res) => res.data),

  getAll: () =>
    apiClient.get<User[]>('/users').then((res) => res.data),

  getById: (id: number) =>
    apiClient
      .get<ApiResponse<User>>(`/users/${id}`)
      .then((res) => res.data),
};
