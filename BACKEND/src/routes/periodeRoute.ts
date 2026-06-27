import express from "express";
import { createperiode, getallperiode, getperiodebyId, updateperiode, deleteperiode } from "../controllers/periodecontroller.js";
const router = express.Router();

router.post("/periode", createperiode);
router.get("/periode", getallperiode);
router.get("/periode/:id", getperiodebyId);
router.put("/periode/:id", updateperiode);
router.delete("/periode/:id", deleteperiode);

export default router;