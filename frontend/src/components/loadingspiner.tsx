import { Loader2 } from "lucide-react";

export default function LoadingSpiner() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-5">
                <div className="relative">
                    <Loader2 className="h-14 w-14 animate-spin text-primary opacity-20" />
                    <Loader2 className="h-14 w-14 animate-spin text-primary absolute inset-0 [animation-duration:1.5s]" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-3xl font-black tracking-tight bg-gradient-to-br from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent">
                        MELO STORE
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:0s]" />
                        <div className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                        <div className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60 ml-1">
                            Loading
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

