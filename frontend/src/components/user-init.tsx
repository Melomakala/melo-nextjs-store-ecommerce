"use client"
import { useEffect, useRef } from "react";
import { useProfile } from "@/modules/user/user.hook";
import { useAuthStore } from "@/modules/auth/auth.store";
import { refreshService } from "@/modules/auth/auth.services";
import { useWallet } from "@/modules/wallet/wallet.hook";
export default function UserInit() {
    const { handleGetProfile } = useProfile();
    const { handleGetWallet } = useWallet();
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

                if (!currentToken) {
                    try {
                        const result = await refreshService();
                        if (result?.token) {
                            setToken(result.token);
                            currentToken = result.token;
                        }
                    } catch (error) {
                        // คิดอยู่ไส่อะไรดี
                        console.log(error);
                    }
                }
                if (currentToken) {
                    await handleGetProfile();
                    await handleGetWallet();
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
