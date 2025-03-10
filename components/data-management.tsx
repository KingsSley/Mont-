"use client"

import type React from "react"

import { useState } from "react"
import { useInventoryStore } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileIcon, DownloadIcon, UploadIcon, AlertCircleIcon } from "lucide-react"
import { LoginModal } from "@/components/login-modal"

interface DataManagementProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DataManagement({ open, onOpenChange }: DataManagementProps) {
  const { production, sales, importData } = useInventoryStore()
  const { isAuthenticated, userRole } = useAuth()
  const { toast } = useToast()
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // Handle data export
  const handleExport = () => {
    if (!isAuthenticated || userRole !== "admin") {
      setLoginModalOpen(true)
      return
    }

    const data = { production, sales }
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `montwater-inventory-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Data exported successfully",
      description: "Your inventory data has been saved to a file",
    })
  }

  // Handle data import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated || userRole !== "admin") {
      setLoginModalOpen(true)
      return
    }

    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        // Basic validation
        if (!data.production || !data.sales || !Array.isArray(data.production) || !Array.isArray(data.sales)) {
          throw new Error("Invalid data format")
        }

        // Import the data
        importData(data)

        toast({
          title: "Data imported successfully",
          description: `Loaded ${data.production.length} production entries and ${data.sales.length} sales entries`,
        })

        // Clear the file input
        event.target.value = ""
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The file format is not valid",
          variant: "destructive",
        })
      }
    }

    reader.readAsText(file)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Data Management</DialogTitle>
            <DialogDescription>Export or import inventory data to share across devices</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Export Data</h3>
              <p className="text-sm text-muted-foreground">
                Save your current inventory data to a file that can be imported on other devices.
              </p>
              <Button onClick={handleExport} className="w-full" disabled={!isAuthenticated || userRole !== "admin"}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export to File
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Import Data</h3>
              <p className="text-sm text-muted-foreground">Load inventory data from a previously exported file.</p>
              {!isAuthenticated || userRole !== "admin" ? (
                <Button variant="outline" onClick={() => setLoginModalOpen(true)} className="w-full">
                  <FileIcon className="mr-2 h-4 w-4" />
                  Admin Access Required
                </Button>
              ) : (
                <div className="flex items-center">
                  <input type="file" id="data-import" accept=".json" onChange={handleImport} className="hidden" />
                  <label
                    htmlFor="data-import"
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md cursor-pointer"
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Select File to Import
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 rounded-md border border-amber-200 bg-amber-50 p-3">
              <AlertCircleIcon className="h-4 w-4 text-amber-900 flex-shrink-0" />
              <p className="text-xs text-amber-900">
                Importing data will replace all current inventory information. Make sure to export your current data
                first if needed.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  )
}

