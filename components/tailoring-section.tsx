"use client"

import { useState, useEffect, useRef } from "react"

export default function TailoringSection() {
  const [isInView, setIsInView] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Set up Intersection Observer to detect when the section is in view
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            // Try to play the video when it comes into view
            if (videoRef.current) {
              videoRef.current.play().catch((error) => {
                console.log("Could not autoplay video:", error)
              })
            }
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

  return (
    <section ref={sectionRef} className="w-full flex flex-col md:flex-row bg-[#f5f4f1]">
      {/* Left side - Text content (unchanged) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="max-w-xl space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#5a5a56] font-light">Exclusively Yours</p>

          <h2 className="font-mulish text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase text-[#5a5a56]">
            FROM THE YARN
          </h2>

          <p className="text-base font-mulish font-light text-[#5a5a56]/80 leading-relaxed">
            Our exquisite linen, manufactured in the heart of Napoli, embodies generations of Italian textile mastery.
            Each garment is meticulously crafted by our head tailor, who brings five years of prestigious Savile Row
            experience to every stitch and seam. Experience the perfect harmony of Mediterranean materials and British
            precision tailoring — available exclusively through our private appointment service.
          </p>
        </div>
      </div>

      {/* Right side - Scroll-triggered video */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-[700px] relative overflow-hidden p-4 md:p-6">
        <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            poster="/placeholder.svg?height=1080&width=720"
          >
            <source
              src="https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/Sequence%2001_1-Xn6TdRHjMnsfTVDT35sjItvOVLcWMU.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  )
}
