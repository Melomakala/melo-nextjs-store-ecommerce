import express from 'express'
import dotenv from "dotenv"; dotenv.config();
import { errorHandler } from './common/middleware/errorHandler';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import walletRoutes from './modules/wallet/wallet.routes';
import productRoutes from './modules/product/product.routes';
import path from "path";

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json())

// GlobalGuard
app.use('/api', authRoutes)
app.use('/api', productRoutes)
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')))
// routeGuard
app.use("/api", userRoutes)
app.use("/api", walletRoutes)

app.use(errorHandler);
export default app;