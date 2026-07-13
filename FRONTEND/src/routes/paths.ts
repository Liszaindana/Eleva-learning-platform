export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  KELAS: '/kelas',
  KELAS_DETAIL: '/kelas/:id',
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_COURSES: '/student/courses',
  STUDENT_COURSE_DETAIL: '/student/courses/:id',
  STUDENT_MATERIALS: '/student/materials',
  STUDENT_MATERIAL_DETAIL: '/student/materials/:id',
  STUDENT_PROGRESS: '/student/progress',
  STUDENT_EXAMS: '/student/exams',
  STUDENT_REVIEWS: '/student/reviews',
  STUDENT_REVIEW_CREATE: '/student/reviews/:courseId/create',
  STUDENT_SCHEDULE: '/student/schedule',
  STUDENT_PROFILE: '/student/profile',

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
  ADMIN_KRITERIA: '/admin/kriteria',
  ADMIN_KRITERIA_VALUES: '/admin/kriteria/:id/values',
  ADMIN_RECOMMENDATION_ALL: '/admin/recommendations-list',
  RECOMMENDATION: '/recommendation',
  RECOMMENDATION_HISTORY: '/admin/recommendation/history',
  RECOMMENDATION_DETAIL: '/admin/recommendations/:id',

  // MENTOR PATHS 
  MENTOR_DASHBOARD: '/mentor/dashboard',
  MENTOR_CLASS_LIST: '/mentor/courses',
  MENTOR_CLASS_CREATE: '/mentor/courses/create',
  MENTOR_CLASS_EDIT: '/mentor/courses/:id/edit',
  MENTOR_MATERIAL_LIST: '/mentor/materials',
  MENTOR_MATERIAL_CREATE: '/mentor/materials/:classId/create',
  MENTOR_MATERIAL_EDIT: '/mentor/materials/:classId/:materiId/edit',
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

export function kriteriaValueDetailPath(id: number): string {
  return `/admin/kriteria/${id}/values`;
}

export function recommendationDetailPath(id: number): string {
  return `/recommendation/${id}`;
}


/**
 * Build a mentor class edit path with a specific ID (Untuk CRUD Mentor)
 */
export function mentorClassEditPath(id: number): string {
  return `/mentor/courses/${id}/edit`;
}

/**
 * 🚀 SESUAIKAN: Arahkan ke halaman utama list materi yang baru (bukan rute /courses lagi)
 */
export function mentorMaterialListPath(): string {
  return `/mentor/materials`;
}

/**
 *  Build path untuk membuat materi baru di kelas tertentu
 */
export const mentorMaterialCreatePath = (classId: number | string) => 
  `/mentor/materials/${classId}/create`;

/**
 *  Build path untuk mengedit materi spesifik berdasarkan ID Kelas dan ID Materi
 */
export const mentorMaterialEditPath = (classId: number | string, materiId: number | string) => 
  `/mentor/materials/${classId}/${materiId}/edit`;

/**
 * 🚀 TAMBAHKAN: Build path untuk halaman review mentor
 */
export function mentorReviewListPath(): string {
  return `/mentor/reviews`;
}

/**
 * Build a student course detail path
 */
export function studentCourseDetailPath(id: number): string {
  return `/student/courses/${id}`;
}

/**
 * Build a student review create path
 */
export function studentReviewCreatePath(courseId: number): string {
  return `/student/reviews/${courseId}/create`;
}

// Di dalam file paths.ts (di luar objek PATHS)
export const adminRecommendationDetailPath = (id: number | string) => 
  `/admin/recommendations/${id}`;