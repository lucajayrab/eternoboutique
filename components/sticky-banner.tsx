"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import EternoLogo from "./eterno-logo"
import { Menu } from "lucide-react"

interface StickyBannerProps {
  threshold?: number
  logoWidth?: string
  alwaysVisible?: boolean
  onMenuClick?: () => void
}

export default function StickyBanner({
  threshold = 100,
  logoWidth = "45mm",
  alwaysVisible = false,
  onMenuClick,
}: StickyBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isTransparent, setIsTransparent] = useState(false)
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on the home page
  const isHomePage = pathname === "/"

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Always show the banner
    setIsVisible(true)

    // Only make transparent on homepage when at the top, but NOT on mobile
    if (isHomePage && !alwaysVisible && !isMobile) {
      const handleScroll = () => {
        setIsTransparent(window.scrollY < window.innerHeight - 50)
      }

      window.addEventListener("scroll", handleScroll)
      handleScroll() // Initial check

      return () => window.removeEventListener("scroll", handleScroll)
    } else {
      // On mobile or non-homepage, always keep it colored (non-transparent)
      setIsTransparent(false)
    }
  }, [threshold, alwaysVisible, isHomePage, isMobile])

  // Mobile-optimized logo size
  const mobileLogoWidth = "28mm"

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-[50px] md:h-[60px] flex items-center justify-between px-3 md:px-6 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      } ${isTransparent ? "bg-transparent" : "bg-[#d8d3c2] shadow-md"}`}
    >
      {/* Left spacer for centering */}
      <div className="w-8 md:w-12"></div>

      {/* Centered Logo */}
      <div className="flex-1 flex justify-center">
        <Link href="/" className="flex items-center justify-center">
          <EternoLogo
            width={isMobile ? mobileLogoWidth : logoWidth}
            inverted={false}
            className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
            fixedSize={true}
          />
        </Link>
      </div>

      {/* Menu Button - Mobile optimized */}
      <button
        onClick={onMenuClick}
        className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center hover:bg-black/5 rounded transition-colors touch-manipulation"
        aria-label="Open menu"
        style={{ touchAction: "manipulation" }}
      >
        <Menu size={isMobile ? 16 : 18} className="text-[#5a5a56]" />
      </button>
    </div>
  )
}
