"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import SlidingButton from "./sliding-button"
import Link from "next/link"

// Constants
const GOOGLE_MAPS_LINK = "https://maps.google.com/?q=Clifford+Street,+Mayfair,+London,+W1S+4JY,+UK"

export default function BoutiqueTailoringSection() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [activeSection, setActiveSection] = useState<"in-person" | "online">("in-person")

  // Check if device is mobile
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Initialize mobile detection
  useEffect(() => {
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [checkMobile])

  const handleRegisterClick = useCallback(() => {
    router.push("/register")
  }, [router])

  const handleSectionChange = useCallback((section: "in-person" | "online") => {
    setActiveSection(section)
  }, [])

  // Render size chart table
  const renderSizeTable = (title: string, sizes: { size: string; measurement: string }[]) => (
    <div className="bg-[#eeeeec] p-3 sm:p-4 font-mulish text-[#5a5a56]/80 h-full">
      <h4 className="text-[#5a5a56] font-normal mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider text-left">
        {title}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[180px] border-collapse">
          <thead>
            <tr>
              <th className="py-1 px-2 border-b border-[#e0ddd2] text-left text-[10px] sm:text-xs font-normal">Size</th>
              <th className="py-1 px-2 border-b border-[#e0ddd2] text-left text-[10px] sm:text-xs font-normal">
                {title.includes("Shirt") ? "Neck" : "Waist"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((item, index) => (
              <tr key={index}>
                <td
                  className={`py-1 px-2 ${index < sizes.length - 1 ? "border-b border-[#e0ddd2]" : ""} text-[10px] sm:text-xs`}
                >
                  {item.size}
                </td>
                <td
                  className={`py-1 px-2 ${index < sizes.length - 1 ? "border-b border-[#e0ddd2]" : ""} text-[10px] sm:text-xs`}
                >
                  {item.measurement}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // Size data
  const shirtSizes = [
    { size: "XS", measurement: "14.5" },
    { size: "S", measurement: "15" },
    { size: "M", measurement: "15.5" },
    { size: "L", measurement: "16.5" },
    { size: "XL", measurement: "17.5" },
  ]

  const trouserSizes = [
    { size: "XS", measurement: "28–30" },
    { size: "S", measurement: "30–32" },
    { size: "M", measurement: "32–34" },
    { size: "L", measurement: "34–36" },
    { size: "XL", measurement: "36–38" },
  ]

  return (
    <section id="boutique-tailoring" className="w-full bg-[#eeeeec] py-8 sm:py-12 md:py-16 lg:py-16">
      <div className="w-full">
        <div className="w-full px-8 sm:px-12 md:px-16 lg:px-20 mb-8 md:mb-12"></div>
        {/* Mobile Toggle Buttons - Only visible on mobile */}
        {isMobile && (
          <div className="flex justify-center mb-8 px-8">
            <div className="grid grid-cols-2 w-full max-w-[300px] border border-[#e0ddd2]">
              <button
                onClick={() => handleSectionChange("in-person")}
                className={`py-2 px-4 text-xs uppercase tracking-wider font-light transition-colors ${
                  activeSection === "in-person" ? "bg-[#5a5a56] text-white" : "bg-[#eeeeec] text-[#5a5a56]"
                }`}
              >
                In-Person
              </button>
              <button
                onClick={() => handleSectionChange("online")}
                className={`py-2 px-4 text-xs uppercase tracking-wider font-light transition-colors ${
                  activeSection === "online" ? "bg-[#5a5a56] text-white" : "bg-[#eeeeec] text-[#5a5a56]"
                }`}
              >
                Online
              </button>
            </div>
          </div>
        )}

        {/* Desktop Layout - Two-column grid (hidden on mobile) */}
        {!isMobile && (
          <div className="grid grid-cols-1 md:grid-cols-2 w-full">
            {/* Left Column - In-Person */}
            <div className="px-8 sm:px-12 md:px-16 lg:px-20 mb-10 md:mb-0">
              {/* Shop Now header above In-Person only */}
              <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70 mb-1">SHOP NOW</p>
              <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4 sm:mb-6 text-center md:text-left">
                IN-PERSON
              </h3>
              <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm mb-6 sm:mb-10 max-w-[550px]">
                <p>
                  Our Clifford Street location in the heart of Mayfair offers a refined setting for your personal
                  tailoring experience. Here, we provide in-person boutique tailoring appointments for clients who wish
                  to have their items fully tailored to their build, as well as those who prefer to view our collection
                  in-person before purchasing.
                </p>
                <p className="mt-3 sm:mt-4">
                  Once tailored to your specifications, an order will be placed, and you will receive your bespoke
                  garments in 4-6 weeks. We will keep your measurements and preferences saved on file for future orders
                  as we expand our operations.
                </p>
              </div>

              {/* Locate Us Box - Now a clickable link */}
              <Link
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#eeeeec] p-4 sm:p-6 font-mulish text-[#5a5a56]/80 max-w-[550px] hover:bg-[#e8e4d9] transition-colors duration-300 border border-[#e0ddd2] mb-6"
              >
                <h4 className="text-[#5a5a56] font-normal mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
                  LOCATE US
                </h4>
                <p className="text-[10px] sm:text-xs flex items-center">
                  Clifford Street, London, England, W1S 4JY, United Kingdom
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

              {/* Register Interest Button - Now under Locate Us */}
              <div className="max-w-[550px]">
                <div className="flex justify-start">
                  <SlidingButton
                    onClick={handleRegisterClick}
                    variant="dark"
                    duration={1000}
                    className="min-w-[140px] sm:min-w-[160px] md:min-w-[200px] py-2 sm:py-3 text-xs sm:text-sm"
                  >
                    ENQUIRE
                  </SlidingButton>
                </div>
                <p className="text-[10px] sm:text-xs mt-3 text-[#5a5a56]/70 max-w-[400px]">
                  Submit an enquiry and our team will contact you to discuss your order details.
                </p>
              </div>
            </div>

            {/* Right Column - Online - Using grid layout */}
            <div className="px-8 sm:px-12 md:px-16 lg:px-20">
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {/* Online Text Section */}
                <div className="online-text max-w-[600px]">
                  <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4 sm:mb-6 text-center md:text-left">
                    ONLINE
                  </h3>
                  <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm text-left">
                    <p>
                      For clients who prefer to order remotely, we offer the option to place standard orders from our
                      capsule collection through our Register Interest form. After submitting your details, one of our
                      representatives will be in touch to confirm your preferred size, color, and any additional extras
                      you wish to include with your order.
                    </p>
                    <p className="mt-3 sm:mt-4">
                      All online orders are crafted with the same attention to detail as our in-person tailoring
                      service. Your garments will be delivered within 4-6 weeks from order confirmation, packaged with
                      care and ready to wear.
                    </p>
                  </div>
                </div>

                {/* Size Charts - Using grid layout with equal sizing and wider width */}
                <div className="size-tables grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[600px]">
                  {/* Shirt Size Chart */}
                  {renderSizeTable("Shirts (Neck Size in Inches)", shirtSizes)}

                  {/* Trouser Size Chart */}
                  {renderSizeTable("Trousers (Waist Size in Inches)", trouserSizes)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Layout - Tab-based content (only visible on mobile) */}
        {isMobile && (
          <div className="px-8">
            {/* In-Person Content */}
            {activeSection === "in-person" && (
              <div className="text-center">
                {/* Shop Now header above In-Person for mobile */}
                <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70 mb-1 text-center">SHOP NOW</p>
                <h3 className="text-[#5a5a56] font-normal text-base uppercase tracking-wider mb-6 text-center">
                  IN-PERSON
                </h3>
                <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs mb-8 max-w-[550px] mx-auto text-center">
                  <p>
                    Our Clifford Street location in the heart of Mayfair offers a refined setting for your personal
                    tailoring experience. Here, we provide in-person boutique tailoring appointments for clients who
                    wish to have their items fully tailored to their build, as well as those who prefer to view our
                    collection in-person before purchasing.
                  </p>
                  <p className="mt-4">
                    Once tailored to your specifications, an order will be placed, and you will receive your bespoke
                    garments in 4-6 weeks. We will keep your measurements and preferences saved on file for future
                    orders as we expand our operations.
                  </p>
                </div>

                {/* Locate Us Box - Centered for mobile */}
                <Link
                  href={GOOGLE_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-[#eeeeec] p-4 font-mulish text-[#5a5a56]/80 max-w-[550px] mx-auto hover:bg-[#e8e4d9] transition-colors duration-300 border border-[#e0ddd2] mb-8 text-center"
                >
                  <h4 className="text-[#5a5a56] font-normal mb-2 text-xs uppercase tracking-wider text-center">
                    LOCATE US
                  </h4>
                  <p className="text-[10px] flex items-center justify-center">
                    Clifford Street, London, England, W1S 4JY, United Kingdom
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

                {/* Register Interest Button - Centered for mobile */}
                <div className="max-w-[550px] mx-auto mb-4">
                  <div className="flex justify-center">
                    <SlidingButton
                      onClick={handleRegisterClick}
                      variant="dark"
                      duration={1000}
                      className="min-w-[180px] py-3 text-xs"
                    >
                      ENQUIRE
                    </SlidingButton>
                  </div>
                  <p className="text-[10px] mt-3 text-[#5a5a56]/70 text-center">
                    Submit an enquiry and our team will contact you to discuss your order details.
                  </p>
                </div>
              </div>
            )}

            {/* Online Content */}
            {activeSection === "online" && (
              <div className="text-center">
                {/* Shop Now header above Online for mobile */}
                <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70 mb-1 text-center">SHOP NOW</p>
                <h3 className="text-[#5a5a56] font-normal text-base uppercase tracking-wider mb-6 text-center">
                  ONLINE
                </h3>
                <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs mb-8 max-w-[550px] mx-auto text-center">
                  <p>
                    For clients who prefer to order remotely, we offer the option to place standard orders from our
                    capsule collection through our Register Interest form. After submitting your details, one of our
                    representatives will be in touch to confirm your preferred size, color, and any additional extras
                    you wish to include with your order.
                  </p>
                  <p className="mt-4">
                    All online orders are crafted with the same attention to detail as our in-person tailoring service.
                    Your garments will be delivered within 4-6 weeks from order confirmation, packaged with care and
                    ready to wear.
                  </p>
                </div>

                {/* Size Charts - Stacked for mobile */}
                <div className="space-y-6 max-w-[550px] mx-auto mb-8">
                  {/* Shirt Size Chart */}
                  <div className="bg-[#eeeeec] p-4 font-mulish text-[#5a5a56]/80 border border-[#e0ddd2]">
                    <h4 className="text-[#5a5a56] font-normal mb-3 text-xs uppercase tracking-wider text-center">
                      Shirts (Neck Size in Inches)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[180px] border-collapse mx-auto">
                        <thead>
                          <tr>
                            <th className="py-1 px-2 border-b border-[#e0ddd2] text-center text-[10px] font-normal">
                              Size
                            </th>
                            <th className="py-1 px-2 border-b border-[#e0ddd2] text-center text-[10px] font-normal">
                              Neck
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {shirtSizes.map((item, index) => (
                            <tr key={index}>
                              <td
                                className={`py-1 px-2 ${index < shirtSizes.length - 1 ? "border-b border-[#e0ddd2]" : ""} text-[10px] text-center`}
                              >
                                {item.size}
                              </td>
                              <td
                                className={`py-1 px-2 ${index < shirtSizes.length - 1 ? "border-b border-[#e0ddd2]" : ""} text-[10px] text-center`}
                              >
                                {item.measurement}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Trouser Size Chart */}
                  <div className="bg-[#eeeeec] p-4 font-mulish text-[#5a5a56]/80 border border-[#e0ddd2]">
                    <h4 className="text-[#5a5a56] font-normal mb-3 text-xs uppercase tracking-wider text-center">
                      Trousers (Waist Size in Inches)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[180px] border-collapse mx-auto">
                        <thead>
                          <tr>
                            <th className="py-1 px-2 border-b border-[#e0ddd2] text-center text-[10px] font-normal">
                              Size
                            </th>
                            <th className="py-1 px-2 border-b border-[#e0ddd2] text-center text-[10px] font-normal">
                              Waist
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {trouserSizes.map((item, index) => (
                            <tr key={index}>
                              <td
                                className={`py-1 px-2 ${index < trouserSizes.length - 1 ? "border-b border-[#e0ddd2]" : ""} text-[10px] text-center`}
                              >
                                {item.size}
                              </td>
                              <td
                                className={`py-1 px-2 ${index < trouserSizes.length - 1 ? "border-b border-[#e0ddd2]" : ""} text-[10px] text-center`}
                              >
                                {item.measurement}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Register Interest Button - Centered for mobile */}
                <div className="max-w-[550px] mx-auto mb-4">
                  <div className="flex justify-center">
                    <SlidingButton
                      onClick={handleRegisterClick}
                      variant="dark"
                      duration={1000}
                      className="min-w-[180px] py-3 text-xs"
                    >
                      ENQUIRE
                    </SlidingButton>
                  </div>
                  <p className="text-[10px] mt-3 text-[#5a5a56]/70 text-center">
                    Submit an enquiry and our team will contact you to discuss your order details.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
