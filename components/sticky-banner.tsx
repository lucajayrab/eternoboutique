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
  const pathname = usePathname()

  // Check if we're on the register page
  const isRegisterPage = pathname === "/register"

  useEffect(() => {
    // If alwaysVisible is true or we're on the register page, always show the banner
    if (alwaysVisible || isRegisterPage) {
      setIsVisible(true)
      return
    }

    const handleScroll = () => {
      // Check if we've scrolled past the hero section (viewport height)
      const scrolled = window.scrollY > window.innerHeight - threshold
      setIsVisible(scrolled)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Initial check
    handleScroll()

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [threshold, alwaysVisible, isRegisterPage])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-[70px] bg-eterno-sand shadow-md transition-all duration-500 hidden md:block ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}
    >
      <div className="h-full flex items-center justify-center px-6">
        <EternoLogo width={logoWidth} inverted={true} className="hover:opacity-80 transition-opacity duration-300" />
      </div>
    </div>
  )
}
