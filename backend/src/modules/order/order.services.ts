import { CustomError } from "../../common/utils/CustomError";
import * as orderModel from "./order.model";
import * as orderType from "./order.types";
import { deductWalletService } from "../wallet/wallet.services";
import { prisma } from "../../common/utils/prisma";

const createOrder = async (user_id: string, data: orderType.CreateOrderRequest) => {
    const product_ids = data.items.map((item) => item.product_id);
    const products = await orderModel.findManyProductById(product_ids);

    let total_amount = 0;
    const order_items = data.items.map((item) => {
        const product = products.find((product) => product.product_id === item.product_id);
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
    });

    return order;
}

export const placeOrder = async (user_id: string, data: orderType.CreateOrderRequest) => {
    const order = await createOrder(user_id, data);
    try {
        const deductWallet = await deductWalletService(order.user_id, {
            total_amount: order.total_amount,
            reference_id: order.order_id,
        });
        // update stock เดี๋ยวมาทำ
        await orderModel.updateOrderModel(order.order_id, orderType.status.COMPLETE);
        return order
    } catch (error) {
        await orderModel.updateOrderModel(order.order_id, orderType.status.CANCEL);
        throw error;
    }
}

