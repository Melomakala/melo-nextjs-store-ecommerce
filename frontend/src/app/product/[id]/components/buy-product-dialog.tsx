"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Wallet,
    ShoppingCart,
    ArrowDown,
    Info,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useWalletStore } from "@/modules/wallet/wallet.store"
import * as ProductType from "@/modules/product/product.types"
import { formatPrice } from "@/lib/formatPrice"

interface BuyProductDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: ProductType.Product
    onConfirm?: () => Promise<{ order_id: string } | null | void> | void
}

export function BuyProductDialog({
    open,
    onOpenChange,
    product,
    onConfirm
}: BuyProductDialogProps) {
    const { balance } = useWalletStore()
    const [isConfirming, setIsConfirming] = useState(false)

    const afterPurchase = balance - product.price
    const canAfford = balance >= product.price

    const handleConfirm = async () => {
        setIsConfirming(true)
        try {
            if (onConfirm) {
                await onConfirm()
            }
            onOpenChange(false)
        } catch (error) {
            console.error("Purchase failed:", error)
        } finally {
            setIsConfirming(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Purchase</DialogTitle>
                </DialogHeader>

                <Separator />

                {/* Product Row */}
                <div className="flex items-center gap-3 py-1">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border/40 bg-muted/30">
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                        <p className="text-sm font-semibold leading-tight">
                            {product.name}
                        </p>
                    </div>
                    <span className="text-sm font-bold text-blue-500">
                        {formatPrice(product.price)}
                    </span>
                </div>

                <Separator />

                {/* Wallet Section */}
                <div className="flex flex-col gap-2 py-1">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Wallet className="size-4" />
                            <span>Current Balance</span>
                        </div>
                        <span className="font-semibold">
                            {formatPrice(balance)}
                        </span>
                    </div>

                    <div className="flex justify-center">
                        <ArrowDown className="size-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <ShoppingCart className="size-4" />
                            <span>After Purchase</span>
                        </div>
                        <span
                            className={`font-semibold ${canAfford ? "text-emerald-400" : "text-red-400"}`}
                        >
                            {formatPrice(afterPurchase)}
                        </span>
                    </div>
                </div>

                <Separator />

                {/* Info Box */}
                <div className="flex items-start gap-2 rounded-md border border-blue-500/20 bg-blue-500/5 p-3 text-sm text-muted-foreground">
                    <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
                    <p>
                        This purchase is non-refundable. The digital code will be
                        delivered instantly after confirming your purchase.
                    </p>
                </div>

                {!canAfford && (
                    <p className="text-center text-xs text-red-400">
                        Insufficient balance.{" "}
                        <Link href="/topup" className="underline">
                            Top up now
                        </Link>
                    </p>
                )}

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => onOpenChange(false)}
                        disabled={isConfirming}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 bg-blue-600 font-semibold text-white hover:bg-blue-700"
                        onClick={handleConfirm}
                        disabled={!canAfford || isConfirming}
                    >
                        {isConfirming ? "Processing..." : "Confirm Purchase"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
