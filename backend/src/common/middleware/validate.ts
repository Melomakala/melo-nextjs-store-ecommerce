import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { handleZodError } from "../utils/handleZodError";

type RequestSchema = {
    body?: any;
    query?: any;
    params?: any;
};

export const validate = (schema: ZodSchema<RequestSchema>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!result.success) {
            return next(handleZodError(result.error));
        }

        const { body, query, params } = result.data;

        if (body !== undefined) req.body = body;
        if (query !== undefined) req.query = query as any;
        if (params !== undefined) req.params = params as any;

        next();
    };
};