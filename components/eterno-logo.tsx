"use client"

import { useState, useEffect } from "react"

interface EternoLogoProps {
  width?: string
  inverted?: boolean
  className?: string
  mobileWidth?: string // Add mobile width prop
  fixedSize?: boolean // New prop to ensure size doesn't change
}

export default function EternoLogo({
  width = "60mm",
  inverted = true,
  className = "",
  mobileWidth, // Optional mobile-specific width
  fixedSize = false, // Default to false for backward compatibility
}: EternoLogoProps) {
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [useFallbackLogo, setUseFallbackLogo] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [initialWidth, setInitialWidth] = useState(width)

  // Handle logo error and switch to fallback
  const handleLogoError = () => {
    console.log("Logo SVG failed to load, switching to fallback")
    setUseFallbackLogo(true)
  }

  // Handle logo loaded successfully
  const handleLogoLoaded = () => {
    setLogoLoaded(true)
  }

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Set initial width on first render
  useEffect(() => {
    if (fixedSize) {
      setInitialWidth(width)
    }
  }, [fixedSize, width])

  // Set a timeout to switch to fallback if logo doesn't load quickly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!logoLoaded) {
        setUseFallbackLogo(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [logoLoaded])

  // Determine the actual width to use
  // If fixedSize is true, always use the initialWidth
  const actualWidth = fixedSize ? initialWidth : isMobile && mobileWidth ? mobileWidth : width

  // Convert mm to pixels (approximate)
  const widthInPx = Number.parseInt(actualWidth) * 3.779527559

  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      {!useFallbackLogo ? (
        // Primary SVG logo - now using the new URL
        <img
          src={
            inverted
              ? "/eterno-logo-bold.svg"
              : "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/ETERNO%20Website%20Logo-i1zsaaao2lf5Zfk5uUfw31YkKv3QjC.svg"
          }
          alt="ETERNO"
          width={widthInPx}
          style={{
            width: actualWidth,
          }}
          className="mx-auto"
          onError={handleLogoError}
          onLoad={handleLogoLoaded}
        />
      ) : (
        // Fallback - inline SVG with slightly thicker strokes
        <svg
          width={widthInPx}
          height={widthInPx * 0.09}
          viewBox="0 0 203.4 18.4"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
          style={{ width: actualWidth }}
        >
          <g fill={inverted ? "#FFFFFF" : "#231f20"} stroke={inverted ? "#FFFFFF" : "#231f20"} strokeWidth="0.3">
            <path d="M13.6,14.6l-.2,3.8H0v-.4c.9-.3,1.1-1.1,1.1-3V3.3C1.1,1.4.9.6,0,.3V0h12.6l.3,3.7h-.4C11.6,1.1,9.9.4,7,.4h-3.1v7.9h2.5c3.2,0,4.1-.7,4.6-2h.4v4.5h-.4c-.4-1.4-1.4-2-4.6-2h-2.5v7.9c0,.9.5,1.3,1.3,1.3h2.5c2.7,0,4.5-.8,5.5-3.5h.4Z" />
            <path d="M50.2,3.2h-.3c-1-2-2.2-2.7-4.5-2.7h-.8v14.6c0,1.9.2,2.7,1.1,3v.4h-4.9v-.4c.9-.3,1.1-1.1,1.1-3V.4h-.8c-2.3,0-3.5.7-4.5,2.8h-.3L36.5,0h13.7l.2,3.2h-.2Z" />
            <path d="M86.4,14.5l-.2,3.8h-13.3v-.4c.9-.3,1.1-1.1,1.1-3V3.3c0-1.9-.2-2.7-1.1-3V0h12.6l.3,3.7h-.4c-1.1-2.5-2.7-3.3-5.7-3.3h-3.1v7.9h2.5c3.2,0,4.1-.7,4.6-2h.4v4.5h-.4c-.4-1.4-1.4-2-4.6-2h-2.5v7.9c0,.9.5,1.3,1.3,1.3h2.5c2.7,0,4.5-.8,5.5-3.5h.5Z" />
            <path d="M123.7,17.9c-1,0-1.2-.7-2.6-4.2-1.4-3.5-2-4.7-4.9-5,3.5-.4,5.1-2.2,5.1-4.6S120.2,0,114.5,0h-5.5v.4c.9.3,1.1,1.1,1.1,3v11.6c0,1.9-.2,2.7-1.1,3v.4h4.9v-.4c-.9-.3-1.1-1.1-1.1-3v-6.1h1.6c2.3,0,2.4,1.3,4,5.1,1.3,3.1,1.7,4.4,3.9,4.4s1.2,0,1.9-.1v-.4h-.5ZM114.4,8.5h-1.5V.5h1.2c3.3,0,4.6,2.3,4.6,4.4s-1.1,3.6-4.1,3.6h-.2Z" />
            <path d="M162.3.3c-.9.3-1.1,1.1-1.1,3v15.2h-.4l-12.2-15.4v10.4c0,3.2.7,4.1,2,4.5v.4h-3.5v-.4c.9-.3,1.1-1.1,1.1-3V3.3c0-1.9-.3-2.7-1.4-3V0h3l11,13.7V4.8c0-3.2-.7-4.1-2-4.5V0h3.5" />
            <path d="M194.2,0C188.7,0,185,4,185,9.1s4.8,9.3,9.2,9.3,9.2-2.9,9.2-9.2S198.5,0,194.2,0M196.1,17.7c-4.4,0-7.6-5-8-10.1-.3-4.1,1.7-6.9,5.2-6.9s7.5,5.2,7.9,10.6c.2,3.4-1.2,6.4-5.1,6.4h0Z" />
          </g>
        </svg>
      )}
    </div>
  )
}
