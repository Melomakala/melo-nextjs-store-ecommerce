"use client"
import { useEffect, useRef } from "react";
import { useProfile } from "@/modules/user/user.hook";
import { useAuthStore } from "@/modules/auth/auth.store";
import { refreshService } from "@/modules/auth/auth.services";

export default function UserInit() {
    const { handleGetProfile } = useProfile();
    const token = useAuthStore((state) => state.token);
    const setToken = useAuthStore((state) => state.setToken);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const setIsInitialized = useAuthStore((state) => state.setIsInitialized);
    const inited = useRef(false);

    useEffect(() => {
        // ป้องกันการทำงานซ้ำ
        if (isInitialized || inited.current) return;
        inited.current = true;

        const init = async () => {
            try {
                let currentToken = token;

                // 1. เช็ค Refresh Token ถ้ายังไม่มี Access Token
                if (!currentToken) {
                    try {
                        const result = await refreshService();
                        if (result?.token) {
                            setToken(result.token);
                            currentToken = result.token;
                        }
                    } catch (error) {
                        // ไม่มี session - ไม่เป็นไร
                    }
                }

                // 2. ดึง Profile ถ้ามี Token
                if (currentToken) {
                    await handleGetProfile();
                }
            } catch (error) {
                console.error("UserInit Error:", error);
            } finally {
                setIsInitialized(true)
            }
        };
        init();
    }, []);
    return null;
}
