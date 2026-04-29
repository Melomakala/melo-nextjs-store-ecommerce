import * as authServices from "./auth.services";
import { LoginData, RegisterData } from "./auth.type";
import { setAccessToken } from "./auth.store";
import { useProfile } from "../user/user.hook";

export const useLogin = () => {
    const { handleGetProfile } = useProfile();
    const handleLogin = async (data: LoginData) => {
        try {
            const response = await authServices.loginService(data);
            setAccessToken(response.data.token);
            await handleGetProfile();
            return response.data;
        } catch (error: any) {
            throw Error(error?.response?.data?.message || "Login failed");
        }
    }
    return { handleLogin }
}

export const useRegister = () => {
    const handleRegister = async (data: RegisterData) => {
        try {
            const response = await authServices.registerService(data);
            return response.data;
        } catch (error: any) {
            throw Error(error?.response?.data?.message || "Register failed");
        }
    }
    return { handleRegister }
}