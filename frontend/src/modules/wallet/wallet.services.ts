import axiosInstance from "@/lib/axios";

export const getWalletService = async () => {
    const response = await axiosInstance.get("/wallet");
    return response.data.result;
}