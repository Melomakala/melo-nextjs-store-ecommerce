import { Router } from "express";
import { authenticateAccessToken } from "../../common/middleware/authenticate";
import * as orderController from "./order.controllers";

const router = Router();

router.post("/place-order", authenticateAccessToken, orderController.placeOrder);

export default router;