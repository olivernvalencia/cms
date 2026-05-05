import express from 'express';
import upload from '../middleware/multerMiddleware.js';
import { verifyUser } from '../middleware/authMiddleware.js';
import {
    getAllResidents,
    addResident,
    updateResident,
    deleteResident,
    getResidentCount
} from '../controllers/residentController.js';

const router = express.Router();

// Route to add a resident with file upload
router.post('/add', verifyUser, upload.single('Profile_Image'), addResident); // Use multer middleware for 'Profile_Image'
router.put('/update/:id', verifyUser, upload.single('Profile_Image'), updateResident);
router.get('/:id', verifyUser, getAllResidents);
router.delete('/:id', verifyUser, deleteResident);
router.get('/count/:id', verifyUser, getResidentCount);

export default router;
