import axiosInstance from "@/lib/axios";
import { TopupWalletData } from "./wallet.types";

export const getWalletService = async () => {
    const response = await axiosInstance.get("/wallet");
    return response.data.result;
}

export const topupWalletService = async (data: TopupWalletData) => {
    const response = await axiosInstance.post("/wallet/topup", data);
    return response.data.result;
}