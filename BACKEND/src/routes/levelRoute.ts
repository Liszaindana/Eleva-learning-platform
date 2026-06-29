import express from "express";
import { createlevel, getalllevel, getlevelbyId, updatelevel, deletelevel } from "../controllers/levelcontroller.js";
const router = express.Router();

router.post("/level", createlevel);
router.get("/level", getalllevel);
router.get("/level/:id", getlevelbyId);
router.put("/level/:id", updatelevel);
router.delete("/level/:id", deletelevel);

export default router;