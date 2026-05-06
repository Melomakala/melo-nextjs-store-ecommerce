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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BuyProductDialog } from "./components/buy-product-dialog"
import {
    ShoppingCart,
    CreditCard,
    Package,
    Zap,
    Shield,
    Headphones,
    Loader2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, use } from "react"
import { useProductById } from "@/modules/product/product.hook"
import * as ProductType from "@/modules/product/product.types"
import { useRouter } from "next/navigation"
import LoadingSpiner from "@/components/loadingspiner"
import { useUserStore } from "@/modules/user/user.store"
import { formatPrice } from "@/lib/formatPrice"

type Props = {
    params: Promise<{
        id: string
    }>
}

export default function ProductDetailPage({ params }: Props) {
    const { id } = use(params)
    const router = useRouter()
    const { user } = useUserStore()
    const { getProductById } = useProductById()
    const [product, setProduct] = useState<ProductType.Product | null>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id)
            if (!data) {
                router.push("/")
                return
            }
            setProduct(data)
        }
        fetchProduct()
    }, [id, router])

    const [dialogOpen, setDialogOpen] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)

    // TODO: เมื่อมี hook จริง สามารถนำมาเรียกใช้ที่นี่ หรือส่งไปให้ BuyProductDialog โดยตรง
    const handleConfirmPurchase = async () => {
        // Mock logic สำหรับในอนาคตที่ต้องต่อ API
        await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    function handleAddToCart() {
        if (addedToCart) return
        setAddedToCart(true)
        // TODO: ต่อ Cart API / Zustand store จริง
        setTimeout(() => setAddedToCart(false), 2000)
    }

    if (!product) {
        return (
            <LoadingSpiner />
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* ── Header ── */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40">
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
                                    <BreadcrumbPage>{product.name}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                {/* ── Main Content ── */}
                <div className="flex flex-1 flex-col gap-6 p-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1fr_420px]">

                        {/* ── Left: Product Image ── */}
                        <Card className="overflow-hidden border-border/40 bg-card/50">
                            <div className="relative aspect-[4/3]">
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                                {/* Badges */}
                                {/* <div className="absolute left-3 top-3 z-10">
                                    {product.tag && (
                                        <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                                            {product.tag}
                                        </Badge>
                                    )}
                                </div> */}
                                <div className="absolute right-3 top-3 z-10">
                                    {product.stock > 0 || product.stock === -1 ? (
                                        <Badge
                                            variant="secondary"
                                            className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                        >
                                            In Stock
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">Out of Stock</Badge>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* ── Right: Product Info ── */}
                        <div className="flex flex-col gap-4">
                            {/* Name */}
                            <div>
                                <h1 className="text-2xl font-bold leading-tight tracking-tight">
                                    {product.name}
                                </h1>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-blue-500">
                                    {formatPrice(product.price)}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {product.description}
                            </p>

                            <Separator className="border-border/40" />

                            {/* Details */}
                            <div className="flex flex-col gap-2.5">
                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="size-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Stock:</span>
                                    {product.stock > 0 ? (
                                        <span className="font-medium">
                                            {product.stock.toLocaleString()} available
                                        </span>
                                    ) : product.stock === -1 ? (
                                        <span className="font-medium">Unlimited</span>
                                    ) : (
                                        <span className="font-medium">Out of Stock</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Zap className="size-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Delivery:</span>
                                    <span className="font-medium">Instant Digital Code</span>
                                </div>
                            </div>

                            <Separator className="border-border/40" />

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                                <Button
                                    size="lg"
                                    disabled={product.stock === 0 || !user}
                                    className="w-full bg-blue-600 font-semibold text-white hover:bg-blue-700 cursor-pointer"
                                    onClick={() => setDialogOpen(true)}
                                >
                                    <CreditCard className="mr-2 size-5" />
                                    Buy Now
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    disabled={product.stock === 0 || !user}
                                    className={`w-full font-semibold transition-all duration-300 cursor-pointer ${addedToCart
                                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10"
                                        : "border-border/60 hover:border-blue-500/60 hover:bg-blue-500/5 hover:text-blue-400"
                                        }`}
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart
                                        className={`mr-2 size-5 transition-colors duration-300 ${addedToCart ? "text-emerald-400" : ""
                                            }`}
                                    />
                                    {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-around rounded-lg border border-border/40 bg-card/30 px-4 py-3">
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <Zap className="size-4 text-blue-500" />
                                    <span className="text-[11px] text-muted-foreground">
                                        Instant Delivery
                                    </span>
                                </div>
                                <Separator orientation="vertical" className="h-8" />
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <Shield className="size-4 text-blue-500" />
                                    <span className="text-[11px] text-muted-foreground">
                                        Secure Payment
                                    </span>
                                </div>
                                <Separator orientation="vertical" className="h-8" />
                                <div className="flex flex-col items-center gap-1 text-center">
                                    <Headphones className="size-4 text-blue-500" />
                                    <span className="text-[11px] text-muted-foreground">
                                        24/7 Support
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Buy Confirmation Dialog ── */}
                {user && (
                    <BuyProductDialog
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                        product={product}
                        onConfirm={handleConfirmPurchase}
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    )
}
