import express from "express";
import {
  createKriteria,
  getAllKriteria,
  getKriteriaById,
  updateKriteria,
  deleteKriteria,
  createKriteriaValue,
  deleteKriteriaValue,
  getKriteriaValuesByKriteria,
  updateKriteriaValue,
} from "../controllers/kriteriacontroller.js";

const router = express.Router();

router.post("/kriteria", createKriteria);
router.get("/kriteria", getAllKriteria);
router.get("/kriteria/:id", getKriteriaById);
router.put("/kriteria/:id", updateKriteria);
router.delete("/kriteria/:id", deleteKriteria);

// Kriteria Value
router.post("/kriteria/:id_kriteria/values", createKriteriaValue);
router.get("/kriteria/:id_kriteria/values", getKriteriaValuesByKriteria);
router.put("/kriteria/values/:id_value", updateKriteriaValue);
router.delete("/kriteria/values/:id_value", deleteKriteriaValue);

export default router;