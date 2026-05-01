import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TopupSuccessProps {
    balance: number;
    onReset: () => void;
}

export function TopupSuccess({ balance, onReset }: TopupSuccessProps) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-sm text-center border shadow-sm">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                    <CardTitle className="text-xl">Top Up Successful!</CardTitle>
                    <CardDescription>The balance has been added to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl p-4 bg-muted">
                        <div className="text-sm mb-1 text-muted-foreground">
                            New Balance
                        </div>
                        <div className="text-3xl font-bold text-primary">
                            {balance.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Baht
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        asChild
                        className="w-full h-12 rounded-xl text-sm font-medium"
                        onClick={onReset}
                    >
                        <Link href="/">Back to Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
