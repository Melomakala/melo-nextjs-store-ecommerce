export interface OrderRequest {
    items: {
        product_id: string;
        quantity: number;
        price: number;
    }[];
    total_amount: number;
}