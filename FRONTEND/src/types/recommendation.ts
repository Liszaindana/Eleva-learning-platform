export interface Kriteria {
  id_kriteria: number;
  kode: string;
  nama: string;
  tipe: 'benefit' | 'cost';
  bobot: number;
}

export interface RequestBobot {
  id_bobot: number;
  id_recomen: number;
  id_kriteria: number;
  bobot_req: number;
  kriteria?: Kriteria;
}

export interface RecommendationResultUser {
  user_id: number;
  name: string;
  email?: string;
}

export interface RecommendationResultItem {
  id_hasil: number;
  id_recomen: number;
  user_id: number;
  score: number;
  ranking: number;
  user?: RecommendationResultUser;
}

export interface RecommendationRequest {
  id_recomen: number;
  user_id: number;
  category_id: number;
  periode_id: number;
  method: 'SAW' | 'WP' | 'TOPSIS';
  created_at: string;
  category?: { category_id: number; categories: string };
  periode?: { periode_id: number; year: number };
  weights?: RequestBobot[];
  results?: RecommendationResultItem[];
}

export interface RecommendationWeightInput {
  kriteria_id: number;
  bobot: number;
}

export interface CreateRecommendationPayload {
  category_id: number;
  periode_id?: number;
  method: 'SAW' | 'WP' | 'TOPSIS';
  weights?: RecommendationWeightInput[];
}