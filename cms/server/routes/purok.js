import express from 'express';
import { getPhPuroks, insertPuroks, deletePurok } from '../controllers/purokController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get-puroks/:id', verifyUser, getPhPuroks);
router.post('/add-puroks', verifyUser, insertPuroks);
router.delete('/delete-puroks/:id', verifyUser, deletePurok);

export default router;