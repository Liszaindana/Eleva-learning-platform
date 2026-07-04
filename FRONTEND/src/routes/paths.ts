export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  KELAS: '/kelas',
  KELAS_DETAIL: '/kelas/:id',
  MENTOR_DASHBOARD: '/mentor/dashboard',
  STUDENT_DASHBOARD: '/student/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CATEGORY_LIST: '/admin/categories',
  ADMIN_CATEGORY_CREATE: '/admin/categories/create',
  ADMIN_CATEGORY_EDIT: '/admin/categories/:id/edit',
  ADMIN_CLASS_LIST: '/admin/classes',
  ADMIN_CLASS_CREATE: '/admin/classes/create',
  ADMIN_CLASS_EDIT: '/admin/classes/:id/edit',
  ADMIN_USER_LIST: '/admin/users',
  ADMIN_REVIEW_LIST: '/admin/reviews',
} as const;

/**
 * Build a kelas detail path with a specific ID
 */
export function kelasDetailPath(id: number): string {
  return `/kelas/${id}`;
}

/**
 * Build a category edit path with a specific ID
 */
export function categoryEditPath(id: number): string {
  return `/admin/categories/${id}/edit`;
}

/**
 * Build a class edit path with a specific ID
 */
export function classEditPath(id: number): string {
  return `/admin/classes/${id}/edit`;
}
