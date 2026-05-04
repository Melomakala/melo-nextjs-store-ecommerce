import { z } from "zod";

export const topupSchema = z.object({
    body: z.object({
        amount: z.number().refine((val) => [50, 100, 300, 500, 1000].includes(val), {
            message: "Invalid amount",
        }),
        fee: z.number().refine((val) => [0, 0.015, 0.02, 0.03].includes(val), {
            message: "Invalid fee",
        }),
        method: z.enum(["promptpay", "card", "truemoney"]),
    }),
    headers: z.object({
        "idempotency-key": z.string().uuid(),
    })
})