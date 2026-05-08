import { createOrder } from "./order.services";
import { useIdempotencyKeyStore } from "@/lib/idempotencykey";
import { OrderRequest } from "./order.types";
import { useWallet } from "../wallet/wallet.hook";

export const useCreateOrder = () => {
    const idempotencyKeyStore = useIdempotencyKeyStore();
    const { handleGetWallet } = useWallet();
    const handleCreateOrder = async (orderData: Omit<OrderRequest, "total_amount">) => {
        try {
            const total_amount = orderData.items.reduce(
                (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
                0
            );

            const payload: OrderRequest = {
                items: orderData.items,
                total_amount,
            };
            const key = idempotencyKeyStore.createKey();
            const order = await createOrder(payload, key);
            if (order) {
                await handleGetWallet()
            }
            idempotencyKeyStore.clearKey();
            return order;
        } catch (error: any) {
            idempotencyKeyStore.clearKey();
            throw Error(error?.response?.data?.message || "Failed to create order");
        }
    };
    return { handleCreateOrder };
};