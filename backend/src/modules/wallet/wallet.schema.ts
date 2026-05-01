import { z } from "zod";

export const topupSchema = z.object({
    body: z.object({
        amount: z.number().refine((val) => [50, 100, 300, 500, 1000].includes(val), {
            message: "Invalid amount",
        }),
        fee: z.number().refine((val) => [0, 5, 10, 20, 50].includes(val), {
            message: "Invalid fee",
        }),
        method: z.string().refine((val) => ["promptpay", "card", "truemoney"].includes(val), {
            message: "Invalid method",
        }),
    })
});