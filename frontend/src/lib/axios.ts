import axios from "axios";
import { getAccessToken, removeAccessToken, setAccessToken } from "@/modules/auth/auth.store";

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
        const token = getAccessToken();
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
    async (error) => {
        // จัดการ Error ทั่วไป เช่น 401 Unauthorized
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axios.post("http://localhost:5000/api/auth/refresh", {}, {
                    withCredentials: true
                });
                const { token } = response.data.result;
                setAccessToken(token);
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            } catch {
                removeAccessToken();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
