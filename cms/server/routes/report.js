import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import {
    GetReportHouseholdHead,
    GetReportPurokResidents,
    GetReportPurokResidentsCount,
    GetReportPWD,
    GetReportResidents,
    GetReportSoloParent,
    GetReportSeniorCitizen,
    GetReportYouth
} from '../controllers/reportController.js'

const router = express.Router();

router.get("/get-household-head/:id", verifyUser, GetReportHouseholdHead);
router.get("/get-purok-residents/:id/:purok_id/", verifyUser, GetReportPurokResidents);
router.get("/get-purok-residents-count/:id", verifyUser, GetReportPurokResidentsCount);
router.get("/get-pwd/:id", verifyUser, GetReportPWD);
router.get("/get-residents/:id", verifyUser, GetReportResidents);
router.get("/get-solo-parent/:id", verifyUser, GetReportSoloParent);
router.get("/get-senior-citizen/:id", verifyUser, GetReportSeniorCitizen);
router.get("/get-youth/:id", verifyUser, GetReportYouth);

export default router;