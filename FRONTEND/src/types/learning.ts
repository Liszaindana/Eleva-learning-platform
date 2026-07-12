// ── Entity Types (matching Prisma schema) ───────────────────

export interface Role {
  role_id: number;
  role_text: string;
}

export interface User {
  user_id: number;
  role_id: number;
  name: string;
  email: string;
  join_date: string;
  role?: Role;
  enrollments?: Enrollment[];
}

export interface Category {
  category_id: number;
  categories: string;
  classes?: Class[];
}

export interface Periode {
  periode_id: number;
  year: string;
}

export interface Level {
  level_id: number;
  level_info: string;
}

export interface Class {
  class_id: number;
  category_id: number;
  periode_id: number;
  level_id: number;
  user_id: number;
  title: string;
  description: string;
  is_active: boolean;
  category?: Category;
  periode?: Periode;
  level?: Level;
  mentor?: User;
  materis?: Materi[];
  exams?: Exam[];
  reviews?: Review[];
  enrollment?: Enrollment[];
}

export interface Enrollment {
  enrollment_id: number;
  user_id: number;
  class_id: number;
  progress: number;
  role_in_class: string;
  user?: User;
  class?: Class;
}

export interface Materi {
  materi_id: number;
  class_id: number;
  title: string;
  content: string;
  video_url: string;
}

export interface Exam {
  exam_id: number;
  class_id: number;
  user_id: number;
  title: string;
  min_score: number;
  score: number;
  is_passed: boolean;
}

export interface Review {
  review_id: number;
  user_id: number;
  class_id: number;
  rating: number;
  comment: string;
  user?: User;
}

// ── Auth Types ──────────────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
