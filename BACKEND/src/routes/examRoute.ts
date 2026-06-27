import express from "express";
import { createexam, getallexam, getexambyid, updateexam, deleteexam } from "../controllers/examcontroller.js";
const router = express.Router();

router.post("/exam", createexam);
router.get("/exam", getallexam);
router.get("/exam/:id", getexambyid);
router.put("/exam/:id", updateexam);
router.delete("/exam/:id", deleteexam);

export default router;