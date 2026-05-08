import axiosInstance from "@/lib/axios";
import { OrderRequest } from "./order.types";

export const createOrder = async (payload: OrderRequest, key: string) => {
    try {
        const response = await axiosInstance.post('/place-order', payload, {
            headers: {
                "idempotency-key": key,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}