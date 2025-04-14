"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // If the pathname changes
    if (children !== displayChildren) {
      // Start fade out
      setIsTransitioning(true)

      // After fade out completes, update children and fade in
      const timeout = setTimeout(() => {
        setDisplayChildren(children)
        setIsTransitioning(false)
      }, 500) // This should match the transition duration in CSS

      return () => clearTimeout(timeout)
    }
  }, [children, displayChildren, pathname])

  return (
    <div
      className="page-transition"
      style={{
        transition: "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isTransitioning ? 0 : 1,
      }}
    >
      {displayChildren}
    </div>
  )
}
