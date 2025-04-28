"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import SlidingButton from "./sliding-button"

// Rename the component back to MobileMenu
export default function MobileMenu() {
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

    // Add scroll listener
    window.addEventListener("scroll", handleScroll)

    // Initial check
    handleScroll()

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [pathname])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleRegisterClick = () => {
    router.push("/register")
    setIsOpen(false)
  }

  return (
    <>
      {/* Menu Button - Now visible ONLY on mobile with improved touch target */}
      <div
        className={`md:hidden fixed top-0 right-0 z-50 h-[70px] flex items-center justify-end px-4 transition-all duration-300 pointer-events-none`}
      >
        <button
          onClick={toggleMenu}
          className={`p-3 rounded-full hover:bg-white/10 transition-colors pointer-events-auto touch-manipulation`}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          style={{ touchAction: "manipulation" }}
        >
          {isOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
        </button>
      </div>

      {/* Menu Overlay - Now ONLY for mobile with improved touch interactions */}
      <div
        className={`md:hidden fixed inset-0 bg-eterno-sand z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } pt-[70px]`}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
          <nav className="flex flex-col items-center space-y-8 mb-8 w-full">
            <a
              href="/"
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2 w-full text-center"
              onClick={() => setIsOpen(false)}
              style={{ touchAction: "manipulation" }}
            >
              HOME
            </a>
            <a
              href="#about"
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2 w-full text-center"
              onClick={() => setIsOpen(false)}
              style={{ touchAction: "manipulation" }}
            >
              ABOUT US
            </a>
            <a
              href="#process"
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors py-2 w-full text-center"
              onClick={() => setIsOpen(false)}
              style={{ touchAction: "manipulation" }}
            >
              PROCESS
            </a>
          </nav>

          <div className="w-full max-w-xs">
            <SlidingButton
              onClick={handleRegisterClick}
              variant="light"
              duration={1000}
              className="w-full py-4 text-base"
            >
              REGISTER INTEREST
            </SlidingButton>
          </div>
        </div>
      </div>
    </>
  )
}
