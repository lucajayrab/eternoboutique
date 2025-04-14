"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export default function ImageCarouselSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Sample images - these will be replaced by the user's own media
  const images = [
    "/placeholder.svg?height=800&width=600&text=Image+1",
    "/placeholder.svg?height=800&width=600&text=Image+2",
    "/placeholder.svg?height=800&width=600&text=Image+3",
    "/placeholder.svg?height=800&width=600&text=Image+4",
    "/placeholder.svg?height=800&width=600&text=Image+5",
    "/placeholder.svg?height=800&width=600&text=Image+6",
  ]

  // Auto-rotate carousel
  useEffect(() => {
    if (!isInView) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length, isInView])

  // Set up Intersection Observer to detect when the section is in view
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          } else {
            setIsInView(false)
          }
        })
      },
      { threshold: 0.2 },
    )

    observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section ref={sectionRef} className="w-full flex flex-col md:flex-row bg-[#eae8e3]">
      {/* Image Carousel - now first on mobile */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-[700px] relative overflow-hidden p-4 md:p-6 order-1">
        <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100 relative">
          {/* Carousel images */}
          <div className="w-full h-full relative">
            {images.map((src, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Carousel image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Carousel indicators - larger touch targets for mobile */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-white w-5" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 order-2">
        <div className="max-w-xl space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#5a5a56] font-light">Our Collection</p>

          <h2 className="font-mulish text-xl md:text-2xl font-light tracking-widest uppercase text-[#5a5a56]">
            Boutique Linen Tailoring
          </h2>

          <p className="text-base font-mulish font-light text-[#5a5a56]/80 leading-relaxed">
            Our capsule collection comprises six distinctive shirt colours and four trouser colours, each meticulously
            crafted from premium Italian linen. We offer bespoke tailoring from our private fitting room in Mayfair,
            with appointments available upon request. Every fully tailored linen ensemble can be personalised to your
            exact specifications, blending Mediterranean-inspired elegance with the precision of British craftsmanship
            to create a garment that is truly your own.
          </p>
        </div>
      </div>
    </section>
  )
}
