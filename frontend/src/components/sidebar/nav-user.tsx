"use client"

import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, BadgeCheckIcon, BellIcon, LogOutIcon, LogIn, Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useLogout } from "@/modules/auth/auth.hook";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  } | null
}) {
  const router = useRouter();
  const { isMobile } = useSidebar()
  const { handleLogout } = useLogout();
  const { setTheme, theme } = useTheme()

  const handleLogoutClick = async () => {
    await handleLogout();
    toast("Logout Successful", { position: "bottom-center" })
    router.push("/");
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {!user ? (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-lg bg-sidebar-primary px-4 py-2.5 text-sm font-medium text-sidebar-primary-foreground transition-all hover:bg-sidebar-primary/80 hover:shadow-md hover:shadow-sidebar-primary/20 active:scale-[0.98]"
          >
            <LogIn className="size-4" />
            <span>Sign In</span>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">ML</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">ML</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {theme === "light" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : theme === "dark" ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : (
                      <Monitor className="mr-2 h-4 w-4" />
                    )}
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                        <DropdownMenuRadioItem value="light">
                          <Sun className="mr-2 h-4 w-4" />
                          <span>Light</span>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="dark">
                          <Moon className="mr-2 h-4 w-4" />
                          <span>Dark</span>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="system">
                          <Monitor className="mr-2 h-4 w-4" />
                          <span>System</span>
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheckIcon
                  />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon
                  />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogoutClick}>
                <LogOutIcon
                />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
