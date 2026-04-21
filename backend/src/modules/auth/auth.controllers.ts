import { Request, Response } from "express";
import logger from "../../common/utils/logger"
import { registerService } from "./auth.services";

export const register = async (req: Request, res: Response) => {
    const data = req.body;
    const user = await registerService(data);
    res.status(201).json({ message: "Register Success", user });
    logger.info("Register Success", {
        meta: {
            user_id: user.user_id,
            service: "auth-register",
            method: req.method,
            url: req.url,
        }
    })
}

export const login = async (req: Request, res: Response) => {
    const data = req.body;
    res.json({ message: "Login", data });
    logger.info("Login", data)
}