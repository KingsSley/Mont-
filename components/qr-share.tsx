"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShareIcon, CopyIcon, CheckIcon } from "lucide-react"

export function QRShare() {
  const [url, setUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [qrCode, setQrCode] = useState<string>("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href)

      // Generate QR code
      const encodedUrl = encodeURIComponent(window.location.href)
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedUrl}`)
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="text-center pb-2 sm:pb-4">
        <CardTitle className="flex items-center justify-center text-xl">
          <ShareIcon className="mr-2 h-5 w-5" />
          Share This App
        </CardTitle>
        <CardDescription>Let others view your inventory data</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-2 sm:pt-4">
        {qrCode && (
          <div className="mb-3 sm:mb-4 p-2 bg-white rounded-md shadow-sm border">
            <img src={qrCode || "/placeholder.svg"} alt="QR Code" width={150} height={150} className="rounded-sm" />
          </div>
        )}
        <p className="text-xs sm:text-sm text-center mb-3 sm:mb-4 max-w-xs">
          Scan this QR code or share the link below to give others view access.
        </p>
        <div className="flex w-full">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex-1 flex items-center justify-center text-sm"
          >
            {copied ? (
              <>
                <CheckIcon className="mr-2 h-4 w-4" /> Copied!
              </>
            ) : (
              <>
                <CopyIcon className="mr-2 h-4 w-4" /> Copy Link
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

