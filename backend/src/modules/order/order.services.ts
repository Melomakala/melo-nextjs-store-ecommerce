import { CustomError } from "../../common/utils/CustomError";
import * as orderModel from "./order.model";
import * as orderType from "./order.types";
import { deductWalletService } from "../wallet/wallet.services";
import { decrementStock } from "../product/product.services";
import { prisma } from "../../common/utils/prisma";

const createOrder = async (user_id: string, data: orderType.CreateOrderRequest, idempotency_key: string) => {
    const checkIdempotencyKey = await orderModel.findOrderByIdempotencyKey(idempotency_key);
    if (checkIdempotencyKey) {
        throw new CustomError("Idempotency key already exists", 400);
    }
    const product_ids = data.items.map((item) => item.product_id);
    const products = await orderModel.findManyProductById(product_ids);

    //สร้างสารบัญข้อมูล
    const productMap = new Map(products.map((p) => [p.product_id, p]));

    let total_amount = 0;
    const order_items = data.items.map((item) => {

        const product = productMap.get(item.product_id);

        if (!product) {
            throw new CustomError("Product not found", 404);
        }
        if (product.stock !== -1 && product.stock < item.quantity) {
            throw new CustomError("Product stock is not enough", 400);
        }
        total_amount += product.price * item.quantity;
        return {
            product_id: product.product_id,
            quantity: item.quantity,
            price_at_purchase: product.price,
        };
    });

    if (total_amount !== data.total_amount) {
        throw new CustomError("Total price is not matching", 400);
    }

    const order = await orderModel.createOrderModel(user_id, {
        user_id: user_id,
        total_amount: total_amount,
        items: order_items,
        idempotency_key: idempotency_key,
    });

    return order;
}

export const placeOrder = async (user_id: string, data: orderType.CreateOrderRequest, idempotency_key: string) => {
    const order = await createOrder(user_id, data, idempotency_key);
    try {
        await prisma.$transaction(async (tx) => {
            await deductWalletService(order.user_id, {
                total_amount: order.total_amount,
                reference_id: order.order_id,
            },
                tx);
            await decrementStock(
                order.items.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                })),
                tx
            );
            await orderModel.updateOrderModel(order.order_id, orderType.status.COMPLETE, tx);
        })
        return order
    } catch (error) {
        await orderModel.updateOrderModel(order.order_id, orderType.status.CANCEL);
        throw error;
    }
}

