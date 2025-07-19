"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import NavigationMenu from "@/components/navigation-menu"
import SlidingButton from "@/components/sliding-button"
import { useIsMobile } from "@/hooks/use-mobile"
import MinimalistFooter from "@/components/minimalist-footer"

// Product data
const SHIRT_PRICE = 325
const TROUSER_PRICE = 325

const SHIRT_COLORS = [
  { name: "White", color: "#f5f5f5", image: "/images/shirts/new-white-linen-shirt.png", price: SHIRT_PRICE },
  { name: "Black", color: "#2a2a33", image: "/images/shirts/new-black-linen-shirt.png", price: SHIRT_PRICE },
  { name: "Navy", color: "#2d2a3e", image: "/images/shirts/new-navy-linen-shirt.png", price: SHIRT_PRICE },
  { name: "Sky Blue", color: "#c9d7e8", image: "/images/shirts/new-sky-blue-linen-shirt.png", price: SHIRT_PRICE },
  { name: "Pink", color: "#e7d0d3", image: "/images/shirts/new-pink-linen-shirt.png", price: SHIRT_PRICE },
  { name: "Sage", color: "#9ca594", image: "/images/shirts/new-sage-linen-shirt.png", price: SHIRT_PRICE },
]

const TROUSER_COLORS = [
  { name: "Natural", color: "#eae7d9", image: "/cream-linen-trousers-new.png", price: TROUSER_PRICE },
  { name: "White", color: "#f5f5f5", image: "/white-linen-trousers.png", price: TROUSER_PRICE },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-trousers-new.png", price: TROUSER_PRICE },
  { name: "Black", color: "#2a2a33", image: "/black-linen-trousers-new.png", price: TROUSER_PRICE },
]

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Safely extract parameters
  const type = Array.isArray(params.type) ? params.type[0] : params.type
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id

  // Get product data based on type
  const products = type === "shirt" ? SHIRT_COLORS : type === "trouser" ? TROUSER_COLORS : []
  const id = Number.parseInt(idParam, 10)
  const isValidType = type === "shirt" || type === "trouser"
  const isValidId = !isNaN(id) && id >= 0
  const isValidProductId = isValidId && id < products.length

  const currentProduct = products[selectedColorIndex]

  // Reset image states when color changes
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [selectedColorIndex])

  // Initialize component
  useEffect(() => {
    // Only proceed if we have valid parameters
    if (!isValidType) {
      console.warn("Invalid product type, redirecting to shop")
      router.push("/shop")
      return
    }

    if (!isValidProductId) {
      console.warn("Invalid product ID, redirecting to first product")
      router.replace(`/product/${type}/0`)
      return
    }

    // Set initial state
    setSelectedColorIndex(id)
    setIsInitialized(true)
  }, [type, id, isValidType, isValidProductId, router])

  // Don't render if not initialized or invalid parameters
  if (!isInitialized || !isValidType || !isValidProductId) {
    return (
      <div className="min-h-screen bg-white font-mulish">
        <NavigationMenu logoWidth={isMobile ? "35mm" : "45mm"} />
        <div className="pt-[70px]">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#5a5a56]">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle color selection
  const handleColorChange = (colorIndex: number) => {
    setSelectedColorIndex(colorIndex)
    router.replace(`/product/${type}/${colorIndex}`, { scroll: false })
  }

  const handleEnquire = () => {
    if (!currentProduct || !type) return

    const productType = type.charAt(0).toUpperCase() + type.slice(1)
    const subject = `Enquiry: ${currentProduct.name} ${productType}`
    const body = `Hello,

I would like to enquire about the following item:

Product: ${currentProduct.name} ${productType}
Price: £${currentProduct.price}
${selectedSize ? `Size: ${selectedSize}` : "Size: Not selected"}

Please provide more information about availability and ordering.

Thank you.`

    const mailtoLink = `mailto:enquiries@eternotailoring.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  const handleBackToShop = () => {
    router.push("/shop")
  }

  return (
    <div className="min-h-screen bg-white font-mulish">
      <NavigationMenu logoWidth={isMobile ? "35mm" : "45mm"} />
      <div className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-[500px] md:h-[600px]">
                {!imageError && (
                  <div
                    className={`transition-opacity duration-300 w-full h-full ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    style={{
                      filter:
                        "drop-shadow(0 25px 35px rgba(0, 0, 0, 0.15)) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))",
                    }}
                  >
                    <Image
                      src={currentProduct.image || "/placeholder.svg"}
                      alt={`${currentProduct.name} Linen ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "contain" }}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                      priority
                    />
                  </div>
                )}
                {(imageError || (!imageLoaded && !imageError)) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    {imageError ? (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#5a5a56]/10 border-0 flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-[#5a5a56]/50" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-[#5a5a56]/70">Product Image</p>
                      </div>
                    ) : (
                      <div className="w-8 h-8 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-light text-[#5a5a56] uppercase tracking-wider mb-2">
                  {currentProduct.name}
                </h1>
                <p className="text-sm uppercase tracking-wider text-[#5a5a56]/70 mb-4">
                  Linen {type.charAt(0).toUpperCase() + type.slice(1)}
                </p>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-[#5a5a56] mb-4 font-light">Color</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex gap-3">
                    {products.map((product, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorChange(index)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedColorIndex === index
                            ? "border-[#5a5a56] ring-2 ring-[#5a5a56]/20 scale-110"
                            : "border-[#5a5a56]/30 hover:border-[#5a5a56]/50 hover:scale-105"
                        }`}
                        style={{ backgroundColor: product.color }}
                        aria-label={`Select ${product.name} color`}
                        title={product.name}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#5a5a56] font-light">{currentProduct.name}</span>
                </div>
              </div>

              <div>
                <p className="text-2xl font-medium text-[#5a5a56] mb-2">£{currentProduct.price}</p>
                <p className="text-xs text-[#5a5a56]/70">Handcrafted in Italy</p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-[#5a5a56] mb-4 font-light">Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 text-sm font-light transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-[#5a5a56] text-white"
                          : "bg-white border border-[#5a5a56]/30 text-[#5a5a56] hover:border-[#5a5a56]/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Description */}
              <div>
                <p className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-sm">
                  {type === "shirt"
                    ? "Our signature shirt reimagined in pure monochrome. The clean, single-placket front flows into the soft roll of the paramontura collar, echoed by curved cuffs fastened with genuine mother-of-pearl buttons."
                    : "Our pleated linen trousers refined to their purest form. A single forward pleat introduces movement through the front, while the waistband combines a clean, classic front with discrete elastic at the back."}
                </p>
              </div>

              {/* Enquire Button */}
              <div className="pt-4">
                <SlidingButton onClick={handleEnquire} variant="dark" duration={1000} className="w-full py-4 text-sm">
                  ENQUIRE
                </SlidingButton>
                <p className="text-xs mt-3 text-[#5a5a56]/70 text-center">
                  Click to send an enquiry email about this product
                </p>
              </div>

              {/* Back to Collection */}
              <div className="pt-4 border-t border-[#e0ddd2]">
                <button
                  onClick={handleBackToShop}
                  className="text-xs uppercase tracking-wider text-[#5a5a56]/70 hover:text-[#5a5a56] transition-colors duration-200"
                >
                  ← Back to Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MinimalistFooter />
    </div>
  )
}
