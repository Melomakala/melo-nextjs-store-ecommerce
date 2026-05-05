import { prisma } from "../../common/utils/prisma";
import * as productType from "./product.types";

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
