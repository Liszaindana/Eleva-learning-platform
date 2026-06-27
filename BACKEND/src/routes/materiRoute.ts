import express from "express";
import { createmateri, getallmateri, getmateribyid, updatemateri, deletemateri } from "../controllers/matericontroller.js";
const router = express.Router();

router.post("/materi", createmateri);
router.get("/materi", getallmateri);
router.get("/materi/:id", getmateribyid);
router.put("/materi/:id", updatemateri);
router.delete("/materi/:id", deletemateri);

export default router;