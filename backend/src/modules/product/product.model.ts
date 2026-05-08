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

export const decrementStockModel = async (product_id: string, quantity: number, tx?: Prisma.TransactionClient) => {
    const client = tx || prisma;
    return await client.product.update({
        where: {
            product_id: product_id,
        },
        data: {
            stock: {
                decrement: quantity,
            },
        },
    });
};