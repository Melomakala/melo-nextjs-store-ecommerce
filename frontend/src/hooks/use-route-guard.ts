"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/modules/user/user.store";

export function useRouteGuard(redirectPath: string = "/") {
    const router = useRouter();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (user) {
            router.replace(redirectPath);
        }
    }, [user, router, redirectPath]);

    return { user, isRedirecting: !!user };
}
