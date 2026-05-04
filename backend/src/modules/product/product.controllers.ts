import { Request, Response } from "express";
import * as productService from "./product.services";

export const getProduct = async (req: Request, res: Response) => {
    try {
        const product = await productService.getProductService();
        res.status(200).json({ data: product });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}