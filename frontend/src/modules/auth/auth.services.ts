import axiosInstance from "@/lib/axios";
import { LoginData, RegisterData } from "./auth.type";

export const registerService = async (data: RegisterData) => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data.result;
}

export const loginService = async (data: LoginData) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data.result;
}

export const logoutService = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
}

export const refreshService = async () => {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data.result;
}
