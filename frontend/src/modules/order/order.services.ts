import axiosInstance from "@/lib/axios";

export const createOrder = async (orderData: any) => {
    try {
        const response = await axiosInstance.post('/order', orderData);
        return response.data;
    } catch (error) {
        throw error;
    }
}