"use client"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Image from "next/image"
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
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Package, Wallet, CheckCircle, Search, ListFilter, ChevronDown, ChevronUp, Clock } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useRouteGuard } from "@/hooks/use-route-guard"
import LoadingSpiner from "@/components/loadingspiner"
import { useGetOrderHistory } from "@/modules/order/order.hook"
import { GetOrderHistoryResponse, Order, OrderItem } from "@/modules/order/order.types"
import { useDebounce } from "@/hooks/use-debounce"
import { useOrderHistoryStore } from "@/modules/order/order.store"



export default function OrderHistoryPage() {
    const { handleGetOrderHistory } = useGetOrderHistory();
    const { orders, meta, } = useOrderHistoryStore();
    const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [timeRange, setTimeRange] = useState<string>("");
    const { isLoading: isAuthLoading, isRedirecting } = useRouteGuard(true, "/");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        if (isRedirecting) return;

        const fetchOrders = async () => {
            try {
                await handleGetOrderHistory({
                    page: currentPage,
                    search: debouncedSearchQuery,
                    status: statusFilter === "All" ? "" : statusFilter,
                    timeRange: timeRange
                });
            } catch (err: any) {
                console.error("Fetch orders failed:", err);
            }
        };

        fetchOrders();
    }, [currentPage, debouncedSearchQuery, statusFilter, timeRange, handleGetOrderHistory, isRedirecting]);

    const itemsPerPage = 4;

    if (isAuthLoading || isRedirecting) {
        return <LoadingSpiner />;
    }

    const toggleOrder = (id: string) => {
        setExpandedOrders(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]);
    };

    const totalPages = meta?.last_page || 1;
    const totalCount = meta?.total || 0;

    // Calculate showing range
    const startIdx = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endIdx = Math.min(currentPage * itemsPerPage, totalCount);

    // Get current page items
    const currentOrders = orders;

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
                            className="mr-2 h-4 data-[orientation=vertical]:h-4"
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
                                    <BreadcrumbPage>Order History</BreadcrumbPage>
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
                            Order History
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            View all your past purchases and transaction details.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders by ID or product name..."
                                className="bg-card/50 pl-9 w-full"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset to page 1 on search
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="bg-card/50 whitespace-nowrap min-w-[140px] justify-between">
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4" />
                                            All time
                                        </div>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px]">
                                    <DropdownMenuLabel>Time Range</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {["", "thisMonth", "last3Months", "lastYear"].map((range) => (
                                        <DropdownMenuItem
                                            key={range}
                                            onClick={() => {
                                                setTimeRange(range);
                                                setCurrentPage(1);
                                            }}
                                            className={timeRange === range ? "bg-accent" : ""}
                                        >
                                            {range === "" ?
                                                "All Time"
                                                : range === "thisMonth" ?
                                                    "This Month"
                                                    : range === "last3Months" ?
                                                        "Last 3 Months"
                                                        : range === "lastYear" ?
                                                            "Last Year"
                                                            : ""
                                            }
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="bg-card/50 min-w-[160px] justify-between">
                                        <div className="flex items-center">
                                            <ListFilter className="mr-2 h-4 w-4" />
                                            <span>{statusFilter === 'All' ? 'Filter status' : statusFilter}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px]">
                                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {["All", "COMPLETE", "PENDING", "CANCEL"].map((status) => (
                                        <DropdownMenuItem
                                            key={status}
                                            onClick={() => {
                                                setStatusFilter(status);
                                                setCurrentPage(1);
                                            }}
                                            className={statusFilter === status ? "bg-accent" : ""}
                                        >
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-border/40 bg-card/50 shadow-sm transition-all hover:shadow-md">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10">
                                    <Package className="size-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
                                    <h2 className="text-2xl font-bold">{meta?.totalOrder || 0}</h2>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/40 bg-card/50 shadow-sm transition-all hover:shadow-md">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                                    <Wallet className="size-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                                    <h2 className="text-2xl font-bold">
                                        ฿{meta?.totalAmount || 0}
                                    </h2>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/40 bg-card/50 shadow-sm transition-all hover:shadow-md">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-orange-500/10">
                                    <CheckCircle className="size-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Completed</p>
                                    <h2 className="text-2xl font-bold">{meta?.totalCompleteCount || 0}</h2>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order List */}
                    <div className="flex flex-col gap-4">
                        {currentOrders.length > 0 ? (
                            currentOrders.map((order: Order) => {
                                const isExpanded = expandedOrders.includes(order.order_id);

                                return (
                                    <Card
                                        key={order.order_id}
                                        className={`group border-border/40 bg-card/50 shadow-sm overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 border-l-2 ${order.status === 'COMPLETE' || order.status === 'Completed' ? 'border-l-emerald-500' : order.status === 'PENDING' || order.status === 'Pending' ? 'border-l-orange-500' : 'border-l-rose-500'}`}
                                    >
                                        {/* Order Header */}
                                        <div
                                            className="p-6 pb-4 cursor-pointer hover:bg-muted/10 transition-colors"
                                            onClick={() => toggleOrder(order.order_id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{order.order_id}</h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {new Date(order.created_at).toLocaleDateString()} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-sm">฿{(order.total_amount / 100).toLocaleString()}</span>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`
                                                    ${order.status === 'COMPLETE' || order.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25' : ''}
                                                    ${order.status === 'PENDING' || order.status === 'Pending' ? 'bg-orange-500/15 text-orange-700 dark:text-orange-400 hover:bg-orange-500/25' : ''}
                                                    ${order.status === 'CANCELLED' || order.status === 'Cancelled' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 hover:bg-rose-500/25' : ''}
                                                `}
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 pointer-events-none data-[state=open]:rotate-180 transition-transform">
                                                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items Details */}
                                        {order.items && isExpanded && (
                                            <>
                                                <Separator />
                                                <div className="p-6 bg-muted/30">
                                                    <div className="grid grid-cols-[1fr_80px_80px] gap-4 text-xs font-medium text-muted-foreground mb-4">
                                                        <div>Item</div>
                                                        <div className="text-right">Qty</div>
                                                        <div className="text-right">Price</div>
                                                    </div>

                                                    <div className="flex flex-col gap-4">
                                                        {order.items.map((item: OrderItem, idx: number) => (
                                                            <div key={`${order.order_id}-item-${item.product_id || idx}`} className="grid grid-cols-[1fr_80px_80px] gap-4 items-center">
                                                                <div className="flex gap-4 items-center">
                                                                    <div className={`relative size-10 rounded-md bg-blue-500/20 shrink-0 overflow-hidden flex items-center justify-center`}>
                                                                        {item.product?.image_url && (
                                                                            <Image
                                                                                src={item.product.image_url}
                                                                                alt={item.product?.name || "Product"}
                                                                                fill
                                                                                className="object-cover"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-sm leading-tight">{item.product?.name || "Unknown Product"}</p>
                                                                        <p className="text-xs text-muted-foreground mt-0.5">{item.product_id}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right text-sm text-muted-foreground">
                                                                    ×{item.quantity}
                                                                </div>
                                                                <div className="text-right font-medium text-sm">
                                                                    ฿{item.price_at_purchase / 100}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="p-4 px-6 bg-muted/30 flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Order total</span>
                                                    <span className="font-semibold">฿{(order.total_amount / 100).toLocaleString()}</span>
                                                </div>
                                            </>
                                        )}
                                    </Card>
                                )
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-card/30 rounded-xl border border-dashed border-border/60">
                                <Search className="size-12 mb-4 opacity-20" />
                                <p>No orders found matching your search.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pb-10 border-t border-border/10 pt-6">
                        <span className="text-sm text-muted-foreground order-2 sm:order-1">
                            Showing <span className="font-medium text-foreground">{startIdx}</span> to <span className="font-medium text-foreground">{endIdx}</span> of <span className="font-medium text-foreground">{totalCount}</span> orders
                        </span>
                        <div className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-card hover:bg-accent disabled:opacity-50"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .map((page, i, array) => {
                                        const prevPage = array[i - 1];
                                        const showEllipsis = prevPage && page - prevPage > 1;

                                        return (
                                            <div key={page} className="flex items-center gap-1">
                                                {showEllipsis && <span className="text-muted-foreground px-1">...</span>}
                                                <Button
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    className={`w-9 ${currentPage === page ? "shadow-sm shadow-primary/20" : "bg-card hover:bg-accent"}`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </Button>
                                            </div>
                                        );
                                    })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-card hover:bg-accent disabled:opacity-50"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
