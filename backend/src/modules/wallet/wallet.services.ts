import { CustomError } from "../../common/utils/CustomError";
import * as walletModel from "./wallet.models";
import { fromCents } from "../../common/utils/formatcent";
import * as walletType from "./wallet.types";
import { toCents } from "../../common/utils/formatcent";

export const getWalletService = async (user_id: string) => {
    const wallet = await walletModel.getWalletModel(user_id);
    if (!wallet) {
        throw new CustomError("Wallet not found", 404);
    }
    wallet.balance = fromCents(wallet.balance);
    return wallet;
}

export const topupWalletService = async (user_id: string, data: walletType.TopupWalletRequest): Promise<walletType.TopupWalletResponse> => {
    const wallet = await walletModel.getWalletModel(user_id);
    if (!wallet) {
        throw new CustomError("Wallet not found", 404);
    }
    if (data.fee !== 0) {
        data.fee = data.amount * data.fee;
    }
    data.amount = toCents(data.amount);
    data.fee = toCents(data.fee);
    const topup = await walletModel.topupWalletModel(wallet.wallet_id, data, null, walletType.status.PENDING)


    //  ยิง mockup ปลอม
    // MOCKTOPUP.service.ts
    await fetch("http://localhost:5000/api/mockup-topup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            topup_id: topup.topup_id,
            status: topup.status
        })
    });

    return {
        topup_id: topup.topup_id,
        status: topup.status as walletType.status,
    };
}

export const mockupTopupWalletService = async (topup_id: string, status: walletType.status): Promise<string> => {
    const tx = await walletModel.findTopupWalletModel(topup_id);
    if (!tx) {
        throw new CustomError("Transaction not found", 404);
    }
    if (tx.status !== walletType.status.PENDING) {
        throw new CustomError("Transaction already processed", 400);
    }
    const topup = await walletModel.updateTopupWalletModel(tx.topup_id, walletType.status.SUCCESS);
    if (topup.status === walletType.status.SUCCESS) {
        const wallet = await walletModel.getWalletByWalletIdModel(tx.wallet_id);
        if (!wallet) {
            throw new CustomError("Wallet not found", 404);
        }
        await walletModel.updateWalletModel(tx.wallet_id, wallet.balance + tx.amount);
        const transaction = await walletModel.createWalletTransactionModel({
            wallet_id: tx.wallet_id,
            amount: tx.amount,
            type: walletType.transactionType.TOPUP,
            balance_before: wallet.balance,
            balance_after: wallet.balance + tx.amount,
            reference_id: tx.topup_id,
        });
    }
    return "Payment-Success";
}