"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
  const [isVisible, setIsVisible] = useState(false)
  const [isTransparent, setIsTransparent] = useState(false)
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on the register page
  const isRegisterPage = pathname === "/register"

  useEffect(() => {
    // If alwaysVisible is true or we're on the register page, always show the banner
    if (alwaysVisible || isRegisterPage) {
      setIsVisible(true)
      setIsTransparent(false)
      return
    }

    const handleScroll = () => {
      if (isMobile && pathname === "/") {
        // Always show the banner on mobile home page
        setIsVisible(true)
        // But make it transparent only when at the top of the page
        setIsTransparent(window.scrollY < window.innerHeight - 50)
      } else {
        // Desktop behavior remains unchanged
        const scrolled = window.scrollY > window.innerHeight - threshold
        setIsVisible(scrolled)
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
  }, [threshold, alwaysVisible, isRegisterPage, isMobile, pathname])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-[70px] transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      } ${isTransparent ? "bg-transparent" : "bg-eterno-sand shadow-md"}`}
    >
      <div className="h-full flex items-center justify-center px-6">
        <EternoLogo width={logoWidth} inverted={true} className="hover:opacity-80 transition-opacity duration-300" />
      </div>
    </div>
  )
}
