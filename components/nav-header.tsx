"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Home, BarChart3, Package, ShoppingCart, ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserMenu } from "@/components/user-menu"

interface NavHeaderProps {
  title: string
  subtitle?: string
}

export function NavHeader({ title, subtitle }: NavHeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Production", href: "/production", icon: Package },
    { name: "Sales", href: "/sales", icon: ShoppingCart },
  ]

  // Determine if we're on a subpage (not home)
  const isSubpage = pathname !== "/"

  return (
    <header className="bg-primary text-primary-foreground px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            {/* Back button for subpages */}
            {isSubpage && (
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-9 w-9 bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 hover:border-primary-foreground/30 md:mr-1"
              >
                <Link href="/">
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Back to home</span>
                </Link>
              </Button>
            )}

            {/* Navigation menu */}
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 hover:border-primary-foreground/30"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {navigation.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={`flex items-center ${pathname === item.href ? "font-medium" : ""}`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                      {pathname === item.href && <span className="ml-auto text-primary text-xs">• current</span>}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1 min-w-0 px-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm opacity-90 truncate max-w-full">{subtitle}</p>}
          </div>

          <div className="ml-2">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

