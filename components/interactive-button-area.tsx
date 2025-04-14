"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface InteractiveButtonAreaProps {
  children: React.ReactNode
  radiusPercent?: number
  className?: string
}

export default function InteractiveButtonArea({
  children,
  radiusPercent = 30,
  className = "",
}: InteractiveButtonAreaProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const childrenElement = childrenRef.current

    if (!container || !childrenElement) return

    const handleMouseMove = (e: MouseEvent) => {
      // Get container dimensions and position
      const containerRect = container.getBoundingClientRect()
      const childrenRect = childrenElement.getBoundingClientRect()

      // Calculate center of container
      const centerX = containerRect.left + containerRect.width / 2
      const centerY = containerRect.top + containerRect.height / 2

      // Calculate distance from mouse to center
      const mouseX = e.clientX
      const mouseY = e.clientY
      const distanceFromCenter = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))

      // Calculate radius threshold (30% of the smaller dimension)
      const radius = Math.min(containerRect.width, containerRect.height) * (radiusPercent / 100)

      // Check if mouse is over children
      const isOverChildren =
        mouseX >= childrenRect.left &&
        mouseX <= childrenRect.right &&
        mouseY >= childrenRect.top &&
        mouseY <= childrenRect.bottom

      // Show if mouse is within radius or over children
      setIsVisible(distanceFromCenter <= radius || isOverChildren)
    }

    // Add mouse move listener
    window.addEventListener("mousemove", handleMouseMove)

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [radiusPercent])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        ref={childrenRef}
        className={`transition-opacity duration-700 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>

      {/* Debug visualization - only in development */}
      {process.env.NODE_ENV !== "production" && (
        <div
          className="absolute rounded-full border border-red-500 pointer-events-none opacity-10"
          style={{
            width: `${Math.min(containerRef.current?.offsetWidth || 0, containerRef.current?.offsetHeight || 0) * (radiusPercent / 50)}px`,
            height: `${Math.min(containerRef.current?.offsetWidth || 0, containerRef.current?.offsetHeight || 0) * (radiusPercent / 50)}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  )
}
