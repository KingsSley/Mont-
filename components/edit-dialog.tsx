"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  initialData: any
  onSave: (data: any) => void
  fields: {
    name: string
    label: string
    type: "text" | "number" | "date" | "select"
    options?: { value: string; label: string }[]
  }[]
}

export function EditDialog({ open, onOpenChange, title, description, initialData, onSave, fields }: EditDialogProps) {
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (open && initialData) {
      // Format date fields from ISO to YYYY-MM-DD for input
      const formattedData = { ...initialData }
      if (formattedData.date && formattedData.date.includes("T")) {
        formattedData.date = formattedData.date.split("T")[0]
      }
      setFormData(formattedData)
    }
  }, [open, initialData])

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor={field.name} className="sm:text-right">
                  {field.label}
                </Label>
                {field.type === "select" ? (
                  <Select value={formData[field.name] || ""} onValueChange={(value) => handleChange(field.name, value)}>
                    <SelectTrigger className="sm:col-span-3">
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={(e) => {
                      const value = field.type === "number" ? Number.parseInt(e.target.value) : e.target.value
                      handleChange(field.name, value)
                    }}
                    className="sm:col-span-3"
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

