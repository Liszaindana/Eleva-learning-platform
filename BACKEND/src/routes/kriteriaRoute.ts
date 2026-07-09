import express from "express";
import {
  createKriteria,
  getAllKriteria,
  getKriteriaById,
  updateKriteria,
  deleteKriteria,
} from "../controllers/kriteriacontroller.js";

const router = express.Router();

router.post("/kriteria", createKriteria);
router.get("/kriteria", getAllKriteria);
router.get("/kriteria/:id", getKriteriaById);
router.put("/kriteria/:id", updateKriteria);
router.delete("/kriteria/:id", deleteKriteria);

export default router;