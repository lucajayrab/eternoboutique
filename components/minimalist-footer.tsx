"use client"

import { useRouter } from "next/navigation"

export default function MinimalistFooter() {
  const router = useRouter()

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Private Boutique", href: "/shop" },
    { name: "Register Interest", href: "/register" },
  ]

  return (
    <footer className="bg-[#d8d3c2] py-12 md:py-16 font-mulish">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end h-full">
          {/* Navigation - Left Side */}
          <div className="flex flex-col space-y-4 mb-8 md:mb-0">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className="text-[#5a5a56] font-light text-sm uppercase tracking-wider hover:text-[#5a5a56]/70 transition-colors duration-200 text-left"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Register Interest Button - Bottom Right */}
          <div className="flex flex-col items-end justify-end flex-1">
            <div className="mt-auto">
              <button
                onClick={() => router.push("/register")}
                className="bg-[#5a5a56] text-white px-8 py-3 text-sm font-light uppercase tracking-wider hover:bg-[#5a5a56]/90 transition-colors duration-200"
              >
                REGISTER INTEREST
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
