import { prisma } from "../../common/utils/prisma";
import * as orderType from "./order.types";
import { Prisma } from "../../../generated/prisma";

export const createOrderModel = async (user_id: orderType.CreateOrderRequest["user_id"], data: orderType.CreateOrderRequest) => {
    return await prisma.order.create({
        data: {
            user_id: user_id,
            total_amount: data.total_amount,
            status: orderType.status.PENDING,
            items: {
                create: data.items.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price_at_purchase: item.price_at_purchase || 0,
                })),
            },
        },
        include: {
            items: true,
        },
    });
};

export const findManyProductById = async (product_ids: string[]) => {
    return await prisma.product.findMany({
        where: {
            product_id: {
                in: product_ids,
            },
        },
    });
};

export const findOrderById = async (order_id: string) => {
    return await prisma.order.findUnique({
        where: {
            order_id,
        },
    });
};

export const updateOrderModel = async (order_id: string, status: orderType.status, tx?: Prisma.TransactionClient) => {
    const client = tx || prisma;
    return await client.order.update({
        where: {
            order_id,
        },
        data: {
            status,
        },
    });
};
