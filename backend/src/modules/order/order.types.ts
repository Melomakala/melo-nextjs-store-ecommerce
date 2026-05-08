export interface CreateOrderRequest {
    user_id: string;
    items: {
        product_id: string;
        quantity: number;
        price_at_purchase?: number;
    }[];
    total_amount: number;
    idempotency_key?: string;
}

export interface CreateOrderResponse {
    order_id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    total_amount: number;
}

export enum status {
    PENDING = "PENDING",
    COMPLETE = "COMPLETE",
    CANCEL = "CANCEL",
}
