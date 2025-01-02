import express from 'express';
import upload from '../middleware/multerMiddleware.js'; // Import multer middleware (ES Module)
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

router.get('/:id', verifyUser, getAllResidents);
router.put('/update/:id', verifyUser, updateResident);
router.delete('/:id', verifyUser, deleteResident);
router.get('/count/:id', verifyUser, getResidentCount);

export default router;
