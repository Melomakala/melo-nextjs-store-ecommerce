import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        items: z.array(z.object({
            product_id: z.string().uuid({ message: "Invalid product_id format" }),
            quantity: z.number().int().positive({ message: "Quantity must be a positive integer" }),
        })).min(1, { message: "Order must have at least one item" }),
        total_amount: z.number().positive({ message: "Total amount must be a positive number" }),
    }),
    headers: z.object({
        "idempotency-key": z.string().uuid(),
    })
});

export const getOrderHistorySchema = z.object({
    query: z.object({
        page: z.string().optional(),
        search: z.string().optional(),
        status: z.string().optional(),
        timeRange: z.string().optional(),
    }),
});
