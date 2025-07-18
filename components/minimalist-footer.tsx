"use client"

import { useRouter, usePathname } from "next/navigation"
import SlidingButton from "./sliding-button"

export default function MinimalistFooter() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      // Handle anchor links with precise positioning
      if (pathname !== "/") {
        router.push(`/${href}`)
      } else {
        const sectionId = href.replace("#", "")

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
      }
    } else {
      router.push(href)
    }
  }

  return (
    <footer className="w-full bg-[#d8d3c2] border-t border-[#c5c0b3]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start h-full">
          {/* Navigation - Left Side - Stacked Vertically */}
          <nav className="flex flex-col items-start space-y-4">
            <button
              onClick={() => handleNavClick("/")}
              className="text-[#5a5a56] text-sm uppercase tracking-widest font-light hover:text-[#5a5a56]/70 transition-colors font-mulish"
            >
              HOME
            </button>
            <button
              onClick={() => handleNavClick("#collection")}
              className="text-[#5a5a56] text-sm uppercase tracking-widest font-light hover:text-[#5a5a56]/70 transition-colors font-mulish"
            >
              COLLECTION
            </button>
            <button
              onClick={() => handleNavClick("#from-the-yarn")}
              className="text-[#5a5a56] text-sm uppercase tracking-widest font-light hover:text-[#5a5a56]/70 transition-colors font-mulish"
            >
              FROM THE YARN
            </button>
            <button
              onClick={() => handleNavClick("#manifesto")}
              className="text-[#5a5a56] text-sm uppercase tracking-widest font-light hover:text-[#5a5a56]/70 transition-colors font-mulish"
            >
              PHILOSOPHY
            </button>
            <button
              onClick={() => handleNavClick("/shop")}
              className="text-[#5a5a56] text-sm uppercase tracking-widest font-light hover:text-[#5a5a56]/70 transition-colors font-mulish"
            >
              PRIVATE BOUTIQUE
            </button>
          </nav>

          {/* Register Interest - Bottom Right */}
          <div className="flex flex-col justify-between h-full mt-8 md:mt-0">
            {/* Spacer to push content to bottom */}
            <div className="flex-1"></div>

            <div className="flex flex-col items-start md:items-end space-y-4">
              <div className="w-full md:w-auto">
                <SlidingButton
                  onClick={() => router.push("/register")}
                  variant="dark"
                  duration={1000}
                  className="w-full md:w-auto px-6 py-3 text-sm"
                >
                  REGISTER INTEREST
                </SlidingButton>
              </div>

              <div className="text-xs text-[#5a5a56]/50 font-mulish">
                © {new Date().getFullYear()} ETERNO. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
