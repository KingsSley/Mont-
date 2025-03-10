"use client"

import type React from "react"

import { useState } from "react"
import { PlusIcon, DropletIcon, PencilIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useInventoryStore } from "@/lib/store"
import { type ProductionEntry, WATER_TYPES } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavHeader } from "@/components/nav-header"
import { EditDialog } from "@/components/edit-dialog"
import { useAuth } from "@/lib/auth-context"
import { LoginModal } from "@/components/login-modal"

export default function ProductionPage() {
  const { production, addProduction, editProduction } = useInventoryStore()
  const { toast } = useToast()
  const { isAuthenticated, userRole } = useAuth()
  const [quantity, setQuantity] = useState("")
  const [batchId, setBatchId] = useState("")
  const [waterType, setWaterType] = useState<"330ml" | "500ml" | "1Ltr">("330ml")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<ProductionEntry | null>(null)

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
        description: "Please enter a valid production quantity",
        variant: "destructive",
      })
      return
    }

    if (!batchId) {
      toast({
        title: "Batch ID required",
        description: "Please enter a batch ID for this production run",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Date required",
        description: "Please enter a production date",
        variant: "destructive",
      })
      return
    }

    const newProduction: ProductionEntry = {
      id: Date.now().toString(),
      date: new Date(date).toISOString(),
      quantity: Number.parseInt(quantity),
      batchId,
      waterType,
    }

    addProduction(newProduction)

    toast({
      title: "Production recorded",
      description: `Added ${quantity} packs of ${waterType} bottles to inventory`,
    })

    // Reset form
    setQuantity("")
    setBatchId("")
    setDate(new Date().toISOString().split("T")[0])
  }

  const handleEdit = (entry: ProductionEntry) => {
    if (!isAuthenticated || userRole !== "admin") {
      setLoginModalOpen(true)
      return
    }

    setCurrentEntry(entry)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = (updatedEntry: Partial<ProductionEntry>) => {
    if (!currentEntry || !isAuthenticated || userRole !== "admin") return

    // Format date back to ISO
    if (updatedEntry.date) {
      updatedEntry.date = new Date(updatedEntry.date).toISOString()
    }

    editProduction(currentEntry.id, updatedEntry)

    toast({
      title: "Production updated",
      description: "The production entry has been updated successfully",
    })
  }

  const productionFields = [
    { name: "quantity", label: "Quantity", type: "number" as const },
    { name: "date", label: "Date", type: "date" as const },
    { name: "batchId", label: "Batch ID", type: "text" as const },
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
      <NavHeader title="Production Management" subtitle="Record and track water production" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 mb-4 sm:mb-6 md:mb-8">
          <Card className="lg:col-span-1 bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Add Production</CardTitle>
              <CardDescription>Record a new production batch</CardDescription>
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
                  <Label htmlFor="batchId">Batch ID</Label>
                  <Input
                    id="batchId"
                    placeholder="Enter batch ID"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
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
                      Record Production
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
              <CardTitle>Production History</CardTitle>
              <CardDescription>Recent production batches</CardDescription>
            </CardHeader>
            <CardContent>
              {production.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <DropletIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No production records</h3>
                  <p className="text-sm text-muted-foreground">Add your first production batch to get started</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto -mx-4 sm:mx-0">
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Batch ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Quantity (packs)</TableHead>
                          {isAuthenticated && userRole === "admin" && (
                            <TableHead className="w-[80px]">Actions</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...production]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                              <TableCell>{entry.batchId}</TableCell>
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
        title="Edit Production Entry"
        description="Make changes to the production entry"
        initialData={currentEntry}
        onSave={handleSaveEdit}
        fields={productionFields}
      />

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  )
}

