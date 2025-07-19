"use client"

import { useRouter } from "next/navigation"
import SlidingButton from "@/components/sliding-button"
import { useIsMobile } from "@/hooks/use-mobile"

export default function MinimalistFooter() {
  const router = useRouter()
  const isMobile = useIsMobile()

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      router.push(`/#${sectionId}`)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        const stickyHeaderHeight = 70
        const elementRect = element.getBoundingClientRect()
        const elementPosition = elementRect.top + window.pageYOffset
        const targetScrollPosition = elementPosition - stickyHeaderHeight

        window.scrollTo({
          top: targetScrollPosition,
          behavior: "smooth",
        })
      }
    }
  }

  const handleRegisterClick = () => {
    router.push("/register")
  }

  return (
    <footer className="bg-[#d8d3c2] font-mulish">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 md:py-16">
        {/* Mobile-first layout - stacked vertically on mobile, side by side on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-12">
          {/* Navigation Section - Now first on mobile */}
          <div className="space-y-2 order-1">
            <h4 className="text-sm font-light text-[#5a5a56] uppercase tracking-wider mb-3">Navigation</h4>
            <nav className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-3">
              <button
                onClick={() => router.push("/")}
                className="block text-sm font-light text-[#5a5a56]/80 hover:text-[#5a5a56] transition-colors duration-200 text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("collection")}
                className="block text-sm font-light text-[#5a5a56]/80 hover:text-[#5a5a56] transition-colors duration-200 text-left"
              >
                Collection
              </button>
              <button
                onClick={() => scrollToSection("from-the-yarn")}
                className="block text-sm font-light text-[#5a5a56]/80 hover:text-[#5a5a56] transition-colors duration-200 text-left"
              >
                From the Yarn
              </button>
              <button
                onClick={() => scrollToSection("manifesto")}
                className="block text-sm font-light text-[#5a5a56]/80 hover:text-[#5a5a56] transition-colors duration-200 text-left"
              >
                Philosophy
              </button>
              <button
                onClick={() => router.push("/shop")}
                className="block text-sm font-light text-[#5a5a56]/80 hover:text-[#5a5a56] transition-colors duration-200 text-left"
              >
                Boutique Tailoring
              </button>
            </nav>
          </div>

          {/* Register Interest Section - Now second on mobile, right on desktop */}
          <div className="flex flex-col justify-start md:justify-end h-full order-2">
            <div className="flex flex-col items-start md:items-end space-y-3 md:space-y-6">
              {/* Subtle heading */}
              <div className="text-[#5a5a56] text-xs uppercase tracking-widest font-light font-mulish opacity-60">
                Stay Connected
              </div>

              {/* Brief description */}
              <div className="text-[#5a5a56] text-sm font-light font-mulish max-w-xs text-left md:text-right leading-relaxed">
                Be the first to discover our exclusive collections and bespoke tailoring services.
              </div>

              {/* Register Interest Button */}
              <div className="w-full md:w-auto">
                <SlidingButton
                  onClick={handleRegisterClick}
                  variant="dark"
                  duration={1000}
                  className="w-full md:w-auto px-6 py-3 text-sm"
                >
                  REGISTER INTEREST
                </SlidingButton>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section - Centered at Bottom */}
        <div className="mt-6 md:mt-12 pt-4 md:pt-8 border-t border-[#5a5a56]/20 text-center">
          <p className="text-xs font-light text-[#5a5a56]/60">© 2024 ETERNO LDN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
