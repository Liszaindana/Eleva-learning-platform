import express from "express";
import { createclass, getallclass, getclassbyid, updateclass, deleteclass } from "../controllers/classcontroller.js";
const router = express.Router();

router.post("/class", createclass);
router.get("/class", getallclass);
router.get("/class/:id", getclassbyid);
router.put("/class/:id", updateclass);
router.delete("/class/:id", deleteclass);

export default router;