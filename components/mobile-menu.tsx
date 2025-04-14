"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import EternoLogo from "./eterno-logo"
import SlidingButton from "./sliding-button"

interface MobileMenuProps {
  logoWidth?: string
}

export default function MobileMenu({ logoWidth = "40mm" }: MobileMenuProps) {
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

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleRegisterClick = () => {
    router.push("/register")
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-[70px] bg-eterno-sand shadow-md flex items-center justify-between px-4">
        <div className="flex-1">
          <EternoLogo width={logoWidth} inverted={true} />
        </div>
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-eterno-sand z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } pt-[70px]`}
      >
        <div className="flex flex-col items-center justify-center h-full p-8 space-y-8">
          <nav className="flex flex-col items-center space-y-6 mb-8">
            <a
              href="/"
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a
              href="#tailoring"
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Tailoring
            </a>
            <a
              href="#collection"
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Collection
            </a>
            <a
              href="#process"
              className="text-white text-lg uppercase tracking-widest font-light hover:text-white/70 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Process
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
