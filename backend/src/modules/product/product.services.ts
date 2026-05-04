import * as productType from "./product.types";
import { CustomError } from "../../common/utils/CustomError";
import * as productModel from "./product.model";

export const getProductService = async (): Promise<productType.Product[]> => {
    const product = await productModel.getProductModel();
    if (!product) {
        throw new CustomError("Product not found", 404);
    }
    return product;
}