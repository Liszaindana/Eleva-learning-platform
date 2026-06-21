import express from "express";
import { getalluser, createuser } from "../controllers/usercontroller.js";
const router = express.Router();

router.get("/users", getalluser);

router.post("/users", createuser);

export default router;