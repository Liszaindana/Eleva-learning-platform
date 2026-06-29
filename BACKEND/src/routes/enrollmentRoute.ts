import express from "express";
import { createenrollment, getallenrollment, getenrollmentbyid, updateenrollment, deleteenrollment } from "../controllers/enrollmentcontroller.js";
const router = express.Router();

router.post("/enrollment", createenrollment);
router.get("/enrollment", getallenrollment);
router.get("/enrollment/:id", getenrollmentbyid);
router.put("/enrollment/:id", updateenrollment);
router.delete("/enrollment/:id", deleteenrollment);

export default router;