import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { handleZodError } from "../utils/handleZodError";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            Object.assign(req, parsed);
            next();
        } catch (error) {
            next(handleZodError(error as ZodError));
        }
    };
};