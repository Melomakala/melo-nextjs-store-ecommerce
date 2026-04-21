import { Request, Response } from "express";
import logger from "../../common/utils/logger"
import * as authServices from "./auth.services";

export const register = async (req: Request, res: Response) => {
    const data = req.body;
    const user = await authServices.registerService(data);
    res.status(201).json({
        message: "Register Success", data: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
        }
    });
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
    const user = await authServices.loginService(data);
    res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({
        message: "Login Success", data: {
            user_id: user.user_id,
            name: user.name,
            role: user.role,
            email: user.email,
            token: user.token
        }
    });
    logger.info("Login Success", {
        meta: {
            user_id: user.user_id,
            service: "auth-login",
            method: req.method,
            url: req.url,
        }
    })
}