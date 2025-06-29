"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import NavigationMenu from "@/components/navigation-menu"
import SlidingButton from "@/components/sliding-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"

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

type ViewMode = "sets" | "shirts" | "trousers" | "tailoring"

function SignatureShirtSection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <h3 className="text-[#5a5a56] font-normal text-lg uppercase tracking-wider">SIGNATURE SHIRT</h3>
          <p className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-sm max-w-md">
            Our signature shirt reimagined in pure monochrome. The clean, single-placket front flows into the soft roll
            of the paramontura collar, echoed by curved cuffs fastened with genuine mother-of-pearl buttons. A study in
            timeless elegance.
          </p>
        </div>
      </div>
    </section>
  )
}

function SignatureTrouserSection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <h3 className="text-[#5a5a56] font-normal text-lg uppercase tracking-wider">SIGNATURE TROUSER</h3>
          <p className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-sm max-w-md">
            Our pleated linen trousers refined to their purest form. A single forward pleat introduces movement through
            the front, while the waistband combines a clean, classic front with discrete elastic at the back. Monochrome
            sophistication.
          </p>
        </div>
      </div>
    </section>
  )
}

interface ProductCarouselProps {
  products: any[]
  type: "shirt" | "trouser"
}

function ProductCarousel({ products, type }: ProductCarouselProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(products.length >= 3 ? 1 : 0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const DESKTOP_SECTION_HEIGHT = 650
  const ITEM_WIDTH_CENTER = isMobile ? 280 : 420
  const ITEM_HEIGHT_CENTER = isMobile ? 350 : 500
  const ITEM_WIDTH_SIDE = ITEM_WIDTH_CENTER * (isMobile ? 0.7 : 0.8)
  const ITEM_HEIGHT_SIDE = ITEM_HEIGHT_CENTER * (isMobile ? 0.7 : 0.8)
  const ITEM_GAP = isMobile ? 16 : 32
  const TRANSITION_DURATION = 500
  const AUTO_PLAY_INTERVAL = 6000

  useEffect(() => {
    if (products.length <= 1) return
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentIndex((prev) => (prev + 1) % products.length)
      }
    }, AUTO_PLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [currentIndex, isTransitioning, products.length])

  const changeSlide = (newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex || newIndex < 0 || newIndex >= products.length) return
    setIsTransitioning(true)
    setCurrentIndex(newIndex)
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION)
  }

  const handleProductClick = (index: number) => {
    if (isTransitioning) return
    if (index !== currentIndex) {
      changeSlide(index)
    } else {
      router.push(`/product/${type}/${index}`)
    }
  }

  const calculateOffset = () => {
    if (!carouselRef.current) return 0
    const containerWidth = carouselRef.current.offsetWidth
    let offsetToCenterOfCurrentItem = 0
    for (let i = 0; i < currentIndex; i++) {
      offsetToCenterOfCurrentItem += ITEM_WIDTH_SIDE + ITEM_GAP
    }
    offsetToCenterOfCurrentItem += ITEM_WIDTH_CENTER / 2
    return containerWidth / 2 - offsetToCenterOfCurrentItem
  }

  return (
    <section className="w-full py-16 border-b border-[#f0f0f0]">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative w-full overflow-hidden"
          ref={carouselRef}
          style={{ height: `${DESKTOP_SECTION_HEIGHT}px` }}
        >
          <div
            className="flex items-center transition-transform ease-out h-full"
            style={{
              transform: `translateX(${calculateOffset()}px)`,
              transitionDuration: `${TRANSITION_DURATION}ms`,
              transitionProperty: "transform",
            }}
          >
            {products.map((product, index) => {
              const isCenter = index === currentIndex
              const distance = Math.abs(index - currentIndex)
              const scale = isCenter ? 1 : Math.max(0.75, 1 - distance * 0.12)
              const opacity = isCenter ? 1 : Math.max(0.4, 1 - distance * 0.3)
              const zIndex = isCenter ? 20 : Math.max(1, 10 - distance)
              const itemWidth = isCenter ? ITEM_WIDTH_CENTER : ITEM_WIDTH_SIDE
              const itemHeight = isCenter ? ITEM_HEIGHT_CENTER : ITEM_HEIGHT_SIDE

              return (
                <div
                  key={`${product.name}-${index}`}
                  className="relative flex-shrink-0 cursor-pointer flex flex-col items-center justify-center transition-all ease-out"
                  style={{
                    width: `${itemWidth}px`,
                    height: `${itemHeight + 80}px`,
                    marginRight: `${ITEM_GAP}px`,
                    transform: `scale(${scale})`,
                    opacity: opacity,
                    zIndex: zIndex,
                    transitionDuration: `${TRANSITION_DURATION}ms`,
                    transitionProperty: "transform, opacity",
                  }}
                  onClick={() => handleProductClick(index)}
                >
                  <div
                    className="relative flex flex-col items-center justify-center"
                    style={{ width: itemWidth, height: itemHeight + 80 }}
                  >
                    <div
                      className="relative bg-transparent"
                      style={{
                        width: itemWidth,
                        height: itemHeight,
                        filter: isCenter
                          ? "drop-shadow(0 25px 35px rgba(0, 0, 0, 0.15)) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))"
                          : "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05))",
                      }}
                    >
                      <Image
                        src={
                          product.image ||
                          `/placeholder.svg?width=${itemWidth || "/placeholder.svg"}&height=${itemHeight}&query=linen+product`
                        }
                        alt={`${product.name} Linen ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                        fill
                        style={{ objectFit: "contain" }}
                        className="transition-none"
                        priority={isCenter || distance <= 1}
                        sizes={`(max-width: 768px) 100vw, ${itemWidth}px`}
                      />
                    </div>
                    <div className="mt-6 text-center">
                      <h3 className="text-[#5a5a56] font-normal text-sm uppercase tracking-wider mb-1">
                        {product.name}
                      </h3>
                      <div
                        className="w-4 h-4 border border-[#ddd] mx-auto mt-2"
                        style={{ backgroundColor: product.color }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => changeSlide(index)}
                disabled={isTransitioning}
                className={`transition-all duration-300 border-0 ${index === currentIndex ? "bg-[#5a5a56] w-8 h-3" : "bg-[#5a5a56]/30 hover:bg-[#5a5a56]/50 w-3 h-3"} rounded-full`}
                aria-label={`View ${products[index].name}`}
              />
            ))}
          </div>
          <button
            onClick={() => changeSlide((currentIndex - 1 + products.length) % products.length)}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white border-0 shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 z-30"
            aria-label="Previous product"
          >
            <svg className="w-5 h-5 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => changeSlide((currentIndex + 1) % products.length)}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white border-0 shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 z-30"
            aria-label="Next product"
          >
            <svg className="w-5 h-5 text-[#5a5a56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

function BoutiqueTailoringSection() {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row min-h-[500px] md:min-h-[600px]">
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
          <div
            className="relative w-full h-[300px] md:h-[450px]"
            style={{ filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15))" }}
          >
            <Image
              src="/images/vintage-italian-family-new.jpg"
              alt="Vintage Italian family portrait"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 space-y-6 text-center md:text-left">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#5a5a56]/70 mb-2">IN-PERSON SERVICE</p>
            <h3 className="text-[#5a5a56] font-normal text-lg uppercase tracking-wider">BOUTIQUE TAILORING</h3>
          </div>
          <p className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-sm max-w-md mx-auto md:mx-0">
            Our Mayfair showroom offers a refined setting for your personal tailoring experience. We provide in-person
            appointments for clients who wish to have their items fully tailored, or view our collection before
            purchasing. Once tailored, you will receive your bespoke garments in 4-6 weeks.
          </p>
          <div className="space-y-4">
            <Link
              href="https://maps.google.com/?q=Clifford+Street,+Mayfair,+London,+UK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white p-4 font-mulish text-[#5a5a56]/80 hover:bg-gray-50 transition-colors duration-300 border border-[#e0ddd2] shadow-sm"
            >
              <h4 className="text-[#5a5a56] font-normal mb-2 text-sm uppercase tracking-wider text-center">
                LOCATE US
              </h4>
              <p className="text-xs flex items-center justify-center">
                Clifford Street, Mayfair
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 ml-1"
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
          </div>
          <div className="pt-4">
            <div className={`flex ${isMobile ? "justify-center" : "justify-start"}`}>
              <SlidingButton
                onClick={() => router.push("/register")}
                variant="dark"
                duration={1000}
                className="min-w-[200px] py-3 text-sm"
              >
                ENQUIRE
              </SlidingButton>
            </div>
            <p className="text-xs mt-3 text-[#5a5a56]/70 max-w-xs mx-auto md:mx-0">
              Submit an enquiry and our team will contact you to discuss your order details.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function StyleCombinationsSection() {
  const [selectedShirt, setSelectedShirt] = useState(0)
  const [selectedTrouser, setSelectedTrouser] = useState(0)
  const [selectedCombinationId, setSelectedCombinationId] = useState<string>("")
  const [shirtImageLoaded, setShirtImageLoaded] = useState(false)
  const [trouserImageLoaded, setTrouserImageLoaded] = useState(false)
  const [shirtImageError, setShirtImageError] = useState(false)
  const [trouserImageError, setTrouserImageError] = useState(false)

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

  useEffect(() => {
    setShirtImageLoaded(false)
    setShirtImageError(false)
  }, [selectedShirt])

  useEffect(() => {
    setTrouserImageLoaded(false)
    setTrouserImageError(false)
  }, [selectedTrouser])

  return (
    <section className="w-full py-16 border-b border-[#f0f0f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[#5a5a56] font-normal text-base md:text-lg uppercase tracking-wider mb-3">
            Style Combinations
          </h2>
          <div className="w-20 h-px bg-[#5a5a56]/30 mx-auto mb-4"></div>
          <p className="font-mulish font-light text-[#5a5a56]/70 text-xs max-w-2xl mx-auto">
            Explore how our signature pieces work together to create the perfect ensemble.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Outfit Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 border-0 shadow-sm min-h-full flex flex-col">
              <div className="text-center mb-8">
                <h3 className="text-sm uppercase tracking-wider text-[#5a5a56] font-light mb-2">Current Selection</h3>
                <p className="text-xs text-[#5a5a56]/70">
                  {SHIRT_COLORS[selectedShirt].name} Shirt + {TROUSER_COLORS[selectedTrouser].name} Trousers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow min-h-[500px]">
                {/* Shirt Display */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs uppercase tracking-wider text-[#5a5a56] font-light">
                      {SHIRT_COLORS[selectedShirt].name} Shirt
                    </h4>
                  </div>
                  <div
                    className="relative flex-1 bg-white flex items-center justify-center shadow-md"
                    style={{
                      boxShadow: "0 10px 25px -8px rgba(0, 0, 0, 0.15), 0 4px 10px -4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {!shirtImageError && (
                      <div
                        className={`transition-opacity duration-300 w-full h-full ${shirtImageLoaded ? "opacity-100" : "opacity-0"}`}
                      >
                        <Image
                          src={SHIRT_COLORS[selectedShirt].image || "/placeholder.svg"}
                          alt={`${SHIRT_COLORS[selectedShirt].name} Linen Shirt`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: "contain", objectPosition: "center", padding: "20px" }}
                          onLoad={() => setShirtImageLoaded(true)}
                          onError={() => setShirtImageError(true)}
                          priority
                        />
                      </div>
                    )}
                    {(shirtImageError || (!shirtImageLoaded && !shirtImageError)) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {shirtImageError ? (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-[#5a5a56]/10 border-0 flex items-center justify-center mb-2">
                              <svg className="w-6 h-6 text-[#5a5a56]/50" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <p className="text-xs text-[#5a5a56]/70">Shirt Preview</p>
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Trouser Display */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs uppercase tracking-wider text-[#5a5a56] font-light">
                      {TROUSER_COLORS[selectedTrouser].name} Trousers
                    </h4>
                  </div>
                  <div
                    className="relative flex-1 bg-white flex items-center justify-center shadow-md"
                    style={{
                      boxShadow: "0 10px 25px -8px rgba(0, 0, 0, 0.15), 0 4px 10px -4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {!trouserImageError && (
                      <div
                        className={`transition-opacity duration-300 w-full h-full ${trouserImageLoaded ? "opacity-100" : "opacity-0"}`}
                      >
                        <Image
                          src={TROUSER_COLORS[selectedTrouser].image || "/placeholder.svg"}
                          alt={`${TROUSER_COLORS[selectedTrouser].name} Linen Trousers`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: "contain", objectPosition: "center", padding: "20px" }}
                          onLoad={() => setTrouserImageLoaded(true)}
                          onError={() => setTrouserImageError(true)}
                          priority
                        />
                      </div>
                    )}
                    {(trouserImageError || (!trouserImageLoaded && !trouserImageError)) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {trouserImageError ? (
                          <div className="text-center">
                            <div className="w-12 h-12 bg-[#5a5a56]/10 border-0 flex items-center justify-center mb-2">
                              <svg className="w-6 h-6 text-[#5a5a56]/50" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <p className="text-xs text-[#5a5a56]/70">Trouser Preview</p>
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-[#5a5a56]/30 border-t-[#5a5a56] rounded-full animate-spin"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e0ddd2] text-center">
                <p className="text-lg font-medium text-[#5a5a56]">Complete Set: £{SET_PRICE}</p>
                <p className="text-xs text-[#5a5a56]/70 mt-1">
                  Save £{SHIRT_PRICE + TROUSER_PRICE - SET_PRICE} when ordering both pieces together
                </p>
              </div>
            </div>
          </div>

          {/* Color Selectors */}
          <div className="space-y-8 flex flex-col">
            {/* Suggested Combinations */}
            <div className="bg-white p-6 border-0 shadow-sm flex-1 flex flex-col">
              <h4 className="text-sm uppercase tracking-wider text-[#5a5a56] mb-4 font-light text-center">
                Curated Sets
              </h4>
              <div className="flex-grow flex items-center">
                <Select onValueChange={handleSuggestedCombinationChange} value={selectedCombinationId}>
                  <SelectTrigger className="w-full bg-white text-[#5a5a56] font-light focus:ring-[#5a5a56]/50 focus:border-[#5a5a56]/50 border border-[#e0ddd2]">
                    <SelectValue placeholder="Select a combination..." className="font-light" />
                  </SelectTrigger>
                  <SelectContent className="font-mulish border-0">
                    {SUGGESTED_COMBINATIONS.map((combo) => (
                      <SelectItem key={combo.id} value={combo.id} className="font-light text-xs">
                        {combo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Shirt Color Selector */}
            <div className="bg-white p-6 border-0 shadow-sm flex-1 flex flex-col">
              <h4 className="text-sm uppercase tracking-wider text-[#5a5a56] mb-4 font-light text-center">
                Shirt Colors
              </h4>
              <div className="grid grid-cols-3 gap-3 flex-grow">
                {SHIRT_COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedShirt(index)}
                    className={`flex flex-col items-center justify-center p-3 transition-all duration-200 ${
                      selectedShirt === index ? "bg-[#5a5a56]/10 ring-2 ring-[#5a5a56]/30" : "hover:bg-[#5a5a56]/5"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 mb-2 shadow-sm ${
                        selectedShirt === index ? "border-[#5a5a56]" : "border-[#ddd]"
                      }`}
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-xs text-[#5a5a56] text-center leading-tight">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trouser Color Selector */}
            <div className="bg-white p-6 border-0 shadow-sm flex-1 flex flex-col">
              <h4 className="text-sm uppercase tracking-wider text-[#5a5a56] mb-4 font-light text-center">
                Trouser Colors
              </h4>
              <div className="grid grid-cols-2 gap-3 flex-grow">
                {TROUSER_COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTrouser(index)}
                    className={`flex flex-col items-center justify-center p-3 transition-all duration-200 ${
                      selectedTrouser === index ? "bg-[#5a5a56]/10 ring-2 ring-[#5a5a56]/30" : "hover:bg-[#5a5a56]/5"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 mb-2 shadow-sm ${
                        selectedTrouser === index ? "border-[#5a5a56]" : "border-[#ddd]"
                      }`}
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-xs text-[#5a5a56] text-center leading-tight">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState<ViewMode>("shirts")
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-white font-mulish">
      <NavigationMenu logoWidth={isMobile ? "35mm" : "45mm"} />
      <div className="pt-[70px]">
        <div className="text-center py-12 bg-white border-b border-[#e0ddd2]">
          <h1 className="text-[#5a5a56] font-normal text-xl md:text-2xl uppercase tracking-wider mb-3">
            Private Boutique Collection
          </h1>
          <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70 mb-4">By Invitation Only</p>
          <div className="w-24 h-px bg-[#5a5a56]/30 mx-auto"></div>
          <p className="font-mulish font-light text-[#5a5a56]/70 text-sm max-w-3xl mx-auto mt-6 px-4">
            Explore our exclusive collection of handcrafted Italian linen pieces. Each garment represents the pinnacle
            of Mediterranean craftsmanship and timeless design.
          </p>
        </div>

        {!isMobile ? (
          <div className="space-y-0">
            <div className="bg-eterno-cream">
              <BoutiqueTailoringSection />
            </div>
            <div className="bg-white">
              <SignatureShirtSection />
            </div>
            <div className="bg-eterno-cream">
              <ProductCarousel products={SHIRT_COLORS} type="shirt" />
            </div>
            <div className="bg-white">
              <SignatureTrouserSection />
            </div>
            <div className="bg-eterno-cream">
              <ProductCarousel products={TROUSER_COLORS} type="trouser" />
            </div>
            <div className="bg-white">
              <StyleCombinationsSection />
            </div>
          </div>
        ) : (
          <div className="h-screen flex flex-col overflow-hidden">
            <div className="flex-shrink-0 px-4 py-6 bg-white border-b border-[#e0ddd2]">
              <div className="flex justify-center">
                <div className="flex space-x-6">
                  {["shirts", "trousers", "sets", "tailoring"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as ViewMode)}
                      className={`px-4 py-3 text-xs font-light uppercase tracking-wider transition-all duration-300 relative ${activeTab === tab ? "text-[#5a5a56]" : "text-[#5a5a56]/50 hover:text-[#5a5a56]/70"}`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#5a5a56] transform -translate-y-px rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeTab === "shirts" && (
                <>
                  <div className="bg-white">
                    <SignatureShirtSection />
                  </div>
                  <div className="bg-eterno-cream">
                    <ProductCarousel products={SHIRT_COLORS} type="shirt" />
                  </div>
                </>
              )}
              {activeTab === "trousers" && (
                <>
                  <div className="bg-white">
                    <SignatureTrouserSection />
                  </div>
                  <div className="bg-eterno-cream">
                    <ProductCarousel products={TROUSER_COLORS} type="trouser" />
                  </div>
                </>
              )}
              {activeTab === "sets" && (
                <div className="bg-white">
                  <StyleCombinationsSection />
                </div>
              )}
              {activeTab === "tailoring" && (
                <div className="bg-eterno-cream">
                  <BoutiqueTailoringSection />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
