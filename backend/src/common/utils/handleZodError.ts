import { ZodError } from "zod";
import { CustomError } from "./CustomError";

export const handleZodError = (error: ZodError) => {
    const formatted = error.format();

    return new CustomError(
        "Validatation Error",
        400,
        formatted
    )
}