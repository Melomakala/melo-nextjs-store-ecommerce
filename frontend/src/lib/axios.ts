import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: จัดการข้อมูลก่อนส่ง Request
axiosInstance.interceptors.request.use(
    (config) => {
        // สามารถใส่ Logic สำหรับดึง Token มาใส่ Header ได้ที่นี่
        // const token = localStorage.getItem("access_token");
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
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
        if (error.response?.status === 401) {
            console.error("Unauthorized! Redirecting to login...");
            // ตัวอย่าง: ล้าง Token หรือ Redirect ไปหน้า Login
            // window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
