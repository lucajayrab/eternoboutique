"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { X } from "lucide-react"
import SlidingButton from "./sliding-button"
import StickyBanner from "./sticky-banner"

interface NavigationMenuProps {
  logoWidth?: string
}

export default function NavigationMenu({ logoWidth = "45mm" }: NavigationMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

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

  const handleNavClick = (href: string) => {
    setIsOpen(false)

    if (href.startsWith("#")) {
      // Handle anchor links with precise positioning
      if (pathname !== "/") {
        router.push(`/${href}`)
        return
      }

      const sectionId = href.replace("#", "")

      // Wait for menu close animation before scrolling
      setTimeout(() => {
        // Special handling for collection to match hero arrow behavior
        if (sectionId === "collection") {
          // For mobile, position the sticky banner just above the "EXCLUSIVE EARLY ACCESS" title
          const isMobile = window.innerWidth < 768

          if (isMobile) {
            // Find the "EXCLUSIVE EARLY ACCESS" title element
            const collectionTitle = document.querySelector("#exclusive-access h2")

            if (collectionTitle) {
              // Get the position of the title relative to the document
              const titleRect = collectionTitle.getBoundingClientRect()
              const titlePosition = titleRect.top + window.pageYOffset

              // Position so the bottom of the sticky banner (70px height) sits just above the title
              const stickyHeaderHeight = 70
              const targetScrollPosition = titlePosition - stickyHeaderHeight

              window.scrollTo({
                top: targetScrollPosition,
                behavior: "smooth",
              })
            } else {
              // Fallback if title not found - scroll to approximate position
              const heroHeight = window.innerHeight
              const stickyHeaderHeight = 70
              const approximateOffset = 50 // Small buffer for section padding

              window.scrollTo({
                top: heroHeight + approximateOffset - stickyHeaderHeight,
                behavior: "smooth",
              })
            }
          } else {
            // Desktop behavior - just enough to make the sticky banner colored
            const heroHeight = window.innerHeight
            const stickyBannerActivationPoint = heroHeight - 50

            window.scrollTo({
              top: stickyBannerActivationPoint,
              behavior: "smooth",
            })
          }
        } else {
          // Regular section navigation
          const targetElement = document.getElementById(sectionId)

          if (targetElement) {
            const stickyHeaderHeight = 70
            const elementRect = targetElement.getBoundingClientRect()
            const elementPosition = elementRect.top + window.pageYOffset

            // Position so the bottom of the sticky header sits just at the top of the section
            const targetScrollPosition = elementPosition - stickyHeaderHeight

            window.scrollTo({
              top: targetScrollPosition,
              behavior: "smooth",
            })
          }
        }
      }, 300) // Wait for menu close animation
    } else {
      router.push(href)
    }
  }

  return (
    <>
      {/* Sticky Banner */}
      <StickyBanner logoWidth={logoWidth} onMenuClick={() => setIsOpen(true)} />

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#5a5a56] z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-white hover:bg-white/10 rounded transition-colors"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        {/* Menu Content */}
        <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
          <nav className="flex flex-col items-center space-y-8 mb-8 w-full">
            <button
              onClick={() => handleNavClick("/")}
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2"
            >
              HOME
            </button>
            <button
              onClick={() => handleNavClick("#collection")}
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2"
            >
              COLLECTION
            </button>
            <button
              onClick={() => handleNavClick("#from-the-yarn")}
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2"
            >
              FROM THE YARN
            </button>
            <button
              onClick={() => handleNavClick("#manifesto")}
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2"
            >
              PHILOSOPHY
            </button>
            <button
              onClick={() => handleNavClick("/shop")}
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2"
            >
              PRIVATE BOUTIQUE
            </button>
          </nav>

          <div className="w-full max-w-xs">
            <SlidingButton
              onClick={() => {
                setIsOpen(false)
                router.push("/register")
              }}
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
