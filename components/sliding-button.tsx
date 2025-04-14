"use client"

import type React from "react"

interface SlidingButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
  duration?: number
  variant?: "light" | "dark"
  type?: "button" | "submit" | "reset"
}

export default function SlidingButton({
  onClick,
  children,
  className = "",
  duration = 300,
  variant = "light",
  type = "button",
}: SlidingButtonProps) {
  // Convert duration to a string for inline style
  const transitionDuration = `${duration}ms`

  // Define styles based on variant
  const borderColor = variant === "light" ? "border-white" : "border-eterno-text"
  const textColor = variant === "light" ? "text-white" : "text-eterno-text"
  const hoverTextColor = variant === "light" ? "group-hover:text-[#111]" : "group-hover:text-white"
  const bgColor = variant === "light" ? "bg-white" : "bg-eterno-text"

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        relative px-8 py-3 
        border ${borderColor}
        ${textColor}
        overflow-hidden
        group
        font-mulish
        tracking-widest
        text-sm
        font-normal
        ${className}
      `}
    >
      {/* Sliding background that animates from left to right on hover */}
      <span
        className={`absolute inset-0 w-0 ${bgColor} group-hover:w-full`}
        style={{
          left: 0,
          right: "auto",
          transition: `width ${transitionDuration} ease-in-out`,
        }}
      />

      {/* Text that changes color on hover */}
      <span
        className={`relative z-10 ${hoverTextColor}`}
        style={{
          transition: `color ${transitionDuration} ease-in-out`,
        }}
      >
        {children}
      </span>
    </button>
  )
}
