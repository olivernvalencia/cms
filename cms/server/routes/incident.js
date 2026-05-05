import express from "express";
import {
    getAllIncidents,
    getIncidentById,
    addIncidentReport,
    updateIncidentReport,
    deleteIncidentReport
} from "../controllers/incidentController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-all-incidents/:id", verifyUser, getAllIncidents);
router.get("/get-incident/:id", verifyUser, getIncidentById);
router.post("/add/incident-report", verifyUser, addIncidentReport);
router.put("/update/incident-report/:id", verifyUser, updateIncidentReport);
router.delete("/:id", verifyUser, deleteIncidentReport);
export default router;