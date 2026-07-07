export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  KELAS: '/kelas',
  KELAS_DETAIL: '/kelas/:id',
  STUDENT_DASHBOARD: '/student/dashboard',
  
  // ADMIN PATHS
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CATEGORY_LIST: '/admin/categories',
  ADMIN_CATEGORY_CREATE: '/admin/categories/create',
  ADMIN_CATEGORY_EDIT: '/admin/categories/:id/edit',
  ADMIN_CLASS_LIST: '/admin/classes',
  ADMIN_CLASS_CREATE: '/admin/classes/create',
  ADMIN_CLASS_EDIT: '/admin/classes/:id/edit',
  ADMIN_USER_LIST: '/admin/users',
  ADMIN_REVIEW_LIST: '/admin/reviews',

  // MENTOR PATHS 
  MENTOR_DASHBOARD: '/mentor/dashboard',
  MENTOR_CLASS_LIST: '/mentor/courses',
  MENTOR_CLASS_CREATE: '/mentor/courses/create',
  MENTOR_CLASS_EDIT: '/mentor/courses/:id/edit',
  MENTOR_MATERIAL_LIST: '/mentor/materials',
  MENTOR_REVIEW_LIST: '/mentor/reviews',
  MENTOR_PROFILE: '/mentor/profile',
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

/**
 * Build a mentor class edit path with a specific ID (Untuk CRUD Mentor)
 */
export function mentorClassEditPath(id: number): string {
  return `/mentor/courses/${id}/edit`;
}