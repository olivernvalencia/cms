import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import residentRoutes from './routes/resident.js';
import statsRoutes from './routes/stats.js';
import blotterRoutes from './routes/blotter.js';
import locationRoutes from './routes/location.js'
import certificateRoutes from './routes/certificate.js'
import brgyOfficialsRoutes  from './routes/officials.js';
import cfg from './controllers/originController.js'

const app = express();

console.log(`NET: ${cfg.ipaddress}`)
console.log(`DOMAIN: ${cfg.domainname}`)


// Middleware
app.use(express.json());
app.use(cors({
    origin: [`http://localhost:5173`,`http://127.0.0.1:5173`,`http://${cfg.domainname}:5173`,`http://${cfg.ipaddress}:5173`],
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