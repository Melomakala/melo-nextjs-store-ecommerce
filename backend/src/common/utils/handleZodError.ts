import { ZodError } from "zod";
import { CustomError } from "./CustomError";

export const handleZodError = (error: ZodError) => {
    const formattedErrors: Record<string, string> = {};

    error.issues.forEach((issue) => {
        const path = issue.path.length > 1
            ? issue.path.slice(1).join(".")
            : issue.path.join(".");

        formattedErrors[path] = issue.message;
    });

    return new CustomError(
        "Validation Error",
        400,
        formattedErrors
    );
}
