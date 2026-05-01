import { Request, Response } from "express";
import logger from "../../common/utils/logger";
import { CustomError } from "../../common/utils/CustomError";
import * as walletServices from "./wallet.services";

export const getWallet = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new CustomError("User not found", 404);
    }
    const wallet = await walletServices.getWalletService(req.user.user_id);
    res.status(200).json({
        message: "Wallet", result: {
            balance: wallet.balance
        }
    });
    logger.info("Wallet", {
        meta: {
            user_id: req.user?.user_id,
            service: "wallet-get",
            method: req.method,
            url: req.url,
        }
    })
}