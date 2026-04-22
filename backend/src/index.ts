import express, { Request, Response } from 'express'
import dotenv from "dotenv"; dotenv.config();
import { errorHandler } from './common/middleware/errorHandler';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';

const app = express()
app.use(cookieParser());
app.use(express.json())

app.use('/api', authRoutes)

app.use("/api", userRoutes)

app.use(errorHandler);
export default app;