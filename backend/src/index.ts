import express, { Request, Response } from 'express'
import dotenv from "dotenv"; dotenv.config();
import { errorHandler } from './common/middleware/errorHandler';

const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello!' })
})

app.use(errorHandler);
export default app;