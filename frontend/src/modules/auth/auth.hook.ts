import * as authServices from "./auth.services";
import { LoginData, RegisterData } from "./auth.type";
import { useAuthStore } from "./auth.store";
import { useProfile } from "../user/user.hook";
import { useUserStore } from "../user/user.store";

export const useLogin = () => {
    const { handleGetProfile } = useProfile();
    const handleLogin = async (data: LoginData) => {
        try {
            const result = await authServices.loginService(data);
            useAuthStore.getState().setToken(result.token);
            await handleGetProfile();
            return result;
        } catch (error: any) {
            throw Error(error?.response?.data?.message || "Login failed");
        }
    }
    return { handleLogin }
}

export const useIsAuth = () => {
    const token = useAuthStore((state) => state.token);
    return token !== "";
}

export const useRegister = () => {
    const handleRegister = async (data: RegisterData) => {
        try {
            const result = await authServices.registerService(data);
            return result;
        } catch (error: any) {
            throw Error(error?.response?.data?.message || "Register failed");
        }
    }
    return { handleRegister }
}

export const useLogout = () => {
    const handleLogout = async () => {
        try {
            await authServices.logoutService();
        } catch (error: any) {
            console.error("Logout API failed, but clearing local session:", error);
        } finally {
            useAuthStore.getState().removeToken();
            useUserStore.getState().clearUser();
        }
    }
    return { handleLogout }
}