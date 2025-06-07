"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import SlidingButton from "./sliding-button"
import EternoLogo from "./eterno-logo"

interface NavigationMenuProps {
  logoWidth?: string
}

export default function NavigationMenu({ logoWidth = "45mm" }: NavigationMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for background transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

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
        router.push(`/${href}`)
      } else {
        const targetElement = document.getElementById(href.replace("#", ""))
        if (targetElement) {
          const stickyHeaderHeight = 70
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset

          window.scrollTo({
            top: offsetTop - stickyHeaderHeight,
            behavior: "smooth",
          })
        }
      }
    } else {
      router.push(href)
    }
  }

  const isTransparent = pathname === "/" && !isScrolled

  return (
    <>
      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 h-[70px] transition-all duration-300 ${
          isTransparent ? "bg-transparent" : "bg-white shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between h-full px-4 md:px-8">
          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <button onClick={() => handleNavClick("/")} className="flex items-center">
              <EternoLogo
                width={logoWidth}
                inverted={!isTransparent}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNavClick("/")}
              className={`text-sm uppercase tracking-wider font-light transition-colors ${
                isTransparent ? "text-white hover:text-white/70" : "text-[#5a5a56] hover:text-[#5a5a56]/70"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("#from-the-yarn")}
              className={`text-sm uppercase tracking-wider font-light transition-colors ${
                isTransparent ? "text-white hover:text-white/70" : "text-[#5a5a56] hover:text-[#5a5a56]/70"
              }`}
            >
              From The Yarn
            </button>
            <button
              onClick={() => handleNavClick("#collection")}
              className={`text-sm uppercase tracking-wider font-light transition-colors ${
                isTransparent ? "text-white hover:text-white/70" : "text-[#5a5a56] hover:text-[#5a5a56]/70"
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => handleNavClick("/shop")}
              className={`text-sm uppercase tracking-wider font-light transition-colors ${
                isTransparent ? "text-white hover:text-white/70" : "text-[#5a5a56] hover:text-[#5a5a56]/70"
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNavClick("#boutique-tailoring")}
              className={`text-sm uppercase tracking-wider font-light transition-colors ${
                isTransparent ? "text-white hover:text-white/70" : "text-[#5a5a56] hover:text-[#5a5a56]/70"
              }`}
            >
              Tailoring
            </button>
            <button
              onClick={() => handleNavClick("#manifesto")}
              className={`text-sm uppercase tracking-wider font-light transition-colors ${
                isTransparent ? "text-white hover:text-white/70" : "text-[#5a5a56] hover:text-[#5a5a56]/70"
              }`}
            >
              Philosophy
            </button>
            <div className="ml-4">
              <SlidingButton
                onClick={() => router.push("/register")}
                variant={isTransparent ? "light" : "dark"}
                duration={800}
                className="px-6 py-2 text-xs"
              >
                ENQUIRE
              </SlidingButton>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-full transition-colors ${
              isTransparent ? "text-white hover:bg-white/10" : "text-[#5a5a56] hover:bg-[#5a5a56]/10"
            }`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-[#5a5a56] z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } pt-[70px]`}
      >
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
