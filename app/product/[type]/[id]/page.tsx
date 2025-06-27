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
  { name: "White", color: "#f5f5f5", image: "/images/shirts/new-white-linen-shirt.png", price: 325 },
  { name: "Black", color: "#2a2a33", image: "/images/shirts/new-black-linen-shirt.png", price: 325 },
  { name: "Navy", color: "#2d2a3e", image: "/images/shirts/new-navy-linen-shirt.png", price: 325 },
  { name: "Sky Blue", color: "#c9d7e8", image: "/images/shirts/new-sky-blue-linen-shirt.png", price: 325 },
  { name: "Pink", color: "#e7d0d3", image: "/images/shirts/new-pink-linen-shirt.png", price: 325 },
  { name: "Sage", color: "#9ca594", image: "/images/shirts/new-sage-linen-shirt.png", price: 325 },
]

const TROUSER_COLORS = [
  { name: "Natural", color: "#eae7d9", image: "/cream-linen-trousers-new.png", price: 325 },
  { name: "White", color: "#f5f5f5", image: "/white-linen-trousers.png", price: 325 },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-trousers-new.png", price: 325 },
  { name: "Black", color: "#2a2a33", image: "/black-linen-trousers-new.png", price: 325 },
]

// Size data
const SHIRT_SIZES = [
  { size: "XS", measurement: "14.5" },
  { size: "S", measurement: "15" },
  { size: "M", measurement: "15.5" },
  { size: "L", measurement: "16.5" },
  { size: "XL", measurement: "17.5" },
]

const TROUSER_SIZES = [
  { size: "XS", measurement: "28–30" },
  { size: "S", measurement: "30–32" },
  { size: "M", measurement: "32–34" },
  { size: "L", measurement: "34–36" },
  { size: "XL", measurement: "36–38" },
]

interface SizeChartModalProps {
  isOpen: boolean
  onClose: () => void
  productType: "shirt" | "trouser"
}

function SizeChartModal({ isOpen, onClose, productType }: SizeChartModalProps) {
  const sizes = productType === "shirt" ? SHIRT_SIZES : TROUSER_SIZES
  const measurementType = productType === "shirt" ? "Neck" : "Waist"

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-light uppercase tracking-wider text-[#5a5a56]">
              {productType === "shirt" ? "Shirt" : "Trouser"} Size Guide
            </h3>
            <button
              onClick={onClose}
              className="text-[#5a5a56]/70 hover:text-[#5a5a56] transition-colors"
              aria-label="Close size chart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-[#f9f8f5] p-4 rounded">
            <h4 className="text-[#5a5a56] font-normal mb-3 text-sm uppercase tracking-wider text-center">
              {productType === "shirt" ? "Shirts" : "Trousers"} ({measurementType} Size in Inches)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-2 px-3 border-b border-[#e0ddd2] text-center text-sm font-normal text-[#5a5a56]">
                      Size
                    </th>
                    <th className="py-2 px-3 border-b border-[#e0ddd2] text-center text-sm font-normal text-[#5a5a56]">
                      {measurementType}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((item, index) => (
                    <tr key={index}>
                      <td
                        className={`py-2 px-3 ${index < sizes.length - 1 ? "border-b border-[#e0ddd2]" : ""} text-sm text-center text-[#5a5a56]`}
                      >
                        {item.size}
                      </td>
                      <td
                        className={`py-2 px-3 ${index < sizes.length - 1 ? "border-b border-[#e0ddd2]" : ""} text-sm text-center text-[#5a5a56]`}
                      >
                        {item.measurement}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-xs text-[#5a5a56]/70 text-center">
            <p>All measurements are in inches. For custom fitting, please visit our Mayfair showroom.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState("M")
  const [productType, setProductType] = useState<"shirt" | "trouser">("shirt")
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    const { type, id } = params
    const productId = Number.parseInt(id as string)

    if (type === "shirt" && productId >= 0 && productId < SHIRT_COLORS.length) {
      setProductType("shirt")
      setSelectedColorIndex(productId)
      setProduct({ ...SHIRT_COLORS[productId], type: "shirt", id: productId })
    } else if (type === "trouser" && productId >= 0 && productId < TROUSER_COLORS.length) {
      setProductType("trouser")
      setSelectedColorIndex(productId)
      setProduct({ ...TROUSER_COLORS[productId], type: "trouser", id: productId })
    } else {
      router.push("/")
    }
  }, [params, router])

  const handleColorChange = (colorIndex: number) => {
    const colors = productType === "shirt" ? SHIRT_COLORS : TROUSER_COLORS
    const newProduct = { ...colors[colorIndex], type: productType, id: colorIndex }

    // Update state immediately for responsive UI
    setSelectedColorIndex(colorIndex)
    setProduct(newProduct)

    // Update URL without page reload
    const newUrl = `/product/${productType}/${colorIndex}`
    window.history.replaceState({}, "", newUrl)
  }

  const addToCart = () => {
    const cartItem = {
      type: product.type,
      [`${product.type}Index`]: selectedColorIndex,
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

    // If it's a shirt, redirect to shirt customization
    if (product.type === "shirt") {
      localStorage.setItem(
        "pendingShirtCustomization",
        JSON.stringify({
          type: "individual",
          shirtIndex: selectedColorIndex,
        }),
      )
      router.push("/customize-shirt")
    } else {
      // Show success message for trousers and stay on page
      router.push("/shop")
    }
  }

  const sizes = ["XS", "S", "M", "L", "XL"]
  const colors = productType === "shirt" ? SHIRT_COLORS : TROUSER_COLORS

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

      {/* Size Chart Modal */}
      <SizeChartModal isOpen={showSizeChart} onClose={() => setShowSizeChart(false)} productType={productType} />

      {/* Main Content */}
      <div className="pt-[70px]">
        <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-20 max-w-7xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-[#f9f8f5] p-8">
              <div className="aspect-square relative overflow-hidden">
                <div className="absolute inset-0 transition-opacity duration-300">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={`${product.name} Linen ${product.type.charAt(0).toUpperCase() + product.type.slice(1)}`}
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                    className="transition-opacity duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h1 className="font-mulish text-2xl md:text-3xl font-light tracking-widest uppercase text-[#5a5a56] mb-2">
                  {product.name}
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

              {/* Color Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#5a5a56]">Color</p>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <button
                        onClick={() => handleColorChange(index)}
                        className={`w-6 h-6 rounded-full transition-all duration-300 ease-out transform ${
                          selectedColorIndex === index
                            ? "ring-2 ring-[#5a5a56] ring-offset-2 scale-110 shadow-lg"
                            : "hover:scale-105 hover:shadow-md"
                        }`}
                        style={{ backgroundColor: color.color }}
                        aria-label={`Select ${color.name}`}
                      />
                      <span
                        className={`text-xs mt-1 transition-colors duration-200 ${
                          selectedColorIndex === index ? "text-[#5a5a56] font-medium" : "text-[#5a5a56]/70"
                        }`}
                      >
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#5a5a56]">Size</p>
                  <button
                    onClick={() => setShowSizeChart(true)}
                    className="text-xs text-[#5a5a56]/70 hover:text-[#5a5a56] underline transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
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
