import express from 'express';
import { register, login, logout, getHome, setCookie, getCookie } from '../controllers/authController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/home', verifyUser, getHome);
router.get('/set-cookie', setCookie);
router.get('/get-cookie', getCookie);

export default router;