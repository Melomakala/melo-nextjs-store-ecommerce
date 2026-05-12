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

        if (body !== undefined) {
            Object.defineProperty(req, 'body', { value: body, writable: true, configurable: true, enumerable: true });
        }
        if (query !== undefined) {
            Object.defineProperty(req, 'query', { value: query, writable: true, configurable: true, enumerable: true });
        }
        if (params !== undefined) {
            Object.defineProperty(req, 'params', { value: params, writable: true, configurable: true, enumerable: true });
        }
        if (headers !== undefined) {
            Object.defineProperty(req, 'headers', { value: headers, writable: true, configurable: true, enumerable: true });
        }

        next();
    };
};