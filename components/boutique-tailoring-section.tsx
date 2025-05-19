"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import SlidingButton from "./sliding-button"
import { useRouter } from "next/navigation"

export default function BoutiqueTailoringSection() {
  const [activeView, setActiveView] = useState<"inPerson" | "online">("inPerson")
  const router = useRouter()

  const handleRegisterClick = () => {
    router.push("/register")
  }

  return (
    <section className="w-full bg-[#eeeeec] py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="w-full px-4 sm:px-6 md:px-8">
        <h2 className="font-mulish text-lg sm:text-xl md:text-2xl font-light tracking-widest uppercase text-[#5a5a56] text-center mb-6 sm:mb-8">
          Boutique Linen Tailoring
        </h2>

        {/* Toggle Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-10 sm:mb-16">
          <SlidingButton
            onClick={() => setActiveView("inPerson")}
            variant="dark"
            className={cn(
              "min-w-[140px] sm:min-w-[160px]",
              activeView === "inPerson" ? "opacity-100" : "opacity-70 hover:opacity-90",
            )}
          >
            IN-PERSON
          </SlidingButton>

          <SlidingButton
            onClick={() => setActiveView("online")}
            variant="dark"
            className={cn(
              "min-w-[140px] sm:min-w-[160px]",
              activeView === "online" ? "opacity-100" : "opacity-70 hover:opacity-90",
            )}
          >
            ONLINE
          </SlidingButton>
        </div>

        {/* Content Area - In-Person */}
        <div
          className={cn(
            "transition-opacity duration-500",
            activeView === "inPerson" ? "opacity-100" : "opacity-0 hidden",
          )}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4 sm:mb-6">
              ETERNO Mayfair
            </h3>
            <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm mb-6 sm:mb-10">
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

            {/* Visit Us Box with Register Interest Button */}
            <div className="bg-[#f8f7f5] p-4 sm:p-6 md:p-8 font-mulish text-[#5a5a56]/80 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              <h4 className="text-[#5a5a56] font-normal mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
                Visit Us
              </h4>
              <p className="text-[10px] sm:text-xs mb-4 sm:mb-6">
                Clifford Street, London, England, W1S 4JY, United Kingdom
              </p>

              <div className="mt-3 sm:mt-4">
                <SlidingButton
                  onClick={handleRegisterClick}
                  variant="dark"
                  duration={1000}
                  className="min-w-[140px] sm:min-w-[160px] md:min-w-[200px] py-2 sm:py-3 text-xs sm:text-sm"
                >
                  REGISTER INTEREST
                </SlidingButton>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Online */}
        <div
          className={cn(
            "transition-opacity duration-500",
            activeView === "online" ? "opacity-100" : "opacity-0 hidden",
          )}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base md:text-lg uppercase tracking-wider mb-4 sm:mb-6">
              Online Orders
            </h3>
            <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm mb-6 sm:mb-10">
              <p>
                For clients who prefer to order remotely, we offer the option to place standard orders from our capsule
                collection through our Register Interest form. After submitting your details, one of our representatives
                will be in touch to confirm your preferred size, color, and any additional extras you wish to include
                with your order.
              </p>
              <p className="mt-3 sm:mt-4">
                All online orders are crafted with the same attention to detail as our in-person tailoring service. Your
                garments will be delivered within 4-6 weeks from order confirmation, packaged with care and ready to
                wear.
              </p>
            </div>

            {/* Size Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10 max-w-4xl mx-auto">
              {/* Shirt Size Chart */}
              <div className="bg-[#f8f7f5] p-3 sm:p-4 md:p-6 font-mulish text-[#5a5a56]/80">
                <h4 className="text-[#5a5a56] font-normal mb-2 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">
                  Shirts (Neck Size in Inches)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[180px] sm:min-w-[200px] border-collapse">
                    <thead>
                      <tr>
                        <th className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-left text-[10px] sm:text-xs font-normal">
                          Size
                        </th>
                        <th className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-left text-[10px] sm:text-xs font-normal">
                          Neck (inches)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          XS
                        </td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          14.5
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          S
                        </td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          15
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          M
                        </td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          15.5
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          L
                        </td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          16.5
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 text-[10px] sm:text-xs">XL</td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 text-[10px] sm:text-xs">17.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Trouser Size Chart */}
              <div className="bg-[#f8f7f5] p-3 sm:p-4 md:p-6 font-mulish text-[#5a5a56]/80">
                <h4 className="text-[#5a5a56] font-normal mb-2 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">
                  Trousers (Waist Size in Inches)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[180px] sm:min-w-[200px] border-collapse">
                    <thead>
                      <tr>
                        <th className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-left text-[10px] sm:text-xs font-normal">
                          Size
                        </th>
                        <th className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-left text-[10px] sm:text-xs font-normal">
                          Waist (inches)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          XS
                        </td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          28–30
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          S
                        </td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          30–32
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          M
                        </td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          32–34
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          L
                        </td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 border-b border-[#e0ddd2] text-[10px] sm:text-xs">
                          34–36
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 text-[10px] sm:text-xs">XL</td>
                        <td className="py-1 sm:py-2 px-2 sm:px-4 text-[10px] sm:text-xs">36–38</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Register Interest Button */}
            <div className="bg-[#f8f7f5] p-4 sm:p-6 md:p-8 font-mulish text-[#5a5a56]/80 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              <h4 className="text-[#5a5a56] font-normal mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
                Place Your Order
              </h4>
              <p className="text-[10px] sm:text-xs mb-4 sm:mb-6">
                Register your interest below and our team will contact you to discuss your order details.
              </p>

              <div className="mt-3 sm:mt-4">
                <SlidingButton
                  onClick={handleRegisterClick}
                  variant="dark"
                  duration={1000}
                  className="min-w-[140px] sm:min-w-[160px] md:min-w-[200px] py-2 sm:py-3 text-xs sm:text-sm"
                >
                  REGISTER INTEREST
                </SlidingButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
