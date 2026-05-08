import { prisma } from "../../common/utils/prisma";
import * as walletType from "./wallet.types";
import { Prisma } from "../../../generated/prisma";

export const getWalletModel = async (user_id: string, tx?: Prisma.TransactionClient) => {
    const client = tx || prisma;
    return await client.wallet.findUnique({
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
        status: walletType.status.PENDING
    }
) => {
    const { wallet_id, data, transaction_id, idempotency_key } = payload;
    return await prisma.walletTopup.create({
        data: {
            wallet_id,
            transaction_id,
            idempotency_key,
            amount: data.amount,
            fee: data.fee,
            method: data.method,
            status: walletType.status.PENDING
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

export const findTopupWalletByIdempotencyKey = async (idempotency_key: string) => {
    return await prisma.walletTopup.findUnique({
        where: { idempotency_key },
        select: {
            idempotency_key: true,
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

export const createWalletTransactionModel = async (data: walletType.WalletTransactionRequest, tx?: Prisma.TransactionClient) => {
    const { wallet_id, topup_id, order_id, ...payload } = data;
    const client = tx || prisma;

    return await client.walletTransaction.create({
        data: {
            ...payload,
            wallet: { connect: { wallet_id } },
            ...(data.type === walletType.transactionType.TOPUP && {
                topup: { connect: { topup_id: data.reference_id } }
            }),
            ...(data.type === walletType.transactionType.PAYMENT && {
                order: { connect: { order_id: data.reference_id } }
            })
        } as Prisma.WalletTransactionCreateInput
    });
}


export const incrementWalletModel = async (wallet_id: string, amount: number) => {
    return await prisma.wallet.update({
        where: { wallet_id },
        data: {
            balance: {
                increment: amount,
            },
        }
    });
}

export const decrementWalletModel = async (wallet_id: string, amount: number, tx?: Prisma.TransactionClient) => {
    const client = tx || prisma;
    return await client.wallet.update({
        where: { wallet_id },
        data: {
            balance: {
                decrement: amount,
            },
        }
    });
}
