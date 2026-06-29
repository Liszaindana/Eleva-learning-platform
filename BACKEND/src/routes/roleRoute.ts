import express from "express";
import { createrole, getallrole, getrolebyId, updaterole, deleterole } from "../controllers/rolecontroller.js";
const router = express.Router();

router.post("/role", createrole);
router.get("/role", getallrole);
router.get("/role/:id", getrolebyId);
router.put("/role/:id", updaterole);
router.delete("/role/:id", deleterole);

export default router;