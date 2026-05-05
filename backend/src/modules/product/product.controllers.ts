import { Request, Response } from "express";
import * as productService from "./product.services";

export const getProduct = async (req: Request, res: Response) => {
    try {
        const products = await productService.getProductService();
        res.status(200).json({ result: products });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            throw new Error("Product ID is required");
        }
        const product_id = req.params.id as string;
        const product = await productService.getProductByIdService(product_id);
        res.status(200).json({ result: product });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}