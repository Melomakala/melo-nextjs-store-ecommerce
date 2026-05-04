import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { handleZodError } from "../utils/handleZodError";

type RequestSchema = {
    body?: any;
    query?: any;
    params?: any;
    headers?: any
};

export const validate = (schema: ZodSchema<RequestSchema>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
            headers: req.headers,
        });

        if (!result.success) {
            return next(handleZodError(result.error));
        }

        const { body, query, params, headers } = result.data;

        if (body !== undefined) req.body = body;
        if (query !== undefined) req.query = query as any;
        if (params !== undefined) req.params = params as any;
        if (headers !== undefined) req.headers = headers as any;

        next();
    };
};