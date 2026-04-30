"use client"

import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Store, Home, ShoppingCart, CreditCard, Package, Wallet } from "lucide-react"
import { useUserStore } from "@/modules/user/user.store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore();

  const data = {
    profile: user ? {
      name: user?.name,
      email: user?.email,
      avatar: "/avatars/shadcn.jpg",
    } : null,
    navMain: [
      {
        title: "Store",
        url: "/",
        icon: <Home />,
        isActive: true,
      },
      {
        title: "Shopping Cart",
        url: "/cart",
        icon: <ShoppingCart />,
      },
      {
        title: "Top Up",
        url: "/topup",
        icon: <CreditCard />,
      },
      {
        title: "Order History",
        url: "/orders",
        icon: <Package />,
      },
    ],
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Melo Store</span>
                  <span className="truncate text-xs">Game Top-Up</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Balance Card */}
        <SidebarGroup className="py-0">
          <SidebarGroupLabel>Wallet</SidebarGroupLabel>
          <div className="mx-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
              <Wallet className="size-3.5" />
              <span>Balance</span>
            </div>
            <p className="mt-1 text-lg font-bold tracking-tight text-sidebar-foreground">
              ฿1,250.00
            </p>
            <a
              href="/topup"
              className="mt-2 flex items-center justify-center rounded-md bg-sidebar-primary px-3 py-1.5 text-xs font-medium text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary/80"
            >
              <CreditCard className="mr-1.5 size-3" />
              Top Up
            </a>
          </div>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.profile} />
      </SidebarFooter>
    </Sidebar>
  )
}
