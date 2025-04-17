import type React from "react"
import type { Metadata } from "next"
import { Mulish } from "next/font/google"
import "./globals.css"
import PageTransition from "@/components/page-transition"
import Script from "next/script"

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ETERNO | Mediterranean Luxury Menswear",
  description:
    "ETERNO represents Mediterranean sophistication, timeless tailoring, and a modern male lifestyle. Discover our exclusive collection.",
  keywords: "ETERNO, luxury menswear, Mediterranean fashion, tailored clothing, men's fashion",
  openGraph: {
    title: "ETERNO | Mediterranean Luxury Menswear",
    description: "Tailored by Tradition. Worn with Presence.",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body className={`${mulish.variable}`}>
        <PageTransition>{children}</PageTransition>

        {/* HubSpot tracking script */}
        <Script
          id="hs-script-loader"
          src="//js-eu1.hs-scripts.com/145973953.js"
          strategy="afterInteractive"
          data-hs-cookie-categories="analytics,advertisement"
          data-hs-privacy="true"
        />
      </body>
    </html>
  )
}
