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
        // Mobile-specific scroll behavior with section-specific offsets
        const stickyHeaderHeight = 70 // Height of sticky banner
        const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset

        // Section-specific offsets
        let scrollOffset = 0

        if (sectionId === "from-the-yarn") {
          // For "From The Yarn" section, make sure the sticky banner is visible
          // and positioned at the top of the section content
          scrollOffset = stickyHeaderHeight
        } else {
          // For other sections, position the sticky banner to cover the color transition
          // This places the sticky banner on top of the added margin (pt-6 = 24px)
          scrollOffset = stickyHeaderHeight + 12 // Half of the padding to position banner in the middle
        }

        // Scroll with calculated offset
        window.scrollTo({
          top: offsetTop - scrollOffset,
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
