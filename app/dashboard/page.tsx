"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { ArrowUpIcon, ArrowDownIcon, DropletIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useInventoryStore } from "@/lib/store"
import { InventoryTable } from "@/components/inventory-table"
import { NavHeader } from "@/components/nav-header"

export default function DashboardPage() {
  const { production, sales } = useInventoryStore()
  const [chartData, setChartData] = useState<any[]>([])

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

  // Calculate total inventory
  const totalProduced = production.reduce((sum, item) => sum + item.quantity, 0)
  const totalSold = sales.reduce((sum, item) => sum + item.quantity, 0)
  const totalStock = totalProduced - totalSold

  // Calculate weekly data for chart
  useEffect(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    const data = last7Days.map((date) => {
      const dayProduction330 = production
        .filter((p) => p.date.split("T")[0] === date && p.waterType === "330ml")
        .reduce((sum, p) => sum + p.quantity, 0)

      const dayProduction500 = production
        .filter((p) => p.date.split("T")[0] === date && p.waterType === "500ml")
        .reduce((sum, p) => sum + p.quantity, 0)

      const dayProduction1L = production
        .filter((p) => p.date.split("T")[0] === date && p.waterType === "1Ltr")
        .reduce((sum, p) => sum + p.quantity, 0)

      const daySales330 = sales
        .filter((s) => s.date.split("T")[0] === date && s.waterType === "330ml")
        .reduce((sum, s) => sum + s.quantity, 0)

      const daySales500 = sales
        .filter((s) => s.date.split("T")[0] === date && s.waterType === "500ml")
        .reduce((sum, s) => sum + s.quantity, 0)

      const daySales1L = sales
        .filter((s) => s.date.split("T")[0] === date && s.waterType === "1Ltr")
        .reduce((sum, s) => sum + s.quantity, 0)

      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        "330ml_Production": dayProduction330,
        "500ml_Production": dayProduction500,
        "1Ltr_Production": dayProduction1L,
        "330ml_Sales": daySales330,
        "500ml_Sales": daySales500,
        "1Ltr_Sales": daySales1L,
        // Total values for area chart
        Total_Production: dayProduction330 + dayProduction500 + dayProduction1L,
        Total_Sales: daySales330 + daySales500 + daySales1L,
      }
    })

    setChartData(data)
  }, [production, sales])

  // Low stock threshold
  const LOW_STOCK_THRESHOLD = 500

  // Chart colors
  const chartColors = {
    production: {
      "330ml": "#3b82f6",
      "500ml": "#6366f1",
      "1Ltr": "#8b5cf6",
      total: "rgba(59, 130, 246, 0.7)",
    },
    sales: {
      "330ml": "#10b981",
      "500ml": "#14b8a6",
      "1Ltr": "#22c55e",
      total: "rgba(16, 185, 129, 0.7)",
    },
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center text-xs mb-1">
              <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="mr-2">{entry.name.replace("_", " ")}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      <NavHeader title="Dashboard" subtitle="Inventory overview and key metrics" />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4 sm:mb-6 md:mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">330ml Bottles</CardTitle>
              <DropletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{currentStock["330ml"].toLocaleString()} packs</div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentStock["330ml"] < LOW_STOCK_THRESHOLD ? (
                  <span className="text-red-500 flex items-center">
                    <ArrowDownIcon className="h-3 w-3 mr-1" /> Low stock alert
                  </span>
                ) : (
                  <span className="text-green-500 flex items-center">
                    <ArrowUpIcon className="h-3 w-3 mr-1" /> Stock level healthy
                  </span>
                )}
              </p>
              <div className="mt-4 text-sm">
                <div className="flex justify-between">
                  <span>Produced:</span>
                  <span>{inventory["330ml"].produced.toLocaleString()} packs</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Sold:</span>
                  <span>{inventory["330ml"].sold.toLocaleString()} packs</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">500ml Bottles</CardTitle>
              <DropletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{currentStock["500ml"].toLocaleString()} packs</div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentStock["500ml"] < LOW_STOCK_THRESHOLD ? (
                  <span className="text-red-500 flex items-center">
                    <ArrowDownIcon className="h-3 w-3 mr-1" /> Low stock alert
                  </span>
                ) : (
                  <span className="text-green-500 flex items-center">
                    <ArrowUpIcon className="h-3 w-3 mr-1" /> Stock level healthy
                  </span>
                )}
              </p>
              <div className="mt-4 text-sm">
                <div className="flex justify-between">
                  <span>Produced:</span>
                  <span>{inventory["500ml"].produced.toLocaleString()} packs</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Sold:</span>
                  <span>{inventory["500ml"].sold.toLocaleString()} packs</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">1Ltr Bottles</CardTitle>
              <DropletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{currentStock["1Ltr"].toLocaleString()} packs</div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentStock["1Ltr"] < LOW_STOCK_THRESHOLD ? (
                  <span className="text-red-500 flex items-center">
                    <ArrowDownIcon className="h-3 w-3 mr-1" /> Low stock alert
                  </span>
                ) : (
                  <span className="text-green-500 flex items-center">
                    <ArrowUpIcon className="h-3 w-3 mr-1" /> Stock level healthy
                  </span>
                )}
              </p>
              <div className="mt-4 text-sm">
                <div className="flex justify-between">
                  <span>Produced:</span>
                  <span>{inventory["1Ltr"].produced.toLocaleString()} packs</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Sold:</span>
                  <span>{inventory["1Ltr"].sold.toLocaleString()} packs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Production and sales over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Area Chart for Total Production and Sales */}
                  <div className="h-[250px] sm:h-[300px]">
                    <h3 className="text-sm font-medium mb-2">Total Activity</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColors.production.total} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={chartColors.production.total} stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColors.sales.total} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={chartColors.sales.total} stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="Total_Production"
                          name="Total Production"
                          stroke={chartColors.production["330ml"]}
                          fillOpacity={1}
                          fill="url(#colorProduction)"
                        />
                        <Area
                          type="monotone"
                          dataKey="Total_Sales"
                          name="Total Sales"
                          stroke={chartColors.sales["330ml"]}
                          fillOpacity={1}
                          fill="url(#colorSales)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bar Chart for Detailed Breakdown */}
                  <div className="h-[300px] sm:h-[350px] md:h-[400px]">
                    <h3 className="text-sm font-medium mb-2">Detailed Breakdown</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barGap={2} barSize={8}>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="330ml_Production"
                          name="330ml Production"
                          fill={chartColors.production["330ml"]}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="330ml_Sales"
                          name="330ml Sales"
                          fill={chartColors.sales["330ml"]}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="500ml_Production"
                          name="500ml Production"
                          fill={chartColors.production["500ml"]}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="500ml_Sales"
                          name="500ml Sales"
                          fill={chartColors.sales["500ml"]}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="1Ltr_Production"
                          name="1Ltr Production"
                          fill={chartColors.production["1Ltr"]}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="1Ltr_Sales"
                          name="1Ltr Sales"
                          fill={chartColors.sales["1Ltr"]}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Current Inventory</CardTitle>
                <CardDescription>Detailed view of your current stock</CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Mont Natural Mineral Water - All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}

