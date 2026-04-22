import { NextFunction, Request, Response } from "express";
import { JwtPayload, verifyAccessToken, verifyRefreshToken } from "../utils/jwt";
import { CustomError } from "../utils/CustomError";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new CustomError("Unauthorized: No token provided", 401);
        }
        const decodedToken = verifyAccessToken(token) as JwtPayload;
        req.user = decodedToken;
        next();
    } catch (error: any) {
        if (error instanceof CustomError) {
            next(error);
        } else if (error.name === "TokenExpiredError") {
            next(new CustomError("Token Expired", 401));
        } else if (error.name === "JsonWebTokenError") {
            next(new CustomError("Invalid Token", 401));
        } else {
            next(new CustomError(error.message || "Authentication Failed", 401));
        }
    }
}

export const refreshToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            throw new CustomError("Unauthorized: No refresh token provided", 401);
        }
        const decodedToken = verifyRefreshToken(token) as JwtPayload;
        req.user = decodedToken;
        next();
    } catch (error: any) {
        if (error instanceof CustomError) {
            next(error);
        } else if (error.name === "TokenExpiredError") {
            next(new CustomError("Refresh Token Expired", 401));
        } else if (error.name === "JsonWebTokenError") {
            next(new CustomError("Invalid Refresh Token", 401));
        } else {
            next(new CustomError(error.message || "Refresh Token Verification Failed", 401));
        }
    }
}