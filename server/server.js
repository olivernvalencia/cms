import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import residentRoutes from './routes/resident.js';
import statsRoutes from './routes/stats.js';
import blotterRoutes from './routes/blotter.js';
import locationRoutes from './routes/location.js'
import certificateRoutes from './routes/certificate.js'
import brgyOfficialsRoutes  from './routes/officials.js';
import cfg from './config/config.js';

const app = express();

// Middleware
app.use(express.json());

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(500).json({ message: err.message });
    }
    next();
});

const uploadDirs = ['user_profile', 'certificates', 'brgy_logo', 'others'].map(
    dir => path.join('./uploads', dir)
);

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(500).json({ message: err.message });
    }
    next();
});

app.use(cors({
    origin: [`http://localhost:5173`,`http://127.0.0.1:5173`,`http://${cfg.domainname}:5173`],

    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
   allowedHeaders: ["Content-Type", "Authorization", "sentry-trace", "baggage"],
}));
app.use(cookieParser());


// Routes
app.use('/', authRoutes);
app.use('/residents', residentRoutes);
app.use('/stats', statsRoutes);
app.use('/blotter', blotterRoutes);
app.use('/location', locationRoutes)
app.use('/certificate', certificateRoutes)
app.use('/official', brgyOfficialsRoutes)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});