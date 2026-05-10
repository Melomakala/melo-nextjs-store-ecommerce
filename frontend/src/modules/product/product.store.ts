import { create } from "zustand";
import { Product } from "./product.types";

interface ProductStore {
    products: Product[];
    setProducts: (products: Product[]) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    searchQuery: "",
    setSearchQuery: (searchQuery) => set({ searchQuery }),
}));