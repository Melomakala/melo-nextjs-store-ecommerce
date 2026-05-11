import axiosInstance from "@/lib/axios";
import { OrderRequest, GetOrderHistoryRequest, GetOrderHistoryResponse, Order, OrderItem } from "./order.types";

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

const IMAGE_BASE_URL = "http://localhost:5000/uploads";

export const getOrderHistory = async (params: GetOrderHistoryRequest): Promise<GetOrderHistoryResponse> => {
    try {
        const response = await axiosInstance.get('/orderhistory', {
            params: params
        });

        const { orders, pagination } = response.data;

        const processedOrders = orders.map((order: Order) => ({
            ...order,
            items: order.items.map((item: OrderItem) => ({
                ...item,
                product: {
                    ...item.product,
                    image_url: item.product.image_url
                        ? `${IMAGE_BASE_URL}${item.product.image_url}`
                        : null
                }
            }))
        }));


        return {
            data: processedOrders,
            meta: {
                total: pagination.totalCount,
                page: Number(pagination.page),
                last_page: pagination.totalPages,
                totalAmount: pagination.totalAmount,
                totalCompleteCount: pagination.totalCompleteCount,
            }
        };
    } catch (error) {
        throw error;
    }
}
