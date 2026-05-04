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