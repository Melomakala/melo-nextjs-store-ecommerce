import * as productServices from "./product.services";
import { useProductStore } from "./product.store";

export const useProduct = () => {
    const { setProducts } = useProductStore();

    const getProducts = async () => {
        try {
            const products = await productServices.getProducts();
            setProducts(products);
        } catch (error: any) {
            throw Error(error?.response?.data?.message || "Failed to get products");
        }
    };

    return { getProducts };
};