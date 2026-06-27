import express from "express";
import { createcategory, getallcategories, getcategorybyId, updatecategory, deletecategory } from "../controllers/categorycontroller.js";
const router = express.Router();

router.post("/category", createcategory);
router.get("/category", getallcategories);
router.get("/category/:id", getcategorybyId);
router.put("/category/:id", updatecategory);
router.delete("/category/:id", deletecategory);

export default router;