"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import NavigationMenu from "@/components/navigation-menu"
import SlidingButton from "@/components/sliding-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Product data
const SHIRT_PRICE = 325
const TROUSER_PRICE = 325
const SET_PRICE = 600

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

const SUGGESTED_COMBINATIONS = [
  { id: "combo-0", shirt: 0, trouser: 0, name: "Classic Natural", price: SET_PRICE },
  { id: "combo-1", shirt: 1, trouser: 3, name: "Monochrome", price: SET_PRICE },
  { id: "combo-2", shirt: 2, trouser: 0, name: "Mediterranean", price: SET_PRICE },
  { id: "combo-3", shirt: 3, trouser: 1, name: "Coastal", price: SET_PRICE },
  { id: "combo-4", shirt: 4, trouser: 0, name: "Sunset", price: SET_PRICE },
  { id: "combo-5", shirt: 5, trouser: 3, name: "Earth Tones", price: SET_PRICE },
]

type ViewMode = "sets" | "shirts" | "trousers"
type CartItem = {
  type: "shirt" | "trouser" | "set"
  shirtIndex?: number
  trouserIndex?: number
  setIndex?: number
  customSetShirtIndex?: number
  customSetTrouserIndex?: number
  quantity: number
}

interface ProductCarouselProps {
  products: any[]
  type: "shirt" | "trouser"
  onAddToCart: (type: "shirt" | "trouser", index: number) => void
}

