import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ProductGrid } from "@/components/store/product-grid"
import { StoreSearch } from "@/components/store/store-search"

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
                  <BreadcrumbPage>Store</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          {/* Hero / Welcome */}
          <div className="rounded-xl border border-border/40 bg-gradient-to-br from-primary/5 via-transparent to-transparent p-6">
            <h1 className="text-2xl font-bold tracking-tight">
              Game Top-Up Store
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and purchase game cards instantly. Fast delivery, best prices.
            </p>
          </div>

          {/* Search */}
          <StoreSearch />

          {/* Product Grid */}
          <ProductGrid />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
