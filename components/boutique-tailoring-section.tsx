"use client"

import { useRouter } from "next/navigation"
import SlidingButton from "./sliding-button"
import Link from "next/link"

export default function BoutiqueTailoringSection() {
  const router = useRouter()

  const handleRegisterClick = () => {
    router.push("/register")
  }

  // Google Maps link for Clifford Street, Mayfair, London
  const googleMapsLink = "https://maps.google.com/?q=Clifford+Street,+Mayfair,+London,+W1S+4JY,+UK"

  return (
    <section className="w-full bg-[#eeeeec] py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="w-full">
        {/* Two-column layout using grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full">
          {/* Left Column - In-Person */}
          <div className="px-8 sm:px-12 md:px-16 lg:px-20 mb-10 md:mb-0">
            <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4 sm:mb-6 text-center md:text-left">
              IN-PERSON
            </h3>
            <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm mb-6 sm:mb-10 max-w-[550px]">
              <p>
                Our Clifford Street location in the heart of Mayfair offers a refined setting for your personal
                tailoring experience. Here, we provide in-person boutique tailoring appointments for clients who wish to
                have their items fully tailored to their build, as well as those who prefer to view our collection
                in-person before purchasing.
              </p>
              <p className="mt-3 sm:mt-4">
                Once tailored to your specifications, an order will be placed, and you will receive your bespoke
                garments in 4-6 weeks. We will keep your measurements and preferences saved on file for future orders as
                we expand our operations.
              </p>
            </div>

            {/* Locate Us Box - Now a clickable link */}
            <Link
              href={googleMapsLink}
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
                  REGISTER INTEREST
                </SlidingButton>
              </div>
              <p className="text-[10px] sm:text-xs mt-3 text-[#5a5a56]/70 max-w-[400px]">
                Register your interest and our team will contact you to discuss your order details.
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
                    All online orders are crafted with the same attention to detail as our in-person tailoring service.
                    Your garments will be delivered within 4-6 weeks from order confirmation, packaged with care and
                    ready to wear.
                  </p>
                </div>
              </div>

              {/* Size Charts - Using grid layout with equal sizing and wider width */}
              <div className="size-tables grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[600px]">
                {/* Shirt Size Chart */}
                <div className="bg-[#eeeeec] p-3 sm:p-4 font-mulish text-[#5a5a56]/80 h-full">
                  <h4 className="text-[#5a5a56] font-normal mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider text-left">
                    Shirts (Neck Size in Inches)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[180px] border-collapse">
                      <thead>
                        <tr>
                          <th className="py-1 px-2 border-b border-[#e0ddd2] text-left text-[10px] sm:text-xs font-normal">
                            Size
                          </th>
                          <th className="py-1 px-2 border-b border-[#e0ddd2] text-left text-[10px] sm:text-xs font-normal">
                            Neck
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">XS</td>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">14.5</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">S</td>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">15</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">M</td>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">15.5</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">L</td>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">16.5</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 text-[10px] sm:text-xs">XL</td>
                          <td className="py-1 px-2 text-[10px] sm:text-xs">17.5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Trouser Size Chart */}
                <div className="bg-[#eeeeec] p-3 sm:p-4 font-mulish text-[#5a5a56]/80 h-full">
                  <h4 className="text-[#5a5a56] font-normal mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider text-left">
                    Trousers (Waist Size in Inches)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[180px] border-collapse">
                      <thead>
                        <tr>
                          <th className="py-1 px-2 border-b border-[#e0ddd2] text-left text-[10px] sm:text-xs font-normal">
                            Size
                          </th>
                          <th className="py-1 px-2 border-b border-[#e0ddd2] text-left text-[10px] sm:text-xs font-normal">
                            Waist
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">XS</td>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">28–30</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">S</td>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">30–32</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">M</td>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">32–34</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">L</td>
                          <td className="py-1 px-2 border-b border-[#e0ddd2] text-[10px] sm:text-xs">34–36</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 text-[10px] sm:text-xs">XL</td>
                          <td className="py-1 px-2 text-[10px] sm:text-xs">36–38</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
