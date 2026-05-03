export interface TopupWalletRequest {
    amount: number;
    fee: number;
    method: string;
    idempotency_key: string;
}

export enum status {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

export interface TopupWalletResponse {
    topup_id: string;
    status: status;
}

export enum transactionType {
    TOPUP = "TOPUP",
    ORDER = "ORDER",
}

export interface WalletTransactionRequest {
    wallet_id: string;
    amount: number;
    type: transactionType;
    balance_before: number;
    balance_after: number;
    reference_id: string;
}