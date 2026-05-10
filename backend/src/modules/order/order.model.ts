import { prisma } from "../../common/utils/prisma";
import * as orderType from "./order.types";
import { Prisma } from "../../../generated/prisma";

export type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>;

export const createOrderModel = async (user_id: string, data: orderType.CreateOrderRequest): Promise<OrderWithItems> => {
    const order = await prisma.order.create({
        data: {
            user_id: user_id,
            total_amount: data.total_amount,
            status: orderType.status.PENDING,
            idempotency_key: data.idempotency_key ?? null,
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
    return order as OrderWithItems;
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

export const findOrderByIdempotencyKey = async (idempotency_key: string) => {
    return await prisma.order.findUnique({
        where: {
            idempotency_key,
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


export const getOrderHistoryModel = async (user_id: string, query: orderType.OrderHistoryModelQuery) => {
    const { skip, take, search, status, timeRange } = query;
    const where: Prisma.OrderWhereInput = {
        user_id,
        ...(status && { status: status as string }),
        ...(timeRange && { created_at: timeRange }),
        ...(search && {
            OR: [
                {
                    order_id: {
                        contains: search,
                    },
                },
                {
                    items: {
                        some: {
                            product: {
                                name: {
                                    contains: search,
                                },
                            },
                        },
                    },
                },
            ],
        }),
    };

    const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take,
            orderBy: {
                created_at: "desc",
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                product_id: true,
                                name: true,
                                image_url: true,
                            }
                        }
                    },
                },
            },
        }),
        prisma.order.count({
            where,
        }),
    ]);
    return { orders, totalCount };
};