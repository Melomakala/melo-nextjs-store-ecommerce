import { NextFunction, Request, Response } from "express";
import { JwtPayload, verifyAccessToken, verifyRefreshToken } from "../utils/jwt";
import { CustomError } from "../utils/CustomError";
import bcrypt from "bcrypt";
import { findRefreshToken } from "../../modules/auth/auth.models";
import { cookieOptions } from "../utils/cookie";

export const authenticateAccessToken = (req: Request, res: Response, next: NextFunction) => {
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

export const authenticateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            throw new CustomError("Unauthorized: No refresh token provided", 401);
        }
        const decodedToken = verifyRefreshToken(token) as JwtPayload;
        const userToken = await findRefreshToken(decodedToken.user_id);
        if (!userToken) {
            throw new CustomError("Refresh Token not found", 404);
        }
        if (userToken.revoked_at || userToken.expires_at < new Date()) {
            res.clearCookie("refreshToken", cookieOptions);
            throw new CustomError("Refresh Token Invalid or Expired", 401);
        }
        const isTokenValid = await bcrypt.compare(token, userToken.token_hash);
        if (!isTokenValid) {
            res.clearCookie("refreshToken", cookieOptions);
            throw new CustomError("Refresh Token Invalid or Expired", 401);
        }
        req.user = decodedToken;
        next();
    } catch (error: any) {
        if (error instanceof CustomError) {
            next(error);
        } else if (error.name === "TokenExpiredError") {
            res.clearCookie("refreshToken", cookieOptions);
            next(new CustomError("Refresh Token Expired", 401));
        } else if (error.name === "JsonWebTokenError") {
            next(new CustomError("Invalid Refresh Token", 401));
        } else {
            next(new CustomError(error.message || "Refresh Token Verification Failed", 401));
        }
    }
}