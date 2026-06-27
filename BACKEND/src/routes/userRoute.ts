import express from "express";
import { registerStudent, createUserByAdmin, getalluser, getuserbyId, updateUser, deleteUser } from "../controllers/usercontroller.js";
const router = express.Router();

router.post("/users", registerStudent);
router.post("/admin-create", createUserByAdmin);
router.get("/users", getalluser);
router.get("/users/:id", getuserbyId);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;