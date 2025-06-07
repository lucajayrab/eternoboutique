"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import SlidingButton from "./sliding-button"

export default function DesktopNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      // Handle anchor links for homepage
      if (pathname !== "/") {
        router.push(`/${href}`)
      } else {
        const targetElement = document.getElementById(href.replace("#", ""))
        if (targetElement) {
          const stickyHeaderHeight = 70
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset
          const scrollOffset = stickyHeaderHeight

          window.scrollTo({
            top: offsetTop - scrollOffset,
            behavior: "smooth",
          })
        }
      }
    } else {
      router.push(href)
    }
  }

  return (
    <nav
      className={`hidden md:flex fixed top-0 right-0 z-40 h-[70px] items-center pr-8 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : ""
      }`}
    >
      <div className="flex items-center space-x-8">
        <button
          onClick={() => handleNavClick("/")}
          className="text-sm uppercase tracking-wider text-[#5a5a56] hover:text-[#5a5a56]/70 transition-colors font-light"
        >
          Home
        </button>
        <button
          onClick={() => handleNavClick("#from-the-yarn")}
          className="text-sm uppercase tracking-wider text-[#5a5a56] hover:text-[#5a5a56]/70 transition-colors font-light"
        >
          From The Yarn
        </button>
        <button
          onClick={() => handleNavClick("#collection")}
          className="text-sm uppercase tracking-wider text-[#5a5a56] hover:text-[#5a5a56]/70 transition-colors font-light"
        >
          Collection
        </button>
        <button
          onClick={() => handleNavClick("/shop")}
          className="text-sm uppercase tracking-wider text-[#5a5a56] hover:text-[#5a5a56]/70 transition-colors font-light"
        >
          Shop
        </button>
        <button
          onClick={() => handleNavClick("#boutique-tailoring")}
          className="text-sm uppercase tracking-wider text-[#5a5a56] hover:text-[#5a5a56]/70 transition-colors font-light"
        >
          Tailoring
        </button>
        <button
          onClick={() => handleNavClick("#manifesto")}
          className="text-sm uppercase tracking-wider text-[#5a5a56] hover:text-[#5a5a56]/70 transition-colors font-light"
        >
          Philosophy
        </button>

        <div className="ml-4">
          <SlidingButton
            onClick={() => router.push("/register")}
            variant="dark"
            duration={800}
            className="px-6 py-2 text-xs"
          >
            ENQUIRE
          </SlidingButton>
        </div>
      </div>
    </nav>
  )
}