function ProductCarousel({ products, type, onAddToCart }: ProductCarouselProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(products.length >= 3 ? 1 : 0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Enhanced dimensions and spacing for smoother experience
  const ITEM_WIDTH_CENTER = 520
  const ITEM_HEIGHT_CENTER = 693
  const ITEM_WIDTH_SIDE = 416
  const ITEM_HEIGHT_SIDE = 555
  const ITEM_GAP = 48
  const TRANSITION_DURATION = 800 // Increased for smoother feel
  const SMOOTH_EASING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)" // More fluid easing

  // Auto-play with pause on hover
  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => {
      if (!isTransitioning) {
        changeSlide((currentIndex + 1) % products.length)
      }
    }, 4500)
  }

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = null
    }
  }

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [currentIndex, isTransitioning, products.length])

  const changeSlide = (newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return

    setIsTransitioning(true)
    setCurrentIndex(newIndex)

    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsTransitioning(false)
      }, TRANSITION_DURATION)
    })
  }

  const handleProductClick = (index: number) => {
    if (index === currentIndex) {
      router.push(`/product/${type}/${index}`)
    } else {
      changeSlide(index)
    }
  }

  const calculateOffset = () => {
    if (!carouselRef.current) return 0
    const containerWidth = carouselRef.current.offsetWidth
    let offsetToCenterOfCurrentItem = 0

    // Calculate offset to center the current item with smooth positioning
    for (let i = 0; i < currentIndex; i++) {
      offsetToCenterOfCurrentItem += ITEM_WIDTH_SIDE + ITEM_GAP
    }
    offsetToCenterOfCurrentItem += ITEM_WIDTH_CENTER / 2

    return containerWidth / 2 - offsetToCenterOfCurrentItem
  }

  return (
    <div
      className="relative w-full max-w-7xl mx-auto py-12 overflow-hidden"
      ref={carouselRef}
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div
        className="flex items-center will-change-transform"
        style={{
          transform: `translateX(${calculateOffset()}px)`,
          transitionProperty: "transform",
          transitionDuration: `${TRANSITION_DURATION}ms`,
          transitionTimingFunction: SMOOTH_EASING,
        }}
      >
        {products.map((product, index) => {
          const isCenter = index === currentIndex
          const distance = Math.abs(index - currentIndex)

          // Enhanced scaling and opacity for smoother visual hierarchy
          const scale = isCenter ? 1 : Math.max(0.85, 1 - distance * 0.1)
          const opacity = isCenter ? 1 : Math.max(0.7, 1 - distance * 0.15)
          const zIndex = isCenter ? 20 : Math.max(1, 10 - distance)

          const itemWidth = isCenter ? ITEM_WIDTH_CENTER : ITEM_WIDTH_SIDE
          const itemHeight = isCenter ? ITEM_HEIGHT_CENTER : ITEM_HEIGHT_SIDE

          return (
            <div
              key={`${product.image}-${index}`}
              className="relative flex-shrink-0 cursor-pointer flex items-center justify-center will-change-transform"
              style={{
                width: `${itemWidth}px`,
                height: `${itemHeight}px`,
                marginRight: `${ITEM_GAP}px`,
                transform: `scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                transitionProperty: "transform, opacity",
                transitionDuration: `${TRANSITION_DURATION}ms`,
                transitionTimingFunction: SMOOTH_EASING,
              }}
              onClick={() => handleProductClick(index)}
            >
              <div className="relative w-full h-full">
                <div className={`transition-all duration-300 ${isCenter ? "hover:scale-105" : "hover:scale-102"}`}>
                  <Image
                    src={
                      product.image || `/placeholder.svg?width=${itemWidth}&height=${itemHeight}&query=linen+product`
                    }
                    alt={`${product.name} Linen ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                    fill
                    style={{ objectFit: "contain" }}
                    className="transition-transform duration-500 ease-out"
                    priority={isCenter || distance <= 1}
                    sizes={`(max-width: 768px) 100vw, ${itemWidth}px`}
                  />
                </div>

                {/* Enhanced visual feedback for center item */}
                {isCenter && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Enhanced pagination dots with smooth transitions */}
      <div className="flex justify-center space-x-3 mt-8 md:mt-12">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            disabled={isTransitioning}
            className={`transition-all duration-500 ease-out rounded-full ${
              index === currentIndex
                ? "bg-[#5a5a56] w-10 h-3 shadow-sm"
                : "bg-[#5a5a56]/30 hover:bg-[#5a5a56]/50 w-3 h-3 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Optional: Add subtle navigation arrows for manual control */}
      <button
        onClick={() => changeSlide((currentIndex - 1 + products.length) % products.length)}
        disabled={isTransitioning}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 z-30"
        aria-label="Previous product"
      >
        <svg className="w-5 h-5 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => changeSlide((currentIndex + 1) % products.length)}
        disabled={isTransitioning}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 z-30"
        aria-label="Next product"
      >
        <svg className="w-5 h-5 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default function ShopPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ViewMode>("shirts")
  const [viewMode, setViewMode] = useState<ViewMode>("shirts")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedShirt, setSelectedShirt] = useState(0)
  const [selectedTrouser, setSelectedTrouser] = useState(3)
  const [selectedCombinationId, setSelectedCombinationId] = useState<string>("")

  useEffect(() => {
    const savedCart = localStorage.getItem("eternoCart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse saved cart", e)
      }
    }
    const initialCombo = SUGGESTED_COMBINATIONS.find((c) => c.shirt === selectedShirt && c.trouser === selectedTrouser)
    if (initialCombo) {
      setSelectedCombinationId(initialCombo.id)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("eternoCart", JSON.stringify(cart))
  }, [cart])

  const handleSuggestedCombinationChange = (comboId: string) => {
    const combination = SUGGESTED_COMBINATIONS.find((c) => c.id === comboId)
    if (combination) {
      setSelectedShirt(combination.shirt)
      setSelectedTrouser(combination.trouser)
      setSelectedCombinationId(comboId)
    } else {
      setSelectedCombinationId("")
    }
  }

  const addItemToCart = (itemToAdd: CartItem) => {
    setCart((prevCart) => {
      let existingItemIndex = -1
      if (itemToAdd.type === "set") {
        if (itemToAdd.setIndex !== undefined) {
          existingItemIndex = prevCart.findIndex((item) => item.type === "set" && item.setIndex === itemToAdd.setIndex)
        } else {
          existingItemIndex = prevCart.findIndex(
            (item) =>
              item.type === "set" &&
              item.customSetShirtIndex === itemToAdd.customSetShirtIndex &&
              item.customSetTrouserIndex === itemToAdd.customSetTrouserIndex,
          )
        }
      } else if (itemToAdd.type === "shirt") {
        existingItemIndex = prevCart.findIndex(
          (item) => item.type === "shirt" && item.shirtIndex === itemToAdd.shirtIndex,
        )
      } else if (itemToAdd.type === "trouser") {
        existingItemIndex = prevCart.findIndex(
          (item) => item.type === "trouser" && item.trouserIndex === itemToAdd.trouserIndex,
        )
      }

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += 1
        return updatedCart
      } else {
        return [...prevCart, { ...itemToAdd, quantity: 1 }]
      }
    })
  }

  const addSetFromPanelToCart = () => {
    const matchedSuggestedCombo = SUGGESTED_COMBINATIONS.find(
      (combo) => combo.shirt === selectedShirt && combo.trouser === selectedTrouser,
    )
    let itemToAdd: CartItem
    if (matchedSuggestedCombo) {
      const setIndex = SUGGESTED_COMBINATIONS.findIndex((c) => c.id === matchedSuggestedCombo.id)
      itemToAdd = { type: "set", setIndex, quantity: 1 }
    } else {
      itemToAdd = {
        type: "set",
        customSetShirtIndex: selectedShirt,
        customSetTrouserIndex: selectedTrouser,
        quantity: 1,
      }
    }

    // Add to cart
    addItemToCart(itemToAdd)

    // Redirect to shirt customization for the set
    localStorage.setItem(
      "pendingShirtCustomization",
      JSON.stringify({
        type: "set",
        shirtIndex: selectedShirt,
        setData: itemToAdd,
      }),
    )
    router.push("/customize-shirt")
  }

  const addIndividualItemToCart = (type: "shirt" | "trouser", index: number) => {
    const itemToAdd: CartItem = { type, quantity: 1 }
    if (type === "shirt") itemToAdd.shirtIndex = index
    if (type === "trouser") itemToAdd.trouserIndex = index

    // Add to cart
    addItemToCart(itemToAdd)

    // If it's a shirt, redirect to shirt customization
    if (type === "shirt") {
      localStorage.setItem(
        "pendingShirtCustomization",
        JSON.stringify({
          type: "individual",
          shirtIndex: index,
        }),
      )
      router.push("/customize-shirt")
    }
  }

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0)

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      let itemPrice = 0
      if (item.type === "shirt" && item.shirtIndex !== undefined) {
        itemPrice = SHIRT_COLORS[item.shirtIndex].price
      } else if (item.type === "trouser" && item.trouserIndex !== undefined) {
        itemPrice = TROUSER_COLORS[item.trouserIndex].price
      } else if (item.type === "set") {
        itemPrice = SET_PRICE
      }
      return total + itemPrice * item.quantity
    }, 0)
  }

  const proceedToCustomization = () => {
    localStorage.setItem("eternoCart", JSON.stringify(cart))
    router.push("/customize")
  }

  const handleTabChange = (tab: ViewMode) => {
    setActiveTab(tab)
    setViewMode(tab)
  }

  return (
    <div className="min-h-screen bg-white font-mulish">
      <NavigationMenu logoWidth="45mm" />
      <div className="pt-[70px]">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 max-w-full py-12">
          <div className="text-center mb-12">
            <h1 className="text-lg sm:text-xl md:text-2xl font-light tracking-[0.15em] uppercase text-[#5a5a56] mb-4">
              COLLECTION
            </h1>
            <p className="font-light text-[#5a5a56]/80 text-sm md:text-base max-w-2xl mx-auto">
              Handcrafted Italian linen pieces designed for the modern gentleman. Each piece tells a story of timeless
              elegance.
            </p>
          </div>
          <div className="flex justify-center mb-12">
            <div className="border-b border-[#5a5a56]/20 flex space-x-4 md:space-x-8">
              {["shirts", "trousers", "sets"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab as ViewMode)}
                  className={`px-3 md:px-4 py-3 text-xs md:text-sm font-light uppercase tracking-wider transition-colors duration-300 relative ${
                    activeTab === tab ? "text-[#5a5a56]" : "text-[#5a5a56]/50 hover:text-[#5a5a56]/70"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5a5a56] transform -translate-y-px"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {viewMode === "sets" && (
            <div className="mb-16 max-w-7xl mx-auto px-4">
              <div className="bg-white shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-[#5a5a56]/10">
                  <h3 className="font-light text-xl tracking-[0.1em] uppercase text-[#5a5a56]">Create Your Set</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  <div className="lg:col-span-2 p-6 md:p-8 flex items-center justify-center">
                    <div className="aspect-[4/3] relative w-full max-w-3xl">
                      <div className="grid grid-cols-2 h-full gap-2">
                        <div className="relative">
                          <Image
                            src={SHIRT_COLORS[selectedShirt].image || "/placeholder.svg"}
                            alt={`${SHIRT_COLORS[selectedShirt].name} Shirt`}
                            fill
                            style={{ objectFit: "contain" }}
                            priority
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 30vw"
                          />
                        </div>
                        <div className="relative">
                          <Image
                            src={TROUSER_COLORS[selectedTrouser].image || "/placeholder.svg"}
                            alt={`${TROUSER_COLORS[selectedTrouser].name} Trousers`}
                            fill
                            style={{ objectFit: "contain" }}
                            priority
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 30vw"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:border-l lg:border-[#5a5a56]/10 flex flex-col">
                    <div className="p-6 md:p-8 space-y-6">
                      <div>
                        <h4 className="font-light text-sm uppercase tracking-wider text-[#5a5a56]/90 mb-3">
                          Select Shirt:{" "}
                          <span className="font-normal text-[#5a5a56]">{SHIRT_COLORS[selectedShirt].name}</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {SHIRT_COLORS.map((shirt, index) => (
                            <button
                              key={shirt.name}
                              onClick={() => {
                                setSelectedShirt(index)
                                const csId =
                                  SUGGESTED_COMBINATIONS.find((c) => c.shirt === index && c.trouser === selectedTrouser)
                                    ?.id || ""
                                setSelectedCombinationId(csId)
                              }}
                              className={`w-8 h-8 rounded-full transition-all duration-200 border-2 ${
                                selectedShirt === index
                                  ? "ring-2 ring-offset-1 ring-[#5a5a56] border-transparent"
                                  : "border-gray-300/70 hover:border-[#5a5a56]/50"
                              }`}
                              style={{ backgroundColor: shirt.color }}
                              aria-label={`${shirt.name} shirt color`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-light text-sm uppercase tracking-wider text-[#5a5a56]/90 mb-3">
                          Select Trouser:{" "}
                          <span className="font-normal text-[#5a5a56]">{TROUSER_COLORS[selectedTrouser].name}</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {TROUSER_COLORS.map((trouser, index) => (
                            <button
                              key={trouser.name}
                              onClick={() => {
                                setSelectedTrouser(index)
                                const csId =
                                  SUGGESTED_COMBINATIONS.find((c) => c.shirt === selectedShirt && c.trouser === index)
                                    ?.id || ""
                                setSelectedCombinationId(csId)
                              }}
                              className={`w-8 h-8 rounded-full transition-all duration-200 border-2 ${
                                selectedTrouser === index
                                  ? "ring-2 ring-offset-1 ring-[#5a5a56] border-transparent"
                                  : "border-gray-300/70 hover:border-[#5a5a56]/50"
                              }`}
                              style={{ backgroundColor: trouser.color }}
                              aria-label={`${trouser.name} trouser color`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 border-t border-[#5a5a56]/10">
                      <label
                        htmlFor="suggested-set-select"
                        className="block font-light text-sm uppercase tracking-wider text-[#5a5a56]/90 mb-3"
                      >
                        Or Start with a Suggested Set:
                      </label>
                      <Select onValueChange={handleSuggestedCombinationChange} value={selectedCombinationId}>
                        <SelectTrigger
                          id="suggested-set-select"
                          className="w-full bg-transparent border-gray-300/70 text-[#5a5a56] font-light focus:ring-[#5a5a56]/50 focus:border-[#5a5a56]/50 rounded-none"
                        >
                          <SelectValue placeholder="Select a combination..." className="font-light" />
                        </SelectTrigger>
                        <SelectContent className="font-mulish rounded-none">
                          {SUGGESTED_COMBINATIONS.map((combo) => (
                            <SelectItem key={combo.id} value={combo.id} className="font-light text-sm">
                              {combo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-6 md:p-8 border-t border-[#5a5a56]/10 mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-light text-sm text-[#5a5a56]">Total Price</span>
                        <span className="text-lg font-medium text-[#5a5a56]">£{SET_PRICE}</span>
                      </div>
                      <SlidingButton
                        onClick={addSetFromPanelToCart}
                        variant="dark"
                        duration={800}
                        className="w-full py-3 text-sm font-light tracking-wider"
                      >
                        Add to Cart
                      </SlidingButton>
                      <p className="text-xs text-[#5a5a56]/70 mt-2 text-center font-light">
                        {SHIRT_COLORS[selectedShirt].name} Shirt &amp; {TROUSER_COLORS[selectedTrouser].name} Trousers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === "shirts" && (
            <div className="mb-16">
              <ProductCarousel products={SHIRT_COLORS} type="shirt" onAddToCart={addIndividualItemToCart} />
            </div>
          )}
          {viewMode === "trousers" && (
            <div className="mb-16">
              <ProductCarousel products={TROUSER_COLORS} type="trouser" onAddToCart={addIndividualItemToCart} />
            </div>
          )}

          {cart.length > 0 && (
            <div className="bg-[#f9f8f5] border border-[#5a5a56]/10 shadow-sm p-6 md:p-8 mb-8 max-w-7xl mx-auto">
              <h3 className="font-light text-lg tracking-[0.1em] uppercase text-[#5a5a56] mb-4">Cart Summary</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="font-light text-sm text-[#5a5a56]">{getTotalItems()} item(s)</span>
                <span className="text-lg font-medium text-[#5a5a56]">£{getTotalPrice()}</span>
              </div>
              <SlidingButton
                onClick={proceedToCustomization}
                variant="dark"
                duration={800}
                className="w-full py-3 text-sm font-light tracking-wider"
              >
                Proceed to Customization
              </SlidingButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
