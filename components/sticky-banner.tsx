"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import EternoLogo from "./eterno-logo"

interface StickyBannerProps {
  threshold?: number // Scroll threshold in pixels
  logoWidth?: string // Logo width
  alwaysVisible?: boolean // Option to always show the banner
}

export default function StickyBanner({
  threshold = 100,
  logoWidth = "45mm",
  alwaysVisible = false,
}: StickyBannerProps) {
  const [isVisible, setIsVisible] = useState(true) // Always visible by default now
  const [isTransparent, setIsTransparent] = useState(false)
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on the register page
  const isRegisterPage = pathname === "/register"

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    // If alwaysVisible is true or we're on the register page, always show the banner with background
    if (alwaysVisible || isRegisterPage) {
      setIsVisible(true)
      setIsTransparent(false)
      return
    }

    const handleScroll = () => {
      // Always show the banner
      setIsVisible(true)

      // Only on homepage, make it transparent when at the top
      if (pathname === "/") {
        setIsTransparent(window.scrollY < window.innerHeight - 50)
      } else {
        setIsTransparent(false)
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Initial check
    handleScroll()

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [threshold, alwaysVisible, isRegisterPage, pathname])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center justify-center transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      } ${isTransparent ? "bg-transparent" : "bg-eterno-sand shadow-md"}`}
    >
      <div className="w-full h-full flex items-center justify-center">
        <Link href="/" className="flex items-center justify-center w-full">
          <div className="flex justify-center items-center w-full">
            <EternoLogo
              width={logoWidth}
              mobileWidth={isMobile ? "35mm" : undefined}
              inverted={true}
              className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
            />
          </div>
        </Link>
      </div>
    </div>
  )
}
