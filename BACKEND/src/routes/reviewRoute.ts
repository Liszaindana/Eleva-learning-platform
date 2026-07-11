import express from "express";
import { getallreview, getreviewbyid, createreview, updatereview, deletereview } from "../controllers/reviewcontroller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/review", getallreview);
router.get("/review/:id", getreviewbyid);
router.post("/review", authMiddleware, createreview);
router.put("/review/:id", authMiddleware, updatereview);
router.delete("/review/:id", authMiddleware, deletereview);

export default router;