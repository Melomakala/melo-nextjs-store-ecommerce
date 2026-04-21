import { JwtPayload } from "../common/utils/jwt";
import express from "express";
export { };
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}