"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/modules/user/user.store";
import { useAuthStore } from "@/modules/auth/auth.store";

export function useRouteGuard(isAuth: boolean, redirectPath: string = "/") {
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    useEffect(() => {
        if (!isInitialized) return; //เช็ค การโหลดข้อมูล

        if (isAuth) { // เช็คว่าต้องเป็นผู้ใช้หรือไม่
            if (!user) { // ถ้าไม่มีผู้ใช้
                router.replace(redirectPath); // เปลี่ยนเส้นทาง
            }
        } else { // ถ้าไม่ต้องเป็นผู้ใช้
            if (user) { // ถ้ามีผู้ใช้
                router.replace(redirectPath);
            }
        }
    }, [isInitialized, user, router, redirectPath, isAuth]);

    return {
        isLoading: !isInitialized,
        isRedirecting: isInitialized && ((isAuth && !user) || (!isAuth && user))
    }
}