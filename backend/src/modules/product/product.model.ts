import { prisma } from "../../common/utils/prisma";
import * as productType from "./product.types";
import { Prisma } from "../../../generated/prisma";

export const getProductModel = async (): Promise<productType.Product[]> => {
    return await prisma.product.findMany({
        where: {
            is_active: true,
        },
        select: {
            product_id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            image_url: true,
        },
    });
}

export const getProductByIdModel = async (product_id: string): Promise<productType.Product | null> => {
    return await prisma.product.findUnique({
        where: {
            product_id: product_id,
            is_active: true,
        },
        select: {
            product_id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            image_url: true,
        },
    });
}

export const findManyProductById = async (product_ids: string[], tx?: Prisma.TransactionClient) => {
    const client = tx || prisma;
    return await client.product.findMany({
        where: {
            product_id: {
                in: product_ids,
            },
        },
        select: {
            product_id: true,
            stock: true,
        },
    });
};

export const decrementStockModel = async (product_id: string, quantity: number, stock: number, tx?: Prisma.TransactionClient) => {
    const client = tx || prisma;
    const isUnlimitedStock = stock === -1;

    // Unlimited stock (-1) → ไม่ต้องหัก stock ในฐานข้อมูล
    if (isUnlimitedStock) {
        return { count: 1 };
    }

    const result = await client.product.updateMany({
        where: {
            product_id: product_id,
            stock: { gte: quantity },
        },
        data: {
            stock: {
                decrement: quantity,
            },
        },
    });

    if (result.count === 0) {
        throw new Error("Insufficient stock or product not found");
    }

    return result;
};