import { apiClient } from './client';
import type { Class, User, RegisterPayload } from '../types/learning';
import type { ApiResponse } from '../types/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    user_id: number;
    name: string;
    email: string;
    role: string;
  };
}

// ── Class Endpoints ─────────────────────────────────────────

export const classApi = {
  getAll: () =>
    apiClient.get<Class[]>('/class').then((res) => res.data),

  getById: (id: number) =>
    apiClient.get<Class>(`/class/${id}`).then((res) => res.data),
};

// ── User / Auth Endpoints ───────────────────────────────────

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient
      .post<LoginResponse>('/auth/login', payload)
      .then((res) => res.data),

  register: (payload: RegisterPayload) =>
    apiClient
      .post<ApiResponse<User>>('/auth/register', payload)
      .then((res) => res.data),

  me: () =>
    apiClient
      .get<User>('/auth/me')
      .then((res) => res.data),

  logout: () =>
    apiClient
      .post('/auth/logout')
      .then((res) => res.data),
};

export const userApi = {
  getAll: () =>
    apiClient.get<User[]>('/users').then((res) => res.data),

  getById: (id: number) =>
    apiClient
      .get<ApiResponse<User>>(`/users/${id}`)
      .then((res) => res.data),
};
