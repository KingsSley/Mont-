"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { useState } from "react"
import { ShieldIcon, UserIcon, DatabaseIcon } from "lucide-react"
import { DataManagement } from "@/components/data-management"

export function WelcomeBanner() {
  const { isAuthenticated, userRole } = useAuth()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [dataManagementOpen, setDataManagementOpen] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 h-full">
      <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
        {isAuthenticated && userRole === "admin" ? (
          <ShieldIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary mr-2 sm:mr-3 flex-shrink-0" />
        ) : (
          <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-muted-foreground mr-2 sm:mr-3 flex-shrink-0" />
        )}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
          {isAuthenticated && userRole === "admin" ? "Welcome, Admin" : "Welcome, Guest"}
        </h2>
      </div>

      <p className="mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
        {isAuthenticated && userRole === "admin"
          ? "You have full access to manage inventory, record production, and track sales."
          : "You are currently in view-only mode. Login as admin to make changes to inventory."}
      </p>

      {isAuthenticated && userRole === "admin" && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs sm:text-sm text-blue-800">
            <strong>Admin Tip:</strong> To share your data across devices, use the Data Management option to export your
            data, then import it on another device.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {!isAuthenticated ? (
          <Button onClick={() => setLoginModalOpen(true)} size="sm" className="text-xs sm:text-sm">
            Login as Admin
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setDataManagementOpen(true)}
            size="sm"
            className="text-xs sm:text-sm"
          >
            <DatabaseIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Data Management
          </Button>
        )}
      </div>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <DataManagement open={dataManagementOpen} onOpenChange={setDataManagementOpen} />
    </div>
  )
}

