"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SlidingButton from "@/components/sliding-button"

export default function ThankYouPage() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleReturnHome = () => {
    router.push("/")
  }

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

        <div className="mt-8">
          <SlidingButton onClick={handleReturnHome} variant="dark" className="mx-auto">
            RETURN HOME
          </SlidingButton>
        </div>
      </div>
    </div>
  )
}
