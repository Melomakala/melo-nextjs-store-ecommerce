"use client"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ShoppingCart,
    CreditCard,
    Trash2,
    Zap,
    Shield,
    Headphones,
    Package,
    AlertCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/modules/cart/cart.store"
import { useAuthStore } from "@/modules/auth/auth.store"
import { useUserStore } from "@/modules/user/user.store"
import { useCreateOrder } from "@/modules/order/order.hook"
import { useWallet } from "@/modules/wallet/wallet.hook"
import { formatPrice } from "@/lib/formatPrice"
import LoadingSpiner from "@/components/loadingspiner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CheckoutDialog } from "./components/checkout-dialog"
import { BuySuccess } from "../product/[id]/components/buy-success"

export default function CartPage() {
    const isInitialized = useAuthStore((state) => state.isInitialized)
    const { user } = useUserStore()
    const { items, removeItem, clearCart, getTotal } = useCartStore()
    const { handleCreateOrder } = useCreateOrder()
    const { handleGetWallet } = useWallet()
    const [isLoading, setIsLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmed, setConfirmed] = useState(false)
    const [orderId, setOrderId] = useState("")
    const [confirmedDetails, setConfirmedDetails] = useState<{ total: number, name: string } | null>(null)
    const router = useRouter()

    if (!isInitialized) {
        return <LoadingSpiner />
    }

    const total = getTotal()
    const hasStock = items.every((item) => item.product.stock > 0 || item.product.stock === -1)
    const handleCheckout = async () => {
        if (!user) {
            router.push("/login")
            return
        }
        if (items.length === 0) return

        setIsLoading(true)
        try {
            await handleGetWallet()
            setDialogOpen(true)
        } catch (error: any) {
            toast.error("Failed to update wallet balance")
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirmCheckout = async () => {
        try {
            const currentTotal = total
            const currentName = items.length === 1 ? items[0].product.name : "Shopping Cart"

            const orderItems = items.map((item) => ({
                product_id: item.product.product_id,
                quantity: item.quantity,
                price: item.product.price,
            }))

            const order = await handleCreateOrder({ items: orderItems })
            setOrderId(order.order_id)
            setConfirmedDetails({ total: currentTotal, name: currentName })
            clearCart()
            setConfirmed(true)
        } catch (error: any) {
            toast.error(error?.message || "Failed to place order")
            throw error
        }
    }

    if (confirmed && confirmedDetails) {
        return (
            <BuySuccess
                order_id={orderId}
                product_name={confirmedDetails.name}
                total_amount={confirmedDetails.total}
            />
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* ── Header ── */}
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/">Store</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                {/* ── Main Content ── */}
                <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
                    {/* Hero */}
                    <div className="rounded-xl border border-border/40 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-6">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Shopping Cart
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Review your items before checkout.
                        </p>
                    </div>

                    {/* Empty State */}
                    {items.length === 0 ? (
                        <Card className="border-border/40 bg-card/50">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted/50">
                                    <ShoppingCart className="size-8 text-muted-foreground" />
                                </div>
                                <h2 className="text-lg font-semibold">Your cart is empty</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Browse our store and add some items to your cart.
                                </p>
                                <Link href="/">
                                    <Button className="mt-6 cursor-pointer" size="lg">
                                        <ShoppingCart className="mr-2 size-4" />
                                        Browse Store
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Cart Content */
                        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                            {/* ── Left: Cart Items ── */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">
                                        Cart Items
                                    </h2>
                                    <Badge variant="secondary" className="text-xs">
                                        {items.length} {items.length === 1 ? "item" : "items"}
                                    </Badge>
                                </div>

                                {items.map((item) => (
                                    <Card
                                        key={item.product.product_id}
                                        className="group overflow-hidden border-border/40 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 border-l-2 border-l-blue-500"
                                    >
                                        <CardContent className="p-0">
                                            <div className="flex gap-4 p-4">
                                                {/* Product Image */}
                                                <Link
                                                    href={`/product/${item.product.product_id}`}
                                                    className="relative block size-24 shrink-0 overflow-hidden rounded-lg bg-muted/30"
                                                >
                                                    <Image
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    {/* Badge on image */}
                                                    {(item.product.stock !== -1 && item.product.stock <= 0) && (
                                                        <div className="absolute top-1 right-1">
                                                            <Badge
                                                                variant="secondary"
                                                            >
                                                                Out of Stock
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* Product Info */}
                                                <div className="flex flex-1 flex-col justify-between min-w-0">
                                                    <div>
                                                        <Link
                                                            href={`/product/${item.product.product_id}`}
                                                            className="font-semibold leading-tight hover:text-blue-500 transition-colors"
                                                        >
                                                            {item.product.name}
                                                        </Link>
                                                        <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                                                            <Package className="size-3" />
                                                            {item.product.description}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                        <Zap className="size-3 text-blue-500" />
                                                        <span>Instant Digital Code</span>
                                                    </div>
                                                </div>

                                                {/* Price & Remove */}
                                                <div className="flex flex-col items-end justify-between shrink-0">
                                                    <span className="text-lg font-bold text-blue-500">
                                                        {formatPrice(item.product.price)}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
                                                        onClick={() => removeItem(item.product.product_id)}
                                                    >
                                                        <Trash2 className="mr-1 size-3.5" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* ── Right: Order Summary ── */}
                            <div className="lg:sticky lg:top-4 h-fit">
                                <Card className="border-border/40 bg-card/50">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold">
                                            Order Summary
                                        </h3>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {items.length} {items.length === 1 ? "item" : "items"}
                                        </p>

                                        <Separator className="my-4 border-border/40" />

                                        {/* Pricing */}
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span className="font-medium">{formatPrice(total)}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Delivery</span>
                                                <span className="font-medium text-emerald-500">Free</span>
                                            </div>
                                        </div>

                                        <Separator className="my-4 border-border/40" />

                                        {/* Total */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold">Total</span>
                                            <span className="text-xl font-bold text-blue-500">
                                                {formatPrice(total)}
                                            </span>
                                        </div>
                                        {!hasStock && (
                                            <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 flex items-start gap-2">
                                                <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                                                <p className="text-[11px] font-medium text-destructive leading-tight">
                                                    Some items in your cart are out of stock. Please remove them before checking out.
                                                </p>
                                            </div>
                                        )}
                                        {/* Checkout Button */}
                                        <Button
                                            size="lg"
                                            disabled={items.length === 0 || isLoading || !user || !hasStock}
                                            className="mt-6 w-full bg-blue-600 font-semibold text-white hover:bg-blue-700 cursor-pointer"
                                            onClick={handleCheckout}
                                        >
                                            {isLoading ? (
                                                <>Processing...</>
                                            ) : !hasStock ? (
                                                <>
                                                    <CreditCard className="mr-2 size-5" />
                                                    Out of Stock
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className="mr-2 size-5" />
                                                    Proceed to Checkout
                                                </>
                                            )}
                                        </Button>

                                        {!user && (
                                            <p className="mt-2 text-center text-xs text-muted-foreground">
                                                Please{" "}
                                                <Link href="/login" className="text-blue-500 hover:underline">
                                                    sign in
                                                </Link>{" "}
                                                to checkout
                                            </p>
                                        )}

                                        <Link href="/" className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                                            ← Continue Shopping
                                        </Link>

                                        {/* Trust Badges */}
                                        <Separator className="my-4 border-border/40" />
                                        <div className="flex items-center justify-around text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <Zap className="size-4 text-blue-500" />
                                                <span className="text-[11px] text-muted-foreground">Instant</span>
                                            </div>
                                            <Separator orientation="vertical" className="h-8" />
                                            <div className="flex flex-col items-center gap-1">
                                                <Shield className="size-4 text-blue-500" />
                                                <span className="text-[11px] text-muted-foreground">Secure</span>
                                            </div>
                                            <Separator orientation="vertical" className="h-8" />
                                            <div className="flex flex-col items-center gap-1">
                                                <Headphones className="size-4 text-blue-500" />
                                                <span className="text-[11px] text-muted-foreground">24/7</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </SidebarInset>

            {/* ── Checkout Confirmation Dialog ── */}
            {user && (
                <CheckoutDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    items={items}
                    total={total}
                    onConfirm={handleConfirmCheckout}
                />
            )}
        </SidebarProvider>
    )
}
