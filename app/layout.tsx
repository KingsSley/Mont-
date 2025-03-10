import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"

export const metadata: Metadata = {
  title: "Mont Natural Mineral Water - Inventory Management",
  description: "Track production, sales, and inventory for Mont Natural Mineral Water",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'