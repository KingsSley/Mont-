"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoginModal } from "@/components/login-modal"
import { DataManagement } from "@/components/data-management"
import { UserIcon, LogOutIcon, LogInIcon, ShieldIcon, DatabaseIcon } from "lucide-react"

export function UserMenu() {
  const { isAuthenticated, userRole, logout } = useAuth()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [dataManagementOpen, setDataManagementOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 hover:border-primary-foreground/30"
          >
            <UserIcon className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>
            {isAuthenticated ? (
              <div className="flex items-center">
                <ShieldIcon className="h-4 w-4 mr-2" />
                Admin
              </div>
            ) : (
              "Guest User"
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setDataManagementOpen(true)}>
            <DatabaseIcon className="h-4 w-4 mr-2" />
            Data Management
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {isAuthenticated ? (
            <DropdownMenuItem onClick={logout}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setLoginModalOpen(true)}>
              <LogInIcon className="h-4 w-4 mr-2" />
              Login as Admin
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <DataManagement open={dataManagementOpen} onOpenChange={setDataManagementOpen} />
    </>
  )
}

