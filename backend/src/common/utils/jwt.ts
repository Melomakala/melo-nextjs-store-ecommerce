import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_ACCESS_SECRET = process.env.ACCESS_JWT_SECRET || "SUPERSECRET"
const JWT_REFRESH_SECRET = process.env.REFRESH_JWT_SECRET || "SUPERSECRETREFRESH"

export interface JwtPayload {
    user_id: string
    email: string
}

export const genAccessToken = (payload: JwtPayload): string => {
    return Jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "1h" })
}

export const genRefreshToken = (payload: JwtPayload): string => {
    return Jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "24h" })
}


export const verifyAccessToken = (token: string): JwtPayload => {
    return Jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload
}

export const verifyRefreshToken = (token: string): JwtPayload => {
    return Jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload
}