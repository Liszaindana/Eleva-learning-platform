export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  KELAS: '/kelas',
  KELAS_DETAIL: '/kelas/:id',
  MENTOR_DASHBOARD: '/mentor/dashboard',
} as const;

/**
 * Build a kelas detail path with a specific ID
 */
export function kelasDetailPath(id: number): string {
  return `/kelas/${id}`;
}
