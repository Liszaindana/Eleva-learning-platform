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

  getCategories: () =>
    apiClient.get<any[]>('/category').then((res) => res.data),
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


// ── Category Endpoints ───────────────────────────────────

export const categoryApi = {
  getAll: () => 
    apiClient.get<any[]>('/category').then((res) => res.data),

  getById: (id: number) => 
    apiClient.get<any>(`/category/${id}`).then((res) => res.data),

  create: (data: { categories: string }) => 
    apiClient.post('/category', data).then((res) => res.data),

  update: (id: number, data: { categories: string }) => 
    apiClient.put(`/category/${id}`, data).then((res) => res.data),

  delete: (id: number) => 
    apiClient.delete(`/category/${id}`).then((res) => res.data),
};

// ── Review Endpoints ───────────────────────────────────

export const reviewApi = {
  getAll: () =>
    apiClient.get<any[]>('/review').then((res) => res.data),

  create: (payload: { class_id: number; rating: number; comment: string }) =>
    apiClient.post('/review', payload).then((res) => res.data),

  update: (id: number, payload: { rating?: number; comment?: string }) =>
    apiClient.put(`/review/${id}`, payload).then((res) => res.data),

  remove: (id: number) =>
    apiClient.delete(`/review/${id}`).then((res) => res.data),
};

// ── Enrollment Endpoints ───────────────────────────────────

export const enrollmentApi = {
  getAll: () => 
    apiClient.get<any[]>('/enrollment').then((res) => res.data),
}