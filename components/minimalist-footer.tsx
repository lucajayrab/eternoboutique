"use client"

import { useRouter } from "next/navigation"
import SlidingButton from "@/components/sliding-button"

export default function MinimalistFooter() {
  const router = useRouter()

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      router.push(`/#${sectionId}`)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handleRegisterClick = () => {
    router.push("/register")
  }

  return (
    <footer className="bg-[#d8d3c2] py-12 md:py-16 font-mulish">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Navigation Section - Left */}
          <div className="space-y-4">
            <h4 className="text-sm font-light text-[#5a5a56] uppercase tracking-wider mb-6">Navigation</h4>
            <nav className="space-y-3">
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
                onClick={() => scrollToSection("philosophy")}
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

          {/* Enhanced Register Interest Section - Bottom Right */}
          <div className="flex flex-col justify-end h-full mt-8 md:mt-0">
            <div className="flex flex-col items-start md:items-end space-y-6">
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
                  onClick={() => router.push("/register")}
                  variant="dark"
                  duration={1000}
                  className="px-6 py-3 text-sm"
                >
                  REGISTER INTEREST
                </SlidingButton>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section - Centered at Bottom */}
        <div className="mt-12 pt-8 border-t border-[#5a5a56]/20 text-center">
          <p className="text-xs font-light text-[#5a5a56]/60">© 2024 ETERNO LDN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
