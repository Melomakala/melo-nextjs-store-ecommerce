import { prisma } from "../../common/utils/prisma";
import * as walletType from "./wallet.types";

export const getWalletModel = async (user_id: string) => {
    return await prisma.wallet.findUnique({
        where: { user_id },
        select: {
            wallet_id: true,
            balance: true,
        }
    });
}

export const getWalletByWalletIdModel = async (wallet_id: string) => {
    return await prisma.wallet.findUnique({
        where: { wallet_id },
        select: {
            wallet_id: true,
            balance: true,
        }
    });
}

export const topupWalletModel = async (
    payload: {
        wallet_id: string,
        data: walletType.TopupWalletRequest,
        transaction_id: string | null,
        idempotency_key: string,
        status: walletType.status
    }
) => {
    const { wallet_id, data, transaction_id, idempotency_key, status } = payload;
    return await prisma.walletTopup.create({
        data: {
            wallet_id,
            transaction_id,
            idempotency_key,
            amount: data.amount,
            fee: data.fee,
            method: data.method,
            status,
        },
        select: {
            topup_id: true,
            wallet_id: true,
            amount: true,
            fee: true,
            method: true,
            status: true,
        }
    });
}

export const findTopupWalletModel = async (topup_id: string) => {
    return await prisma.walletTopup.findUnique({
        where: { topup_id },
        select: {
            idempotency_key: true,
            topup_id: true,
            wallet_id: true,
            amount: true,
            fee: true,
            method: true,
            status: true,
        }
    });
}

export const updateTopupWalletModel = async (topup_id: string, status: walletType.status) => {
    return await prisma.walletTopup.update({
        where: { topup_id },
        data: {
            status: status,
        },
        select: {
            topup_id: true,
            wallet_id: true,
            amount: true,
            status: true,
        }
    });
}

export const createWalletTransactionModel = async (data: walletType.WalletTransactionRequest) => {
    return await prisma.walletTransaction.create({
        data: {
            wallet_id: data.wallet_id,
            amount: data.amount,
            type: data.type,
            balance_before: data.balance_before,
            balance_after: data.balance_after,
            reference_id: data.reference_id,

            topup: {
                connect: {
                    topup_id: data.reference_id,
                }
            }
        },
    });
}

export const updateWalletModel = async (wallet_id: string, amount: number) => {
    return await prisma.wallet.update({
        where: { wallet_id },
        data: {
            balance: {
                decrement: amount,
            },
        }
    });
}