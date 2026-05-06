"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Wallet,
    CreditCard,
    QrCode,
    Smartphone,
    CheckCircle2,
    ChevronRight,
    ArrowLeft,
    Zap,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUserStore } from "@/modules/user/user.store";
import { useWalletStore } from "@/modules/wallet/wallet.store";
import { useRouteGuard } from "@/hooks/use-route-guard";
import LoadingSpiner from "@/components/loadingspiner";
import { useTopupWallet } from "@/modules/wallet/wallet.hook";
import { TopupWalletData } from "@/modules/wallet/wallet.types";
import { useWallet } from "@/modules/wallet/wallet.hook";
import { TopupSuccess } from "./components/topup-success";
import { formatPrice } from "@/lib/formatPrice";

const AMOUNTS = [
    { value: 50, bonus: 0, label: "50" },
    { value: 100, bonus: 0, label: "100" },
    { value: 300, bonus: 0, label: "300", popular: true },
    { value: 500, bonus: 0, label: "500" },
    { value: 1000, bonus: 0, label: "1,000" },
];

const METHODS = [
    {
        id: "promptpay",
        name: "PromptPay",
        description: "Scan QR to pay instantly",
        fee: 0,
        icon: QrCode,
        color: "bg-emerald-50 text-emerald-600",
        badgeVariant: "default",
    },
    {
        id: "card",
        name: "Credit / Debit Card",
        description: "Visa, Mastercard",
        fee: 0.015,
        icon: CreditCard,
        color: "bg-blue-50 text-blue-600",
        badgeVariant: "secondary",
    },
    {
        id: "truemoney",
        name: "TrueMoney Wallet",
        description: "Online Wallet",
        fee: 0,
        icon: Smartphone,
        color: "bg-orange-50 text-orange-500",
        badgeVariant: "default",
    },
];

