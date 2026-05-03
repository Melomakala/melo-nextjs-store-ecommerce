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

export const topupWallet = async (req: Request, res: Response) => {
    if (!req.user || !req.body) {
        throw new CustomError("User not found", 404);
    }
    const walletTopup = await walletServices.topupWalletService(req.user.user_id, req.body);
    res.status(200).json({
        message: "Wallet", result: {
            topup_id: walletTopup.topup_id,
            status: walletTopup.status,
        }
    });
    logger.info("Wallet", {
        meta: {
            user_id: req.user?.user_id,
            service: "wallet-topup",
            method: req.method,
            url: req.url,
        }
    })
}

export const mockupTopupWallet = async (req: Request, res: Response) => {
    const { topup_id, status } = req.body;
    const result = await walletServices.mockupTopupWalletService(topup_id, status);
    res.status(200).json({
        message: "Wallet", result: result
    });
    logger.info("Wallet", {
        meta: {
            user_id: req.user?.user_id,
            service: "wallet-topup-mockup",
            method: req.method,
            url: req.url,
        }
    })
}