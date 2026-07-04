import { apiClient } from './client';

export const studentApi = {
  getDashboard: () => apiClient.get('/student/dashboard').then((res) => res.data),
  getEnrolledClasses: () => apiClient.get('/student/classes').then((res) => res.data),
};
