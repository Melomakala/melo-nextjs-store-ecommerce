import axiosInstance from "@/lib/axios";
import { user } from "./user.type";

export const getProfileService = async (): Promise<user> => {
    const response = await axiosInstance.get("/user/profile");
    return response.data.result;
}