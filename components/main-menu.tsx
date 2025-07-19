"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import SlidingButton from "./sliding-button"

interface MobileMenuProps {
  logoWidth?: string
}

export default function MobileMenu({ logoWidth = "40mm" }: MobileMenuProps) {
  const pathname = usePathname()
  const [isTransparent, setIsTransparent] = useState(pathname === "/")
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Close menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    window.addEventListener("popstate", handleRouteChange)
    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle transparency based on scroll position
  useEffect(() => {
    // Only apply transparency effect on home page
    if (pathname !== "/") {
      setIsTransparent(false)
      return
    }

    const handleScroll = () => {
      // Make header solid after scrolling past hero section
      setIsTransparent(window.scrollY < window.innerHeight - 50)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [pathname])

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleRegisterClick = useCallback(() => {
    router.push("/register")
    setIsOpen(false)
  }, [router])

  // Menu link component for DRY code
  const MenuLink = ({ href, label }: { href: string; label: string }) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      setIsOpen(false)

      // Get the target element
      const targetId = href.replace("#", "")
      if (!targetId) {
        // If it's the home page, just navigate
        router.push("/")
        return
      }

      // Wait for menu close animation
      setTimeout(() => {
        if (href === "/shop") {
          router.push("/shop")
          return
        }

        if (pathname !== "/" && href.startsWith("#")) {
          router.push(`/${href}`)
          return
        }

        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          // For mobile, add section-specific offset
          const isMobile = window.innerWidth < 768

          if (isMobile) {
            const stickyHeaderHeight = 70 // Height of sticky banner
            const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset

            // Section-specific offsets
            let scrollOffset = 0

            if (targetId === "from-the-yarn") {
              // For "From The Yarn" section, make sure the sticky banner is visible
              // and positioned at the top of the section content
              scrollOffset = stickyHeaderHeight
            } else {
              // For other sections, position the sticky banner to cover the color transition
              // This places the sticky banner on top of the added margin (pt-6 = 24px)
              scrollOffset = stickyHeaderHeight + 12 // Half of the padding to position banner in the middle
            }

            // Scroll with calculated offset
            window.scrollTo({
              top: offsetTop - scrollOffset,
              behavior: "smooth",
            })
          } else {
            // Desktop behavior
            targetElement.scrollIntoView({ behavior: "smooth" })
          }
        } else {
          // If element not found, just navigate to the href
          router.push(href)
        }
      }, 300) // Wait for menu close animation
    }

    return (
      <a
        href={href}
        className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2 w-full text-center"
        onClick={handleClick}
        style={{ touchAction: "manipulation" }}
      >
        {label}
      </a>
    )
  }

  return (
    <>
      {/* Menu Button */}
      <div className="md:hidden fixed top-0 right-0 z-50 h-[70px] flex items-center justify-end px-4 transition-all duration-300 pointer-events-none">
        <button
          onClick={toggleMenu}
          className="p-3 rounded-full hover:bg-white/10 transition-colors pointer-events-auto touch-manipulation"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          style={{ touchAction: "manipulation" }}
        >
          {isOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
        </button>
      </div>

      {/* Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-[#5a5a56] z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } pt-[70px]`}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
          <nav className="flex flex-col items-center space-y-8 mb-8 w-full">
            <MenuLink href="/" label="HOME" />
            <MenuLink href="#from-the-yarn" label="FROM THE YARN" />
            <MenuLink href="#collection" label="COLLECTION" />
            <MenuLink href="/shop" label="SHOP" />
            <MenuLink href="#boutique-tailoring" label="SHOP NOW" />
            <MenuLink href="#manifesto" label="OUR PHILOSOPHY" />
          </nav>

          <div className="w-full max-w-xs">
            <SlidingButton
              onClick={handleRegisterClick}
              variant="light"
              duration={1000}
              className="w-full py-4 text-base"
            >
              ENQUIRE
            </SlidingButton>
          </div>
        </div>
      </div>
    </>
  )
}
