import express from "express";
import {createUserByAdmin, getalluser, getuserbyId, updateUser, deleteUser } from "../controllers/usercontroller.js";
const router = express.Router();

router.post("/admin-create", createUserByAdmin);
router.get("/users", getalluser);
router.get("/users/:id", getuserbyId);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;