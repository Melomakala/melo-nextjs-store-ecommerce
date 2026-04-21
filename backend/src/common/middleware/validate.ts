import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { handleZodError } from "../utils/handleZodError";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!result.success) {
            return next(handleZodError(result.error));
        }

        const data = result.data as { body?: unknown; query?: unknown; params?: unknown };

        if (data.body !== undefined) req.body = data.body;
        if (data.query !== undefined) req.query = data.query as typeof req.query;
        if (data.params !== undefined) req.params = data.params as typeof req.params;

        next();
    };
};