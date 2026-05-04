import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useUserStore } from "@/modules/user/user.store";

interface CustomRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}


const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: จัดการข้อมูลก่อนส่ง Request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: จัดการข้อมูลหลังจากได้รับ Response
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        // จัดการ Error ทั่วไป เช่น 401 Unauthorized
        const originalRequest = error.config as CustomRequestConfig;
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/refresh") && !originalRequest.url?.includes("/auth/logout")) {
            originalRequest._retry = true;
            try {
                const response = await axios.post("http://localhost:5000/api/auth/refresh", {}, {
                    withCredentials: true
                });
                const { token } = response.data.result;
                useAuthStore.getState().setToken(token);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                useAuthStore.getState().setIsInitialized(true)
                return axiosInstance(originalRequest);
            } catch {
                useAuthStore.getState().removeToken();
                useUserStore.getState().clearUser();
                useAuthStore.getState().setIsInitialized(false);
                window.location.href = "/";
                return Promise.reject(error);
            } finally {
                useAuthStore.getState().setIsInitialized(true)
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
