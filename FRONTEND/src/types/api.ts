// ── Generic API Response Types ──────────────────────────────

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  error?: unknown;
}

// ── Pagination (for future use) ─────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}
