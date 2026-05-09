import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/modules/product/product.types";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
    isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product: Product) => {
                const items = get().items;
                const existing = items.find(
                    (item) => item.product.product_id === product.product_id
                );
                if (existing) return; // already in cart, digital product = 1 each
                set({ items: [...items, { product, quantity: 1 }] });
            },

            removeItem: (productId: string) => {
                set({
                    items: get().items.filter(
                        (item) => item.product.product_id !== productId
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                return get().items.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                );
            },

            getItemCount: () => get().items.length,

            isInCart: (productId: string) => {
                return get().items.some(
                    (item) => item.product.product_id === productId
                );
            },
        }),
        {
            name: "melo-cart",
        }
    )
);
