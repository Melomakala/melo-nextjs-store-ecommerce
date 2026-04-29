import express from 'express'
import dotenv from "dotenv"; dotenv.config();
import { errorHandler } from './common/middleware/errorHandler';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json())

app.use('/api', authRoutes)

app.use("/api", userRoutes)

app.use(errorHandler);
export default app;