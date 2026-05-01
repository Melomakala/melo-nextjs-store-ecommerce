import { Router } from "express";
import { authenticateAccessToken } from "../../common/middleware/authenticate";
import * as walletController from "./wallet.controllers";

const router = Router();

router.get("/wallet", authenticateAccessToken, walletController.getWallet);

export default router;
