import { Router } from "express";
import * as productController from "./product.controllers";
import { validate } from "../../common/middleware/validate";
import { getProductByIdSchema } from "./product.schema";

const router = Router();

router.get("/products", productController.getProduct);
router.get("/products/:id", validate(getProductByIdSchema), productController.getProductById);

export default router;
