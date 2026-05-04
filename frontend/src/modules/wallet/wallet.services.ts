import axiosInstance from "@/lib/axios";
import { TopupWalletData } from "./wallet.types";

export const getWalletService = async () => {
    const response = await axiosInstance.get("/wallet");
    return response.data.result;
}

export const topupWalletService = async (data: TopupWalletData, key: string) => {
    const response = await axiosInstance.post("/wallet/topup", data, {
        headers: {
            "idempotency-key": key,
        }
    });
    return response.data.result;
}