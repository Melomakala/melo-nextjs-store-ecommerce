export interface Product {
    product_id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    image_url: string | null;
}

export interface StockDecrementItem {
    product_id: string;
    quantity: number;
    stock?: number;
}