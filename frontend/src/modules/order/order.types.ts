export interface OrderRequest {
    items: {
        product_id: string;
        quantity: number;
        price: number;
    }[];
    total_amount: number;
}

export interface GetOrderHistoryRequest {
    page: string | number;
    search?: string;
    status?: string;
    timeRange?: string;
}

export interface OrderItem {
    product_id: string;
    quantity: number;
    price_at_purchase: number;
    product: {
        product_id: string;
        name: string;
        image_url: string | null;
    }
}

export interface Order {
    order_id: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: OrderItem[];
}

export interface GetOrderHistoryResponse {
    data: Order[];
    meta: {
        total: number;
        totalOrder: number;
        page: number;
        last_page: number;
        totalAmount: number;
        totalCompleteCount: number;
    }
}
