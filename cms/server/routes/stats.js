import express from 'express';
import {
    getRegisteredVoters,
    getPopulationStats,
    getResidentCount,
    getHouseholdCount,
    getAllPopulationStats,
    getPwdCount
} from '../controllers/statsController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/registered-voters/:id', verifyUser, getRegisteredVoters);
router.get('/population/:id', verifyUser, getPopulationStats);
router.get('/all-population-stats/:id', verifyUser, getAllPopulationStats);
router.get('/count/:id', verifyUser, getResidentCount);
router.get('/household/:id', verifyUser, getHouseholdCount)
router.get('/pwd/:id', verifyUser, getPwdCount)

export default router;