import axiosInstance from "@/lib/axios";
import { Product } from "./product.types";

const IMAGE_BASE_URL = "http://localhost:5000/uploads";

export const getProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/products')
    const products = response.data.result
    return products.map((product: Product) => ({
        ...product,
        image_url: `${IMAGE_BASE_URL}${product.image_url}`
    }))
}

export const getProductById = async (product_id: string): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${product_id}`)
    const product = response.data.result
    return {
        ...product,
        image_url: `${IMAGE_BASE_URL}${product.image_url}`
    }
}