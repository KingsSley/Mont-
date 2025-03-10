"use client"

import type React from "react"

import { useState } from "react"
import { PlusIcon, ShoppingCartIcon, PencilIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useInventoryStore } from "@/lib/store"
import { type SalesEntry, WATER_TYPES } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavHeader } from "@/components/nav-header"
import { EditDialog } from "@/components/edit-dialog"
import { useAuth } from "@/lib/auth-context"
import { LoginModal } from "@/components/login-modal"

export default function SalesPage() {
  const { sales, addSale, editSale, getInventoryByType } = useInventoryStore()
  const { toast } = useToast()
  const { isAuthenticated, userRole } = useAuth()
  const [quantity, setQuantity] = useState("")
  const [waterType, setWaterType] = useState<"330ml" | "500ml" | "1Ltr">("330ml")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<SalesEntry | null>(null)

  // Login modal state
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || userRole !== "admin") {
      setLoginModalOpen(true)
      return
    }

    if (!quantity || Number.parseInt(quantity) <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid sales quantity",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Date required",
        description: "Please enter a sales date",
        variant: "destructive",
      })
      return
    }

    const quantityNum = Number.parseInt(quantity)
    const currentStock = getInventoryByType(waterType)

    if (quantityNum > currentStock) {
      toast({
        title: "Insufficient inventory",
        description: `You only have ${currentStock} packs of ${waterType} bottles in stock`,
        variant: "destructive",
      })
      return
    }

    const newSale: SalesEntry = {
      id: Date.now().toString(),
      date: new Date(date).toISOString(),
      quantity: quantityNum,
      waterType,
      customer: "Customer", // Default value to match type
      price: 0, // Default value to match type
    }

    addSale(newSale)

    toast({
      title: "Sale recorded",
      description: `Sold ${quantity} packs of ${waterType} bottles`,
    })

    // Reset form
    setQuantity("")
    setDate(new Date().toISOString().split("T")[0])
  }

  const handleEdit = (entry: SalesEntry) => {
    if (!isAuthenticated || userRole !== "admin") {
      setLoginModalOpen(true)
      return
    }

    setCurrentEntry(entry)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = (updatedEntry: Partial<SalesEntry>) => {
    if (!currentEntry || !isAuthenticated || userRole !== "admin") return

    // Format date back to ISO
    if (updatedEntry.date) {
      updatedEntry.date = new Date(updatedEntry.date).toISOString()
    }

    // Check if we're increasing quantity and need to validate stock
    if (
      updatedEntry.quantity &&
      updatedEntry.quantity > currentEntry.quantity &&
      updatedEntry.waterType === currentEntry.waterType
    ) {
      const additionalQuantity = updatedEntry.quantity - currentEntry.quantity
      const currentStock = getInventoryByType(currentEntry.waterType)

      if (additionalQuantity > currentStock) {
        toast({
          title: "Insufficient inventory",
          description: `You only have ${currentStock} additional packs of ${currentEntry.waterType} bottles in stock`,
          variant: "destructive",
        })
        return
      }
    }

    // If water type changed, need to validate both old and new
    if (updatedEntry.waterType && updatedEntry.waterType !== currentEntry.waterType) {
      const quantity = updatedEntry.quantity || currentEntry.quantity
      const currentStock = getInventoryByType(updatedEntry.waterType)

      if (quantity > currentStock) {
        toast({
          title: "Insufficient inventory",
          description: `You only have ${currentStock} packs of ${updatedEntry.waterType} bottles in stock`,
          variant: "destructive",
        })
        return
      }
    }

    editSale(currentEntry.id, updatedEntry)

    toast({
      title: "Sale updated",
      description: "The sales entry has been updated successfully",
    })
  }

  const salesFields = [
    { name: "quantity", label: "Quantity", type: "number" as const },
    { name: "date", label: "Date", type: "date" as const },
    {
      name: "waterType",
      label: "Type",
      type: "select" as const,
      options: Object.entries(WATER_TYPES).map(([value, info]) => ({
        value,
        label: info.label,
      })),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      <NavHeader title="Sales Management" subtitle="Record and track water sales" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 mb-4 sm:mb-6 md:mb-8">
          <Card className="lg:col-span-1 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Record Sale</CardTitle>
              <CardDescription>Add a new sales transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (packs)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity in packs"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={!isAuthenticated || userRole !== "admin"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={!isAuthenticated || userRole !== "admin"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waterType">Type</Label>
                  <Select
                    value={waterType}
                    onValueChange={(value) => setWaterType(value as "330ml" | "500ml" | "1Ltr")}
                    disabled={!isAuthenticated || userRole !== "admin"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bottle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(WATER_TYPES).map(([type, info]) => (
                        <SelectItem key={type} value={type}>
                          {info.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={!isAuthenticated || userRole !== "admin"}>
                  {isAuthenticated && userRole === "admin" ? (
                    <>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Record Sale
                    </>
                  ) : (
                    <>
                      <LockIcon className="mr-2 h-4 w-4" />
                      Admin Access Required
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>Recent sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {sales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ShoppingCartIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No sales records</h3>
                  <p className="text-sm text-muted-foreground">Record your first sale to get started</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto -mx-4 sm:mx-0">
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Quantity (packs)</TableHead>
                          {isAuthenticated && userRole === "admin" && (
                            <TableHead className="w-[80px]">Actions</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...sales]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                              <TableCell>{entry.waterType}</TableCell>
                              <TableCell className="text-right">{entry.quantity.toLocaleString()}</TableCell>
                              {isAuthenticated && userRole === "admin" && (
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(entry)}
                                    className="h-8 w-8"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Mont Natural Mineral Water - All rights reserved</p>
        </div>
      </footer>

      {/* Edit Dialog */}
      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Sales Entry"
        description="Make changes to the sales entry"
        initialData={currentEntry}
        onSave={handleSaveEdit}
        fields={salesFields}
      />

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  )
}

