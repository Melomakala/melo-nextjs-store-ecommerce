import { Router } from "express";
import { authenticateAccessToken } from "../../common/middleware/authenticate";
import * as walletController from "./wallet.controllers";
import { validate } from "../../common/middleware/validate";
import * as walletSchema from "./wallet.schema";

const router = Router();

router.get("/wallet", authenticateAccessToken, walletController.getWallet);
router.post("/wallet/topup", authenticateAccessToken, validate(walletSchema.topupSchema), walletController.topupWallet);
router.post("/mockup-topup", walletController.mockupTopupWallet);
export default router;
