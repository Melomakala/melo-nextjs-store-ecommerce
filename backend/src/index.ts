import express, { Request, Response } from 'express'
import dotenv from "dotenv"; dotenv.config();
import { errorHandler } from './common/middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';

const app = express()

app.use(express.json())

app.use('/api', authRoutes)

app.use(errorHandler);
export default app;