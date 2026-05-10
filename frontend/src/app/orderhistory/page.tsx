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
import { useState } from "react"
import { useRouteGuard } from "@/hooks/use-route-guard"
import LoadingSpiner from "@/components/loadingspiner"

const MOCK_ORDERS = [
    {
        id: "ORD-00115",
        date: "9 May 2026",
        itemsCount: 3,
        total: 547,
        status: "Completed",
        items: [
            {
                name: "Free Fire Diamonds",
                description: "520 Diamonds",
                qty: 1,
                price: 149,
                color: "bg-[#1d2238]",
            },
            {
                name: "Steam Wallet",
                description: "฿250 THB Code",
                qty: 1,
                price: 250.5,
                color: "bg-[#1b2838]",
            },
            {
                name: "Roblox Gift Card",
                description: "400 Robux",
                qty: 1,
                price: 199,
                color: "bg-[#3e2c4f]",
            },
        ],
    },
    {
        id: "ORD-00109",
        date: "2 May 2026",
        itemsCount: 2,
        total: 398,
        status: "Completed",
        items: [
            {
                name: "Roblox Gift Card",
                description: "400 Robux",
                qty: 2,
                price: 199,
                color: "bg-[#3e2c4f]",
            }
        ],
    },
    {
        id: "ORD-00107",
        date: "28 Apr 2026",
        itemsCount: 1,
        total: 220,
        status: "Pending",
        items: [
            {
                name: "Steam Wallet",
                description: "฿200 THB Code",
                qty: 1,
                price: 220,
                color: "bg-[#1b2838]",
            }
        ],
    },
    {
        id: "ORD-00105",
        date: "20 Apr 2026",
        itemsCount: 1,
        total: 349,
        status: "Cancelled",
        items: [
            {
                name: "Free Fire Diamonds",
                description: "1080 Diamonds",
                qty: 1,
                price: 349,
                color: "bg-[#1d2238]",
            }
        ],
    },
    {
        id: "ORD-00102",
        date: "15 Mar 2026",
        itemsCount: 2,
        total: 800,
        status: "Completed",
        items: [
            {
                name: "PlayStation Store",
                description: "฿800 Card",
                qty: 1,
                price: 800,
                color: "bg-[#003791]",
            }
        ],
    },
    {
        id: "ORD-00098",
        date: "10 Mar 2026",
        itemsCount: 1,
        total: 150,
        status: "Completed",
        items: [
            {
                name: "Netflix Gift Card",
                description: "Basic Plan",
                qty: 1,
                price: 150,
                color: "bg-[#e50914]",
            }
        ],
    },
    {
        id: "ORD-00095",
        date: "1 Mar 2026",
        itemsCount: 1,
        total: 500,
        status: "Completed",
        items: [
            {
                name: "Riot Points",
                description: "League of Legends",
                qty: 1,
                price: 500,
                color: "bg-[#eb0029]",
            }
        ],
    },
    {
        id: "ORD-00090",
        date: "15 Feb 2026",
        itemsCount: 3,
        total: 1250,
        status: "Completed",
        items: [
            {
                name: "Amazon Gift Card",
                description: "$10 USD",
                qty: 3,
                price: 416.66,
                color: "bg-[#232f3e]",
            }
        ],
    },
]

export default function OrderHistoryPage() {
    const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const { isLoading, isRedirecting } = useRouteGuard(true, "/");

    const itemsPerPage = 4;

    if (isLoading || isRedirecting) {
        return <LoadingSpiner />;
    }

    const toggleOrder = (id: string) => {
        setExpandedOrders(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]);
    };

    // Filter Logic
    const filteredOrders = MOCK_ORDERS.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / itemsPerPage);

    // Calculate showing range
    const startIdx = totalOrders === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endIdx = Math.min(currentPage * itemsPerPage, totalOrders);

    // Get current page items
    const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                                    <DropdownMenuItem>All time</DropdownMenuItem>
                                    <DropdownMenuItem>This Month</DropdownMenuItem>
                                    <DropdownMenuItem>Last 3 Months</DropdownMenuItem>
                                    <DropdownMenuItem>Last Year</DropdownMenuItem>
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
                                    {["All", "Completed", "Pending", "Cancelled"].map((status) => (
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
                                    <h2 className="text-2xl font-bold">{MOCK_ORDERS.length}</h2>
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
                                    <h2 className="text-2xl font-bold">฿{MOCK_ORDERS.reduce((acc, o) => acc + o.total, 0).toLocaleString()}</h2>
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
                                    <h2 className="text-2xl font-bold">{MOCK_ORDERS.filter(o => o.status === 'Completed').length}</h2>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order List */}
                    <div className="flex flex-col gap-4">
                        {currentOrders.length > 0 ? (
                            currentOrders.map((order) => {
                                const isExpanded = expandedOrders.includes(order.id);

                                return (
                                    <Card
                                        key={order.id}
                                        className={`group border-border/40 bg-card/50 shadow-sm overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 border-l-2 ${order.status === 'Completed' ? 'border-l-emerald-500' : order.status === 'Pending' ? 'border-l-orange-500' : 'border-l-rose-500'}`}
                                    >
                                        {/* Order Header */}
                                        <div
                                            className="p-6 pb-4 cursor-pointer hover:bg-muted/10 transition-colors"
                                            onClick={() => toggleOrder(order.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{order.id}</h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {order.date} • {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-sm">฿{order.total}</span>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`
                                                    ${order.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25' : ''}
                                                    ${order.status === 'Pending' ? 'bg-orange-500/15 text-orange-700 dark:text-orange-400 hover:bg-orange-500/25' : ''}
                                                    ${order.status === 'Cancelled' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 hover:bg-rose-500/25' : ''}
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
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="grid grid-cols-[1fr_80px_80px] gap-4 items-center">
                                                                <div className="flex gap-4 items-center">
                                                                    <div className={`size-10 rounded-md ${item.color} shrink-0`} />
                                                                    <div>
                                                                        <p className="font-medium text-sm leading-tight">{item.name}</p>
                                                                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right text-sm text-muted-foreground">
                                                                    ×{item.qty}
                                                                </div>
                                                                <div className="text-right font-medium text-sm">
                                                                    ฿{item.price}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="p-4 px-6 bg-muted/30 flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Order total</span>
                                                    <span className="font-semibold">฿{order.total}</span>
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
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-muted-foreground">
                            Showing {startIdx} to {endIdx} of {totalOrders} orders
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-card disabled:opacity-50"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>

                            {[...Array(totalPages)].map((_, i) => (
                                <Button
                                    key={i + 1}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    size="sm"
                                    className={`w-9 ${currentPage === i + 1 ? "" : "bg-card"}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-card disabled:opacity-50"
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
