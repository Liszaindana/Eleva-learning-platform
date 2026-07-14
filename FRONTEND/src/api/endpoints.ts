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

export interface MaterialPayload {
    class_id: number;
    title: string;
    content: string;
    video_url?: string | null;
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

  getMentors: () =>
    apiClient
      .get<User[]>('/users')
      .then((res) => {
        return res.data.filter((user: any) => user.role_id === 2 || user.role === 2);
      }),
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

  getMyEnrollment: () => 
    apiClient.get<any[]>('/enrollment/my').then((res) => res.data),
}

// ── level Endpoints ───────────────────────────────────

export const levelApi = {
  getAll: () => 
  apiClient.get<any[]>('/level').then((res) => res.data),
}

// ── Periode Endpoints ───────────────────────────────────

export const periodeApi = {
  getAll: () =>
    apiClient.get<any[]>('/periode').then((res) => res.data),
}

// ── Materi Endpoints ───────────────────────────────────

export const materiApi = {
    create: (payload: MaterialPayload) =>
        apiClient.post<any>('/materi', payload).then((res) => res.data),

    getAll: () =>
        apiClient.get<any[]>('/materi').then((res) => res.data),

    update: (materiId: number, payload: { title: string; content: string; video_url?: string | null }) =>
        apiClient.put(`/materi/${materiId}`, payload).then((res) => res.data),
};