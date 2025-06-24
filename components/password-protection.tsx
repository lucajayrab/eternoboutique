"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SlidingButton from "@/components/sliding-button"

interface PasswordProtectionProps {
  onAuthenticated: () => void
}

export default function PasswordProtection({ onAuthenticated }: PasswordProtectionProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const correctPassword = "eternoinneraccess"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate a brief loading period for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (password === correctPassword) {
      // Store authentication in localStorage
      localStorage.setItem("eternoBoutiqueAccess", "authenticated")
      localStorage.setItem("eternoBoutiqueAccessTime", Date.now().toString())
      onAuthenticated()
    } else {
      setError("Invalid access code. Please try again.")
      setPassword("")
    }
    setIsLoading(false)
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#f9f8f5] flex items-center justify-center px-4 font-mulish">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[#5a5a56] font-normal text-lg md:text-xl uppercase tracking-wider mb-4">
            Private Boutique
          </h1>
          <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70 mb-2">By Invitation Only</p>
          <div className="w-16 h-px bg-[#5a5a56]/30 mx-auto"></div>
        </div>

        {/* Access Form */}
        <div className="bg-white p-6 md:p-8 shadow-sm border border-[#5a5a56]/10">
          <div className="text-center mb-6">
            <p className="font-mulish font-light text-[#5a5a56]/80 text-xs leading-relaxed">
              Welcome to our exclusive boutique collection. Please enter your access code to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wider text-[#5a5a56]/90 mb-2">
                Access Code
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#5a5a56]/20 bg-transparent text-[#5a5a56] text-sm font-light focus:outline-none focus:border-[#5a5a56]/50 transition-colors duration-300"
                placeholder="Enter access code"
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            {error && <div className="text-xs text-red-600 bg-red-50 p-3 border border-red-200">{error}</div>}

            <div className="pt-2">
              <SlidingButton
                type="submit"
                variant="dark"
                duration={800}
                className="w-full py-3 text-xs font-light tracking-wider"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? "Verifying..." : "Enter Boutique"}
              </SlidingButton>
            </div>
          </form>

          {/* Back to Home */}
          <div className="mt-6 pt-6 border-t border-[#5a5a56]/10 text-center">
            <button
              onClick={handleBackToHome}
              className="text-xs text-[#5a5a56]/70 hover:text-[#5a5a56] transition-colors duration-300 uppercase tracking-wider"
            >
              ← Return to Main Site
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-[10px] text-[#5a5a56]/50 font-light">
            Access is granted to invited clients and partners only.
          </p>
        </div>
      </div>
    </div>
  )
}
