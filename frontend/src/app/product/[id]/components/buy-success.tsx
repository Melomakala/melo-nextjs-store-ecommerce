import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

interface BuySuccessProps {
    order_id: string;
    total_amount: number;
    product_name: string;
}

export function BuySuccess({ order_id, total_amount, product_name }: BuySuccessProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 animate-in fade-in zoom-in duration-300">
            <Card className="w-full max-w-sm text-center border shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                    <CardTitle className="text-xl">Purchase Successful!</CardTitle>
                    <CardDescription>Thank you for your order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-xl p-4 bg-muted/50 border border-border/40">
                        <div className="text-xs mb-1 text-muted-foreground uppercase font-semibold tracking-wider">
                            Order ID
                        </div>
                        <div className="text-sm font-mono text-primary break-all">
                            {order_id}
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center text-muted-foreground">
                            <span>Product</span>
                            <span className="text-foreground font-medium">{product_name}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                            <span>Total Paid</span>
                            <span className="text-blue-500 font-bold">{formatPrice(total_amount)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button
                        asChild
                        className="w-full h-11 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Link href="/">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Continue Shopping
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className="w-full h-11 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        <Link href="/orderhistory">View Order History</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
