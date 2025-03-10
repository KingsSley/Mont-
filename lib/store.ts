"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProductionEntry, SalesEntry } from "./types"

interface InventoryState {
  production: ProductionEntry[]
  sales: SalesEntry[]
  addProduction: (entry: ProductionEntry) => void
  editProduction: (id: string, updatedEntry: Partial<ProductionEntry>) => void
  addSale: (entry: SalesEntry) => void
  editSale: (id: string, updatedEntry: Partial<SalesEntry>) => void
  getTotalInventory: () => number
  getInventoryByType: (waterType: "330ml" | "500ml" | "1Ltr") => number
  importData: (data: { production: ProductionEntry[]; sales: SalesEntry[] }) => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      production: [],
      sales: [],

      addProduction: (entry) => {
        set((state) => ({
          production: [...state.production, entry],
        }))
      },

      editProduction: (id, updatedEntry) => {
        set((state) => ({
          production: state.production.map((entry) => (entry.id === id ? { ...entry, ...updatedEntry } : entry)),
        }))
      },

      addSale: (entry) => {
        set((state) => ({
          sales: [...state.sales, entry],
        }))
      },

      editSale: (id, updatedEntry) => {
        set((state) => ({
          sales: state.sales.map((entry) => (entry.id === id ? { ...entry, ...updatedEntry } : entry)),
        }))
      },

      getTotalInventory: () => {
        const state = get()
        const totalProduced = state.production.reduce((sum, item) => sum + item.quantity, 0)
        const totalSold = state.sales.reduce((sum, item) => sum + item.quantity, 0)
        return totalProduced - totalSold
      },

      getInventoryByType: (waterType) => {
        const state = get()
        const produced = state.production
          .filter((item) => item.waterType === waterType)
          .reduce((sum, item) => sum + item.quantity, 0)

        const sold = state.sales
          .filter((item) => item.waterType === waterType)
          .reduce((sum, item) => sum + item.quantity, 0)

        return produced - sold
      },

      importData: (data) => {
        set({
          production: data.production,
          sales: data.sales,
        })
      },
    }),
    {
      name: "inventory-storage",
    },
  ),
)

