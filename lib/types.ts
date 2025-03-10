export interface ProductionEntry {
  id: string
  date: string
  quantity: number // in packs
  batchId: string
  waterType: "330ml" | "500ml" | "1Ltr"
}

export interface SalesEntry {
  id: string
  date: string
  quantity: number // in packs
  waterType: "330ml" | "500ml" | "1Ltr"
  customer: string
  price: number
}

export const WATER_TYPES = {
  "330ml": { bottlesPerPack: 20, label: "330ml (20 bottles/pack)" },
  "500ml": { bottlesPerPack: 15, label: "500ml (15 bottles/pack)" },
  "1Ltr": { bottlesPerPack: 8, label: "1Ltr (8 bottles/pack)" },
}

