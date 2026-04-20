import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        logger.error(err.message, { stack: err.stack });
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    logger.error(err.message, { stack: err.stack });
    return res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
    });
};