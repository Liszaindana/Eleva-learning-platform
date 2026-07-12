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

// Buat rekomendasi mentor baru (SAW/WP/TOPSIS)
router.post(
  "/recommendation",
  authMiddleware,
  authorize("admin", "siswa"),
  createRecommendationRequest
);

// Riwayat semua request rekomendasi milik user yang sedang login
router.get(
  "/recommendation/history",
  authMiddleware,
  getRecommendationHistory
);

router.get("/admin/all", 
  authMiddleware, 
  getAllAdminRecommendations);

// Detail satu request rekomendasi (harus di bawah "/history" biar tidak ketimpa)
router.get(
  "/recommendation/:id",
  authMiddleware,
  getRecommendationDetail
);

// Hapus satu request rekomendasi (khusus admin)
router.delete(
  "/recommendation/:id",
  authMiddleware,
  authorize("admin"),
  deleteRecommendation
);

export default router;