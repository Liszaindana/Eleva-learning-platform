import express from "express";
import {
  createRecommendationRequest,
  getRecommendationHistory,
  getRecommendationDetail,
  deleteRecommendation,
  getAllAdminRecommendations,
} from "../controllers/recommendationcontroller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// 1. Buat rekomendasi mentor baru (Akses: POST /recommendation)
router.post("/", authMiddleware, authorize("admin", "siswa"), createRecommendationRequest);

// 2. Semua Admin Recommendations (Taruh di atas agar kata 'admin' tidak dianggap sebagai :id)
router.get("/admin/all", authMiddleware, getAllAdminRecommendations);

// 3. Riwayat request milik user login (Akses: GET /recommendation/history)
router.get("/history", authMiddleware, getRecommendationHistory);

// 4. Detail satu request (Akses: GET /recommendation/:id)
router.get("/:id", authMiddleware, getRecommendationDetail);

// 5. Hapus (Akses: DELETE /recommendation/:id)
router.delete("/:id", authMiddleware, authorize("admin"), deleteRecommendation);

export default router;