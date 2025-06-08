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
      // Handle anchor links
      if (pathname !== "/") {
        // If not on homepage, navigate to homepage with anchor
        router.push(`/${href}`)
      } else {
        // If on homepage, scroll to section
        const targetElement = document.getElementById(href.replace("#", ""))
        if (targetElement) {
          const stickyHeaderHeight = 70
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset

          // Section-specific offsets for better positioning
          let scrollOffset = stickyHeaderHeight
          const targetId = href.replace("#", "")

          if (targetId === "from-the-yarn") {
            scrollOffset = stickyHeaderHeight + 12
          }

          window.scrollTo({
            top: offsetTop - scrollOffset,
            behavior: "smooth",
          })
        }
      }
    } else {
      // Handle regular page navigation
      router.push(href)
      // Ensure page loads at top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 100)
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
              onClick={() => handleNavClick("#from-the-yarn")}
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2"
            >
              FROM THE YARN
            </button>
            <button
              onClick={() => handleNavClick("#collection")}
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2"
            >
              COLLECTION
            </button>
            <button
              onClick={() => handleNavClick("/shop")}
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2"
            >
              SHOP
            </button>
            <button
              onClick={() => handleNavClick("#boutique-tailoring")}
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2"
            >
              TAILORING
            </button>
            <button
              onClick={() => handleNavClick("#manifesto")}
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2"
            >
              PHILOSOPHY
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
