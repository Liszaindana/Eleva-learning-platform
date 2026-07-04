import { apiClient } from './client';

export const mentorApi = {
  getDashboard: () => apiClient.get('/mentor/dashboard').then((res) => res.data),
  getMyClasses: () => apiClient.get('/mentor/classes').then((res) => res.data),
};
