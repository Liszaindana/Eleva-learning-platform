import express from "express";
import { createUserByAdmin, getalluser, getuserbyId, updateUser, deleteUser } from "../controllers/usercontroller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.post("/admin-create", authMiddleware, authorize("admin"), createUserByAdmin);
router.get("/users", authMiddleware, authorize("admin", "mentor"), getalluser);
router.get("/users/:id", authMiddleware, authorize("admin", "mentor"), getuserbyId);
router.put("/users/:id", authMiddleware, updateUser);   // authorize dicek manual di controller (actorRole)
router.delete("/users/:id", authMiddleware, deleteUser); // authorize dicek manual di controller (actorRole)

export default router;