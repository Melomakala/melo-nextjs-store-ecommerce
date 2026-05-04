import { Router } from "express";
import * as productController from "./product.controllers";

const router = Router();

router.get("/product", productController.getProduct);
export default router;
