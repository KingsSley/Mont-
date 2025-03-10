"use client"

import { useInventoryStore } from "@/lib/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PackageIcon } from "lucide-react"
import { WATER_TYPES } from "@/lib/types"

export function InventoryTable() {
  const { production, sales } = useInventoryStore()

  // Calculate inventory by water type
  const inventory = {
    "330ml": {
      produced: production.filter((item) => item.waterType === "330ml").reduce((sum, item) => sum + item.quantity, 0),
      sold: sales.filter((item) => item.waterType === "330ml").reduce((sum, item) => sum + item.quantity, 0),
    },
    "500ml": {
      produced: production.filter((item) => item.waterType === "500ml").reduce((sum, item) => sum + item.quantity, 0),
      sold: sales.filter((item) => item.waterType === "500ml").reduce((sum, item) => sum + item.quantity, 0),
    },
    "1Ltr": {
      produced: production.filter((item) => item.waterType === "1Ltr").reduce((sum, item) => sum + item.quantity, 0),
      sold: sales.filter((item) => item.waterType === "1Ltr").reduce((sum, item) => sum + item.quantity, 0),
    },
  }

  // Calculate current stock for each type
  const currentStock = {
    "330ml": inventory["330ml"].produced - inventory["330ml"].sold,
    "500ml": inventory["500ml"].produced - inventory["500ml"].sold,
    "1Ltr": inventory["1Ltr"].produced - inventory["1Ltr"].sold,
  }

  // Low stock threshold
  const LOW_STOCK_THRESHOLD = 500

  // Calculate total bottles
  const totalBottles = {
    "330ml": currentStock["330ml"] * WATER_TYPES["330ml"].bottlesPerPack,
    "500ml": currentStock["500ml"] * WATER_TYPES["500ml"].bottlesPerPack,
    "1Ltr": currentStock["1Ltr"] * WATER_TYPES["1Ltr"].bottlesPerPack,
  }

  if (production.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <PackageIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No inventory data</h3>
        <p className="text-sm text-muted-foreground">Add production records to see your inventory</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Water Type</TableHead>
            <TableHead className="text-right">Produced</TableHead>
            <TableHead className="text-right">Sold</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Bottles</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">330ml (20/pack)</TableCell>
            <TableCell className="text-right">{inventory["330ml"].produced.toLocaleString()}</TableCell>
            <TableCell className="text-right">{inventory["330ml"].sold.toLocaleString()}</TableCell>
            <TableCell className="text-right">{currentStock["330ml"].toLocaleString()}</TableCell>
            <TableCell className="text-right">{totalBottles["330ml"].toLocaleString()}</TableCell>
            <TableCell>
              {currentStock["330ml"] < LOW_STOCK_THRESHOLD ? (
                <span className="text-red-500">Low Stock</span>
              ) : (
                <span className="text-green-500">Healthy</span>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">500ml (15/pack)</TableCell>
            <TableCell className="text-right">{inventory["500ml"].produced.toLocaleString()}</TableCell>
            <TableCell className="text-right">{inventory["500ml"].sold.toLocaleString()}</TableCell>
            <TableCell className="text-right">{currentStock["500ml"].toLocaleString()}</TableCell>
            <TableCell className="text-right">{totalBottles["500ml"].toLocaleString()}</TableCell>
            <TableCell>
              {currentStock["500ml"] < LOW_STOCK_THRESHOLD ? (
                <span className="text-red-500">Low Stock</span>
              ) : (
                <span className="text-green-500">Healthy</span>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">1Ltr (8/pack)</TableCell>
            <TableCell className="text-right">{inventory["1Ltr"].produced.toLocaleString()}</TableCell>
            <TableCell className="text-right">{inventory["1Ltr"].sold.toLocaleString()}</TableCell>
            <TableCell className="text-right">{currentStock["1Ltr"].toLocaleString()}</TableCell>
            <TableCell className="text-right">{totalBottles["1Ltr"].toLocaleString()}</TableCell>
            <TableCell>
              {currentStock["1Ltr"] < LOW_STOCK_THRESHOLD ? (
                <span className="text-red-500">Low Stock</span>
              ) : (
                <span className="text-green-500">Healthy</span>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

