"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import StickyBanner from "@/components/sticky-banner"
import MobileMenu from "@/components/main-menu"
import DesktopNavigation from "@/components/desktop-navigation"
import SlidingButton from "@/components/sliding-button"

export default function CheckoutPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const savedOrder = localStorage.getItem("eternoOrder")
    if (savedOrder) {
      try {
        setOrderData(JSON.parse(savedOrder))
      } catch (e) {
        router.push("/shop")
      }
    } else {
      router.push("/shop")
    }
  }, [router])

  const handleShopifyCheckout = async () => {
    setIsProcessing(true)

    setTimeout(() => {
      alert("Order submitted successfully! You will be redirected to payment.")
      setIsProcessing(false)
      localStorage.removeItem("eternoCart")
      localStorage.removeItem("eternoOrder")
      router.push("/")
    }, 2000)
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5a5a56]">Loading your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <StickyBanner logoWidth="45mm" />
      <MobileMenu />
      <DesktopNavigation />

      <div className="pt-[70px]">
        <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 max-w-4xl py-12">
          <div className="text-center mb-12">
            <h1 className="font-mulish text-2xl md:text-3xl font-light tracking-widest uppercase text-[#5a5a56] mb-4">
              Complete Your Order
            </h1>
            <p className="font-mulish font-light text-[#5a5a56]/80 text-sm md:text-base">
              Review your order details before proceeding to secure payment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-[#f9f8f5] rounded-lg p-6">
              <h3 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-6">
                Order Details
              </h3>

              <div className="space-y-4 mb-6">
                {orderData.cart.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg">
                    <div className="w-16 h-16 bg-[#f9f8f5] rounded flex-shrink-0">
                      <div className="w-full h-full bg-[#5a5a56]/10 rounded flex items-center justify-center">
                        <span className="text-xs text-[#5a5a56]">
                          {item.type === "set" ? "SET" : item.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#5a5a56]">
                        {item.type === "set"
                          ? "Complete Set"
                          : `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`}
                      </h4>
                      <p className="text-sm text-[#5a5a56]/70">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#5a5a56]">
                        £{item.type === "set" ? 650 * item.quantity : 350 * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {orderData.embroidery && (
                <div className="p-4 bg-white rounded-lg mb-6">
                  <h4 className="font-medium text-[#5a5a56] mb-2">Custom Embroidery</h4>
                  <div className="text-sm text-[#5a5a56]/70 space-y-1">
                    <p>
                      Position:{" "}
                      {orderData.embroidery.position.charAt(0).toUpperCase() + orderData.embroidery.position.slice(1)}
                    </p>
                    <p>Text: "{orderData.embroidery.text}"</p>
                    <p>
                      Style: {orderData.embroidery.style.charAt(0).toUpperCase() + orderData.embroidery.style.slice(1)}
                    </p>
                    <p>
                      Color: {orderData.embroidery.color.charAt(0).toUpperCase() + orderData.embroidery.color.slice(1)}
                    </p>
                  </div>
                  <div className="text-right mt-2">
                    <p className="font-medium text-[#5a5a56]">£{orderData.embroidery.price}</p>
                  </div>
                </div>
              )}

              <div className="border-t border-[#5a5a56]/20 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-[#5a5a56]">Total</span>
                  <span className="text-xl font-medium text-[#5a5a56]">£{orderData.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f9f8f5] rounded-lg p-6">
              <h3 className="font-mulish text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-6">
                Secure Payment
              </h3>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-white rounded-lg text-center">
                  <div className="w-12 h-12 bg-[#5a5a56]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-medium text-[#5a5a56] mb-2">Secure Checkout</h4>
                  <p className="text-sm text-[#5a5a56]/70">
                    Your payment information is encrypted and secure. Powered by Shopify.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-medium text-[#5a5a56] mb-3">Delivery Information</h4>
                  <div className="text-sm text-[#5a5a56]/70 space-y-1">
                    <p>• Handcrafted to order in Italy</p>
                    <p>• 2-3 weeks production time</p>
                    <p>• Free worldwide shipping</p>
                    <p>• Tracking information provided</p>
                  </div>
                </div>
              </div>

              <SlidingButton
                onClick={handleShopifyCheckout}
                variant="dark"
                duration={800}
                className="w-full py-4 text-sm"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete Order"}
              </SlidingButton>

              <p className="text-xs text-[#5a5a56]/50 text-center mt-4">
                By completing your order, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