export default function Page() {
    const { handleTopupWallet } = useTopupWallet();
    const { handleGetWallet } = useWallet();
    const { isLoading, isRedirecting } = useRouteGuard(true, "/");
    const { user } = useUserStore();
    const { balance } = useWalletStore();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [selectedMethod, setSelectedMethod] = useState("promptpay");
    const [confirmed, setConfirmed] = useState(false);

    if (isLoading || isRedirecting) {
        return <LoadingSpiner />;
    }

    const currentBalance = balance;
    const selectedData = AMOUNTS.find((a) => a.value === selectedAmount);
    const feecal =
        selectedAmount
            ? Math.round(selectedAmount * METHODS.find((m) => m.id === selectedMethod)?.fee!)
            : 0;
    const totalPay = selectedAmount ? selectedAmount + feecal : 0;


    const totalAmount = selectedAmount
        ? selectedAmount + (selectedData?.bonus ?? 0)
        : 0;

    const handleClickTopup = async () => {
        const fee = METHODS.find((m) => m.id === selectedMethod)?.fee;
        const data = {
            amount: totalAmount,
            fee,
            method: selectedMethod,
        }
        console.log(data)
        const response = await handleTopupWallet(data as TopupWalletData);
        if (response) {
            setConfirmed(true);
            handleGetWallet();
        }
    }

    if (confirmed && selectedAmount) {
        return (
            <TopupSuccess
                balance={balance}
                onReset={() => {
                    setConfirmed(false);
                    setSelectedAmount(null);
                }}
            />
        );
    }

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Button asChild variant="outline" size="icon" className="w-9 h-9 rounded-xl bg-card">
                        <Link href="/"><ArrowLeft className="w-4 h-4" /></Link>
                    </Button>
                    <h1 className="text-lg font-semibold">Top Up</h1>
                </div>

                {/* User + Balance Card */}
                <Card className="border-0 rounded-2xl p-5 mb-6 relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-500 to-blue-400 text-white shadow-md">
                    {/* decorative circle */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 bg-white" />
                    <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full opacity-10 bg-white" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar className="w-10 h-10 border border-white/20 bg-white/20">
                                <AvatarFallback className="bg-transparent text-white">ML</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium text-sm text-white">{user?.name}</div>
                                <div className="text-xs text-white/70">{user?.user_id}</div>
                            </div>
                        </div>

                        <div className="flex items-end gap-1">
                            <Wallet className="w-4 h-4 text-white/70 mb-1" />
                            <span className="text-xs text-white/70 mb-1">Current Balance</span>
                        </div>
                        <div className="text-4xl font-bold mt-0.5 text-white">
                            {formatPrice(currentBalance)}
                        </div>
                        <div className="text-sm text-white/70">Baht</div>
                    </div>
                </Card>

                {/* Amount Selection */}
                <div className="mb-6">
                    <div className="text-xs font-medium uppercase tracking-wider mb-3 text-muted-foreground">
                        Select Amount
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                        {AMOUNTS.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setSelectedAmount(item.value)}
                                className={cn(
                                    "relative rounded-2xl p-4 text-center transition-all duration-200 border bg-card text-card-foreground shadow-sm",
                                    selectedAmount === item.value
                                        ? "border-primary bg-primary/5 scale-[1.02] shadow-md"
                                        : "border-border hover:border-primary/50 hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                {item.popular && (
                                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-2.5 py-0.5 font-semibold">
                                        Popular
                                    </Badge>
                                )}
                                <div
                                    className={cn(
                                        "text-xl font-bold",
                                        selectedAmount === item.value ? "text-primary" : ""
                                    )}
                                >
                                    {item.label}
                                </div>
                                <div className="text-xs mt-0.5 text-muted-foreground">
                                    Baht
                                </div>
                                {item.bonus > 0 && (
                                    <div className="flex items-center justify-center gap-0.5 mt-1.5">
                                        <Zap className="w-2.5 h-2.5 text-emerald-500" />
                                        <span className="text-[10px] font-semibold text-emerald-600">
                                            +{item.bonus} Free
                                        </span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                    <div className="text-xs font-medium uppercase tracking-wider mb-3 text-muted-foreground">
                        Payment Method
                    </div>
                    <div className="flex flex-col gap-2">
                        {METHODS.map((method) => {
                            const Icon = method.icon;
                            const isSelected = selectedMethod === method.id;
                            return (
                                <Card
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={cn(
                                        "cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground shadow-sm overflow-hidden",
                                        isSelected ? "border-primary border-[2px]" : "border border-border"
                                    )}
                                >
                                    <CardContent className="p-3.5 flex items-center gap-3">
                                        <div
                                            className={cn(
                                                "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                                                method.color
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium">
                                                {method.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                {method.description}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <Badge variant={method.fee === 0 ? "outline" : "secondary"} className={cn(
                                                method.fee === 0 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : ""
                                            )}>
                                                {method.fee === 0 ? "Free" : `+${method.fee * 100} %`}
                                            </Badge>
                                            <div
                                                className={cn(
                                                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                                    isSelected ? "border-primary" : "border-border"
                                                )}
                                            >
                                                {isSelected && (
                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Summary */}
                {selectedAmount && (
                    <Card className="mb-5 animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-sm">
                        <CardHeader className="pb-2 pt-4 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Summary
                        </CardHeader>
                        <CardContent className="space-y-2.5 text-sm px-4 pb-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount</span>
                                <span className="font-medium">{formatPrice(selectedAmount)}</span>
                            </div>
                            {(selectedData?.bonus ?? 0) > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Bonus</span>
                                    <span className="font-medium text-emerald-600">+{selectedData?.bonus} Baht</span>
                                </div>
                            )}
                            {feecal > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fee</span>
                                    <span className="font-medium">฿{feecal}</span>
                                </div>
                            )}
                            <Separator className="my-1.5" />
                            <div className="flex justify-between font-semibold">
                                <span>Total Received</span>
                                <span className="text-primary">{formatPrice(totalAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-1">
                                <span className="text-muted-foreground">Total Payment</span>
                                <span className="font-semibold text-base">{formatPrice(totalPay)}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Confirm Button */}
                <Button
                    size="lg"
                    disabled={!selectedAmount}
                    onClick={() => selectedAmount && handleClickTopup()}
                    className="w-full rounded-2xl h-14 text-sm font-semibold shadow-md"
                >
                    {selectedAmount ? (
                        <>
                            Confirm Top Up {formatPrice(totalPay)}
                            <ChevronRight className="w-4 h-4 ml-1.5" />
                        </>
                    ) : (
                        "Please select an amount first"
                    )}
                </Button>

                <p className="text-center text-xs mt-4 text-muted-foreground">
                    Secure System · SSL Encrypted
                </p>
            </div>
        </div>
    );
}
