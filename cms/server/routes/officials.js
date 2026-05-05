import express from "express";
import {
    getAllBrgyOfficials,
    getAllSKOfficials,
    getOtherBrgyOfficials,
    getCBSOfficials,
    getAllBrgyOfficialType,
    insertBrgyOfficial, 
    deleteCbsOfficial,
    updateCbsOfficial
} from "../controllers/brgyOfficials.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/add-official', verifyUser, insertBrgyOfficial);
router.get("/:id", verifyUser, getAllBrgyOfficials);
router.get("/sk/:id", verifyUser, getAllSKOfficials);
router.get("/others/:id", verifyUser, getOtherBrgyOfficials);
router.put("/update-official/:id", verifyUser, updateCbsOfficial);
router.delete("/delete-official/:id", verifyUser, deleteCbsOfficial )
router.get("/official-type/:id", verifyUser, getAllBrgyOfficialType)
router.get("/:lguTypeId/:barangayId", verifyUser, getCBSOfficials);

export default router;