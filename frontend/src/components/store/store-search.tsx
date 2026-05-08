"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function StoreSearch() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
      <Input
        type="text"
        placeholder="Search product..."
        className="h-10 pl-10 bg-muted/30 border-border/40 focus:bg-background transition-colors"
      />
    </div>
  )
}
