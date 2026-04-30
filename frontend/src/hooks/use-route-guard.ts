"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/modules/user/user.store";
import { useAuthStore } from "@/modules/auth/auth.store";

export function useRouteGuard(redirectPath: string = "/") {
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    useEffect(() => {
        if (isInitialized && user) {
            router.replace(redirectPath);
        }
    }, [isInitialized, user, router, redirectPath]);

    return { 
        isLoading: !isInitialized, 
        isRedirecting: isInitialized && !!user 
    };
}
