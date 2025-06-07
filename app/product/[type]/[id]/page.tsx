"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import StickyBanner from "@/components/sticky-banner"
import MobileMenu from "@/components/main-menu"
import DesktopNavigation from "@/components/desktop-navigation"
import SlidingButton from "@/components/sliding-button"

// Product data
const SHIRT_COLORS = [
  { name: "White", color: "#f5f5f5", image: "/white-linen-shirt-final.png", price: 350 },
  { name: "Black", color: "#2a2a33", image: "/black-linen-shirt-final.png", price: 350 },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-shirt-final.png", price: 350 },
  { name: "Sky Blue", color: "#c9d7e8", image: "/sky-blue-linen-shirt-final.png", price: 350 },
  { name: "Pink", color: "#e7d0d3", image: "/pink-linen-shirt-updated.png", price: 350 },
  { name: "Sage", color: "#9ca594", image: "/sage-linen-shirt-final.png", price: 350 },
]

const TROUSER_COLORS = [
  { name: "Natural", color: "#eae7d9", image: "/cream-linen-trousers-new.png", price: 350 },
  { name: "White", color: "#f5f5f5", image: "/white-linen-trousers.png", price: 350 },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-trousers-new.png", price: 350 },
  { name: "Black", color: "#2a2a33", image: "/black-linen-trousers-new.png", price: 350 },
]

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState("M")

  useEffect(() => {
    const { type, id } = params
    const productId = Number.parseInt(id as string)

    if (type === "shirt" && productId >= 0 && productId < SHIRT_COLORS.length) {
      setProduct({ ...SHIRT_COLORS[productId], type: "shirt", id: productId })
    } else if (type === "trouser" && productId >= 0 && productId < TROUSER_COLORS.length) {
      setProduct({ ...TROUSER_COLORS[productId], type: "trouser", id: productId })
    } else {
      router.push("/shop")
    }
  }, [params, router])

  const addToCart = () => {
    const cartItem = {
      type: product.type,
      [`${product.type}Index`]: product.id,
      quantity: 1,
      size: selectedSize,
    }

    const existingCart = JSON.parse(localStorage.getItem("eternoCart") || "[]")
    const existingIndex = existingCart.findIndex(
      (item: any) =>
        item.type === cartItem.type &&
        item[`${product.type}Index`] === cartItem[`${product.type}Index`] &&
        item.size === cartItem.size,
    )

    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += 1
    } else {
      existingCart.push(cartItem)
    }

    localStorage.setItem("eternoCart", JSON.stringify(existingCart))

    // Show success message or redirect
    alert("Added to cart!")
  }

  const sizes = ["XS", "S", "M", "L", "XL"]

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5a5a56]">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Banner */}
      <StickyBanner logoWidth="45mm" />

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Desktop Navigation */}
      <DesktopNavigation />

      {/* Main Content */}
      <div className="pt-[70px]">
        <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 max-w-7xl py-12">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#5a5a56] hover:text-[#5a5a56]/70 transition-colors mb-8"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Collection
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-[#f9f8f5] border border-[#5a5a56]/10 p-8">
              <div className="aspect-square relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.name} Linen ${product.type.charAt(0).toUpperCase() + product.type.slice(1)}`}
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h1 className="font-mulish text-2xl md:text-3xl font-light tracking-widest uppercase text-[#5a5a56] mb-2">
                  {product.name} {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                </h1>
                <p className="text-lg font-medium text-[#5a5a56]">£{product.price}</p>
              </div>

              <div className="space-y-4">
                <p className="font-mulish font-light text-[#5a5a56]/80 text-sm leading-relaxed">
                  {product.type === "shirt"
                    ? "Our signature shirt captures the spirit of Southern Italy through thoughtful tailoring and refined detail. The clean, single-placket front flows into the soft roll of the paramontura collar, echoed by curved cuffs fastened with genuine mother-of-pearl buttons."
                    : "Our pleated linen trousers are a quiet study in refinement. A single forward pleat introduces movement through the front, while the waistband combines a clean, classic front with discrete elastic at the back for added comfort."}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#5a5a56]">Material</p>
                  <p className="text-sm text-[#5a5a56]/70">100% Premium Italian Linen</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#5a5a56]">Care Instructions</p>
                  <p className="text-sm text-[#5a5a56]/70">Dry clean recommended. Machine wash cold if needed.</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#5a5a56]">Size</p>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border transition-all duration-200 ${
                        selectedSize === size
                          ? "border-[#5a5a56] bg-[#5a5a56] text-white"
                          : "border-[#5a5a56]/20 text-[#5a5a56] hover:border-[#5a5a56]/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <div className="pt-4">
                <SlidingButton onClick={addToCart} variant="dark" duration={800} className="w-full py-4 text-sm">
                  Add to Cart
                </SlidingButton>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t border-[#5a5a56]/10 space-y-2">
                <p className="text-xs text-[#5a5a56]/70">• Handcrafted in Italy</p>
                <p className="text-xs text-[#5a5a56]/70">• 2-3 weeks production time</p>
                <p className="text-xs text-[#5a5a56]/70">• Free worldwide shipping</p>
                <p className="text-xs text-[#5a5a56]/70">• Made to order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
