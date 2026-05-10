import { Router } from "express";
import { authenticateAccessToken } from "../../common/middleware/authenticate";
import { validate } from "../../common/middleware/validate";
import { createOrderSchema } from "./order.schema";
import * as orderController from "./order.controllers";

const router = Router();

router.post("/place-order", authenticateAccessToken, validate(createOrderSchema), orderController.placeOrder);
router.get("/orderhistory", authenticateAccessToken, orderController.getOrderHistory);
export default router;