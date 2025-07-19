"use client"

import { useEffect, useState } from "react"

export default function ThankYouPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger the fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#d8d3c2] flex items-center justify-center font-mulish">
      <div
        className={`text-center transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-2xl md:text-4xl font-light text-[#5a5a56] uppercase tracking-widest">Thank You</h1>
        <p className="text-sm md:text-base text-[#5a5a56]/70 mt-6 font-light tracking-wide">
          We will be in touch when the time is right.
        </p>
      </div>
    </div>
  )
}
