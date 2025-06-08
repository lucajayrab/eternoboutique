"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import SlidingButton from "./sliding-button"
import Link from "next/link"

// Constants
const GOOGLE_MAPS_LINK = "https://maps.google.com/?q=Mayfair,+London,+UK"

export default function BoutiqueTailoringSection() {
  const router = useRouter()

  const handleRegisterClick = useCallback(() => {
    router.push("/register")
  }, [router])

  return (
    <section id="boutique-tailoring" className="w-full bg-[#f9f8f5] py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="w-full px-8 sm:px-12 md:px-16 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Shop Now header */}
          <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70 mb-1">SHOP NOW</p>
          <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4 sm:mb-6">
            IN-PERSON TAILORING
          </h3>

          <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-[10px] sm:text-xs mb-6 sm:mb-10">
            <p className="mb-3 sm:mb-4">
              Our showroom in the heart of Mayfair offers a refined setting for your personal tailoring experience.
              Here, we provide in-person boutique tailoring appointments for clients who wish to have their items fully
              tailored to their build, as well as those who prefer to view our collection in-person before purchasing.
            </p>
            <p>
              Once tailored to your specifications, an order will be placed, and you will receive your bespoke garments
              in 4-6 weeks. We will keep your measurements and preferences saved on file for future orders as we expand
              our operations.
            </p>
          </div>

          {/* Locate Us Box - Centered */}
          <Link
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#eeeeec] p-4 sm:p-6 font-mulish text-[#5a5a56]/80 max-w-[550px] hover:bg-[#e8e4d9] transition-colors duration-300 border border-[#e0ddd2] mb-6"
          >
            <h4 className="text-[#5a5a56] font-normal mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider text-center">
              LOCATE US
            </h4>
            <p className="text-[10px] sm:text-xs flex items-center justify-center">
              The Mayfair Showroom
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 ml-1 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </p>
          </Link>

          {/* Register Interest Button - Centered */}
          <div className="max-w-[550px] mx-auto">
            <div className="flex justify-center">
              <SlidingButton
                onClick={handleRegisterClick}
                variant="dark"
                duration={1000}
                className="min-w-[140px] sm:min-w-[160px] md:min-w-[200px] py-2 sm:py-3 text-xs sm:text-sm"
              >
                ENQUIRE
              </SlidingButton>
            </div>
            <p className="text-[10px] sm:text-xs mt-3 text-[#5a5a56]/70 text-center max-w-[400px] mx-auto">
              Submit an enquiry and our team will contact you to discuss your order details.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
