"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { ShoppingCart, Zap } from "lucide-react"
import { useProductStore } from "@/modules/product/product.store";
import { useProduct } from "@/modules/product/product.hook";
import { useEffect } from "react";
import Link from "next/link";

function formatPrice(price: number) {
  return `฿${price.toLocaleString()}`
}

export function ProductGrid() {
  const { getProducts } = useProduct();

  useEffect(() => {
    getProducts();
  }, []);
  const { products } = useProductStore();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Products</h2>
        <span className="text-sm text-muted-foreground">{products.length} items</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.product_id}
            className="group relative overflow-hidden border-border/40 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          >
            {/* Tag Badge */}
            {/* {product.tag && (
              <div className="absolute top-3 left-3 z-10">
                <Badge
                  variant={product.tag === "Sale" ? "destructive" : "default"}
                  className={
                    product.tag === "Hot"
                      ? "bg-orange-500/90 text-white hover:bg-orange-500"
                      : product.tag === "New"
                        ? "bg-emerald-500/90 text-white hover:bg-emerald-500"
                        : ""
                  }
                >
                  {product.tag === "Hot" && <Zap className="mr-1 size-3" />}
                  {product.tag}
                </Badge>
              </div>
            )} */}

            {/* Out of stock overlay */}
            {product.stock === 0 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                <Badge variant="secondary" className="text-sm">
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Product Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <CardContent className="p-4">
              {/* Product Info */}
              <div className="mb-3">
                <h3 className="font-semibold leading-tight">{product.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {/* original price */}
                {/* {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )} */}
              </div>

              {/* Buy Button */}
              <Link href={`/product/${product.product_id}`}>
                <Button
                  size="lg"
                  disabled={product.stock === 0}
                  className="w-full font-medium transition-all cursor-pointer"
                >
                  <ShoppingCart className="mr-2 size-4" />
                  {product.stock === 0 ? "Unavailable" : "Buy Now"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
