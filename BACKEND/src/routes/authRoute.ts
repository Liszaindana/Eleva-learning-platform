import { Router } from "express";
import {
  registerStudent,
  login,
  logout,
  me,
  forgotPassword,
} from "../controllers/authcontroller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerStudent);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);

export default router;