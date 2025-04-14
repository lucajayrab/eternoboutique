"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface DebugZoneProps {
  parentRef: React.RefObject<HTMLElement>
  radiusPercent?: number
}

export default function DebugZone({ parentRef, radiusPercent = 30 }: DebugZoneProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const zoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!parentRef.current) return

    const updateDimensions = () => {
      const parent = parentRef.current
      if (!parent) return

      const rect = parent.getBoundingClientRect()
      const smallerDimension = Math.min(rect.width, rect.height)
      const radius = smallerDimension * (radiusPercent / 100)

      setDimensions({
        width: radius * 2,
        height: radius * 2,
      })
    }

    // Initial update
    updateDimensions()

    // Update on resize
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [parentRef, radiusPercent])

  if (process.env.NODE_ENV === "production") return null

  return (
    <div
      ref={zoneRef}
      className="absolute rounded-full border-2 border-red-500 pointer-events-none z-50 opacity-30"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  )
}
