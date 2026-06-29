import express from "express";
import { createreview, getallreview, getreviewbyid, updatereview, deletereview } from "../controllers/reviewcontroller.js";
const router = express.Router();

router.post("/review", createreview);
router.get("/review", getallreview);
router.get("/review/:id", getreviewbyid);
router.put("/review/:id", updatereview);
router.delete("/review/:id", deletereview);

export default router;