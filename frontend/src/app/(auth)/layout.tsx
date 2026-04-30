"use client"
import { useRouteGuard } from "@/hooks/use-route-guard";
import LoadingSpiner from "@/components/loadingspiner";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isLoading, isRedirecting } = useRouteGuard()

    if (isLoading || isRedirecting) {
        return <LoadingSpiner />
    }

    return (
        <section>
            {children}
        </section>
    );
}