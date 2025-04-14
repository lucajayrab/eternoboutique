"use client"

import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Logo() {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"
  const isConfirmationPage = pathname === "/confirmation"

  // Use inverted (white) logo on landing and confirmation pages
  const shouldInvert = isLandingPage || isConfirmationPage

  return (
    <div className="flex flex-col items-center mb-10 mt-10">
      <Image
        src="/eterno-logo.svg"
        alt="ETERNO"
        width={260}
        height={39}
        priority
        className={`h-auto transition-all duration-300 ${shouldInvert ? "filter brightness-0 invert" : ""}`}
      />
    </div>
  )
}
