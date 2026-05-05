import express from "express";
import {
    getAllCertificateRequest,
    getAllCertificateTypes,
    addCertificationRequest,
    getAllCertificate,
    addCertificateType,
    deleteCertificate,
    updateCertificationType,
    getControlNumber,
    getIndigencyControlNumber,
    getBarangayDetails,
} from "../controllers/certificateController.js";
import { verifyUser } from "../middleware/authMiddleware.js";
import upload from '../middleware/multerMiddleware.js';

const router = express.Router();

router.get("/", verifyUser, getAllCertificateTypes);
router.post("/add", verifyUser, upload.single('certificate'), addCertificationRequest);
router.post("/add-certificate-type", verifyUser, addCertificateType);
router.get("/get-certificate-type", verifyUser, getAllCertificate);
router.get("/controlno", verifyUser, getControlNumber);
router.get("/indigent-controlno", verifyUser, getIndigencyControlNumber);
router.get("/barangay-details/:id", verifyUser, getBarangayDetails);
router.delete('/delete-certificate/:id', verifyUser, deleteCertificate);
router.put('/update-certificate/:id', updateCertificationType);
router.get("/:id", verifyUser, getAllCertificateRequest);

export default router;