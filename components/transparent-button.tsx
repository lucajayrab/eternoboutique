"use client"

import type React from "react"

import { useState } from "react"

interface TransparentButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export default function TransparentButton({ onClick, children, className = "" }: TransparentButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        px-8 py-3 
        border border-white 
        transition-all duration-300 ease-in-out
        ${className}
      `}
      style={{
        background: isHovered ? "white" : "transparent",
      }}
    >
      <span
        style={{
          color: isHovered ? "rgba(0,0,0,0.1)" : "white", // Very light black for readability
          mixBlendMode: isHovered ? "darken" : "normal", // This helps with readability
          WebkitTextStroke: isHovered ? "0.5px rgba(0,0,0,0.3)" : "0", // Subtle outline for better readability
          transition: "all 300ms ease-in-out",
        }}
      >
        {children}
      </span>
    </button>
  )
}
