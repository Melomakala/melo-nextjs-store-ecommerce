import * as productType from "./product.types";
import { CustomError } from "../../common/utils/CustomError";
import * as productModel from "./product.model";
import { fromCents } from "../../common/utils/formatcent";
import { Prisma } from "../../../generated/prisma";

export const getProductService = async (): Promise<productType.Product[]> => {
    const product = await productModel.getProductModel();
    if (!product) {
        throw new CustomError("Product not found", 404);
    }
    return product.map((item) => ({
        ...item,
        price: fromCents(item.price),
    }));
}

export const getProductByIdService = async (product_id: string): Promise<productType.Product> => {
    const product = await productModel.getProductByIdModel(product_id);
    if (!product) {
        throw new CustomError("Product not found", 404);
    }
    return {
        ...product,
        price: fromCents(product.price),
    };
}


export const decrementStock = async (items: productType.StockDecrementItem[], tx?: Prisma.TransactionClient) => {
    if (items.length === 0) return;

    // 1. ดึงข้อมูลสินค้าทั้งหมดในครั้งเดียว
    const productIds = items.map((item) => item.product_id);
    const products = await productModel.findManyProductById(productIds, tx);

    // 2. สร้าง Map เพื่อ lookup O(1) แทน find() ใน loop
    const productMap = new Map(
        products.map((p) => [p.product_id, p])
    );

    // 3. ตรวจสอบ stock ทุกรายการก่อนหักจริง (fail fast)
    for (const item of items) {
        const product = productMap.get(item.product_id);

        if (!product) {
            throw new CustomError(`Product "${item.product_id}" not found`, 404);
        }

        const isUnlimitedStock = product.stock === -1;
        if (!isUnlimitedStock && product.stock < item.quantity) {
            throw new CustomError(
                `Insufficient stock for product "${item.product_id}" (available: ${product.stock}, requested: ${item.quantity})`,
                400
            );
        }
    }

    // 4. หัก stock ทั้งหมดพร้อมกัน (ผ่าน validation แล้ว)
    await Promise.all(
        items.map((item) => {
            const product = productMap.get(item.product_id)!;
            return productModel.decrementStockModel(item.product_id, item.quantity, product.stock, tx);
        })
    );
}