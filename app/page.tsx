import Link from "next/link"
import { ArrowRight, BarChart3, Package, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NavHeader } from "@/components/nav-header"
import { WelcomeBanner } from "@/components/welcome-banner"
import { QRShare } from "@/components/qr-share"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      <NavHeader title="Mont Natural Mineral Water" subtitle="Inventory Management System" />

      <main className="flex-1 container mx-auto px-4 py-4 sm:py-8 md:py-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-primary">
          Welcome to MontTrack
        </h2>

        {/* Welcome Banner - Now full width */}
        <div className="mb-6 sm:mb-8">
          <WelcomeBanner />
        </div>

        {/* Main Navigation Cards */}
        <section className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader className="pb-2 sm:pb-4">
              <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-1 sm:mb-2" />
              <CardTitle className="text-xl sm:text-2xl">Dashboard</CardTitle>
              <CardDescription>View your inventory overview</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pb-2 sm:pb-4">
              <p className="text-sm sm:text-base">
                See current stock levels, production and sales data for all water types.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader className="pb-2 sm:pb-4">
              <Package className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-1 sm:mb-2" />
              <CardTitle className="text-xl sm:text-2xl">Production</CardTitle>
              <CardDescription>Record new production batches</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pb-2 sm:pb-4">
              <p className="text-sm sm:text-base">Log production of 330ml, 500ml, and 1Ltr water bottle packs.</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" asChild className="w-full">
                <Link href="/production">
                  Manage Production <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow flex flex-col md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2 sm:pb-4">
              <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-1 sm:mb-2" />
              <CardTitle className="text-xl sm:text-2xl">Sales</CardTitle>
              <CardDescription>Record sales transactions</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pb-2 sm:pb-4">
              <p className="text-sm sm:text-base">
                Track sales of different water bottle types and monitor inventory levels.
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" asChild className="w-full">
                <Link href="/sales">
                  Manage Sales <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* QR Share Section - Now below the main cards */}
        <section className="mb-6 sm:mb-8 max-w-xs sm:max-w-sm mx-auto">
          <QRShare />
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-4 sm:py-6 px-4 mt-4 sm:mt-8">
        <div className="container mx-auto text-center">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Mont Natural Mineral Water - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}

