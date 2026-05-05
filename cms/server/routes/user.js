import express from "express";
import {
    getCbsUsersByBarangay,
    addCbsUser,
    getUserRolesByLguType,
    getAllLguTypes,
    getAllCbsUsers,
    deleteCbsUser
} from "../controllers/userController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/add-user', verifyUser, addCbsUser);
router.get('/lgu-type', verifyUser, getAllLguTypes);
router.get('/get-user-role/:id', verifyUser, getUserRolesByLguType);
router.get('/:id', verifyUser, getCbsUsersByBarangay);
router.get('/:lguTypeId/:id', verifyUser, getAllCbsUsers);
router.delete("/delete-user/:id", verifyUser, deleteCbsUser);

export default router;