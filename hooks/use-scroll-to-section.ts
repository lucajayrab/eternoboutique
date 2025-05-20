"use client"

import { useCallback } from "react"
import { useIsMobile } from "./use-mobile"

/**
 * Custom hook to handle scrolling to sections with proper offset on mobile
 */
export function useScrollToSection() {
  const isMobile = useIsMobile()

  const scrollToSection = useCallback(
    (sectionId: string) => {
      // Get the target element
      const targetElement = document.getElementById(sectionId)
      if (!targetElement) return

      if (isMobile) {
        // Mobile-specific scroll behavior with offset
        const stickyHeaderHeight = 70 // Height of sticky banner
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset

        // Scroll with offset to ensure content isn't covered by sticky header
        window.scrollTo({
          top: offsetTop - stickyHeaderHeight,
          behavior: "smooth",
        })
      } else {
        // Desktop behavior - standard scrollIntoView
        targetElement.scrollIntoView({ behavior: "smooth" })
      }
    },
    [isMobile],
  )

  return scrollToSection
}
