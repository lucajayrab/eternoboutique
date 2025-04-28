"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import SlidingButton from "@/components/sliding-button"
import StickyBanner from "@/components/sticky-banner"
import ProcessSteps from "@/components/process-steps"
import MobileMenu from "@/components/main-menu"

// Define a consistent logo size
const LOGO_SIZE = "45mm"

export default function Home() {
  const router = useRouter()
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // State for button visibility
  const [isButtonVisible, setIsButtonVisible] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Get the video URL from environment variable
  useEffect(() => {
    // Access the environment variable after component mounts (client-side)
    const envUrl = process.env.NEXT_PUBLIC_VIDEO_URL

    // Fallback URL if environment variable is not set
    const fallbackUrl =
      "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_4K-8VStwETVo6CUgQ4TKH5JbWMigUc53g.mp4"

    if (envUrl) {
      setVideoUrl(envUrl)
      console.log("Using environment variable for video URL")
    } else {
      console.log("NEXT_PUBLIC_VIDEO_URL not set, using fallback URL")
      setVideoUrl(fallbackUrl)
    }
  }, [])

  // Mouse tracking for button visibility (desktop only)
  useEffect(() => {
    if (isMobile) {
      setIsButtonVisible(true) // Always show button on mobile
      return
    }

    const heroSection = heroSectionRef.current
    const buttonElement = buttonRef.current

    if (!heroSection || !buttonElement) return

    const handleMouseMove = (e: MouseEvent) => {
      // Get hero section dimensions and position
      const heroRect = heroSection.getBoundingClientRect()
      const buttonRect = buttonElement.getBoundingClientRect()

      // Calculate center of hero section
      const centerX = heroRect.left + heroRect.width / 2
      const centerY = heroRect.top + heroRect.height / 2

      // Calculate distance from mouse to center
      const mouseX = e.clientX
      const mouseY = e.clientY
      const distanceFromCenter = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))

      // Calculate radius threshold (30% of the smaller dimension)
      const radius = Math.min(heroRect.width, heroRect.height) * 0.3

      // Check if mouse is over button
      const isOverButton =
        mouseX >= buttonRect.left &&
        mouseX <= buttonRect.right &&
        mouseY >= buttonRect.top &&
        mouseY <= buttonRect.bottom

      // Show button if mouse is within radius or over button
      setIsButtonVisible(distanceFromCenter <= radius || isOverButton)
    }

    // Add mouse move listener
    window.addEventListener("mousemove", handleMouseMove)

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isMobile])

  const handleRegisterClick = () => {
    router.push("/register")
  }

  const handleScrollDown = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle video loaded event
  const handleVideoLoaded = () => {
    setVideoLoaded(true)
  }

  // Handle video error
  const handleVideoError = () => {
    console.error("Video failed to load")
    setIsVideoError(true)
  }

  return (
    <div className="relative">
      {/* Sticky Banner (visible on all devices) */}
      <StickyBanner logoWidth={LOGO_SIZE} />

      {/* Mobile Menu (only visible on mobile) */}
      <MobileMenu />

      {/* CURRENT LANDING STRUCTURE - Keep as-is at top of homepage */}
      <section ref={heroSectionRef} className="relative h-screen w-screen overflow-hidden bg-black pt-[70px]" id="home">
        {/* Fallback background while video loads or if video fails */}
        {(!videoLoaded || isVideoError) && (
          <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
            {isVideoError && <p className="text-white/50 text-sm">Video loading failed. Please check the video URL.</p>}
          </div>
        )}

        {/* Background Video with optimized loading */}
        {videoUrl && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoadedData={handleVideoLoaded}
            onError={(e) => {
              console.error("Video failed to load:", e)
              setIsVideoError(true)
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Register Button - now with conditional visibility on desktop, always visible on mobile */}
        <div
          ref={buttonRef}
          className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500 ${
            isButtonVisible || isMobile ? "opacity-100" : "opacity-0"
          }`}
        >
          <SlidingButton
            onClick={handleRegisterClick}
            duration={1000}
            variant="light"
            className="min-w-[200px] py-4 text-base"
          >
            REGISTER INTEREST
          </SlidingButton>
        </div>

        {/* Scroll down indicator - Improved for mobile visibility */}
        <div
          className="fixed md:absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer animate-bounce"
          onClick={handleScrollDown}
          style={{
            padding: "12px", // Larger touch target
            background: "rgba(0,0,0,0.3)",
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(255,255,255,0.2)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* NEW SIMPLIFIED ABOUT SECTION - with equal vertical padding */}
      <div ref={aboutSectionRef} id="about" className="w-full bg-[#f5f4f1] pt-28 pb-28 md:pt-32 md:pb-32">
        <div className="container mx-auto px-6 md:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-mulish text-xl md:text-2xl font-light tracking-widest uppercase text-[#5a5a56]">
              BOUTIQUE LINEN TAILORING
            </h2>
          </div>

          <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed space-y-6 text-center md:text-left">
            <p>
              ETERNO embodies Mediterranean sophistication, quietly expressed through bespoke tailoring and the
              meticulous craft of our Neapolitan artisans. We warmly invite you to experience our boutique fittings at
              our atelier in the heart of Mayfair, or at a private location of your choosing.
            </p>

            <p>
              Our signature offering is centred around impeccably tailored linen—capturing the effortless elegance of
              Mediterranean living. While this marks the start of our journey, we envision thoughtfully expanding our
              collection to further embody our philosophy of careful luxury.
            </p>

            <p>
              Currently, we offer an exclusive capsule collection showcasing six distinctive shirt shades and four
              refined trouser tones, each piece carefully handcrafted from the finest Italian linen.
            </p>

            <p>
              While our capsule serves as an elegant introduction, we delight in tailoring each garment precisely to
              your taste, offering the possibility of complete customisation to ensure each piece genuinely reflects
              your individual story.
            </p>
          </div>
        </div>
      </div>

      {/* PROCESS STEPS SECTION */}
      <div id="process">
        <ProcessSteps />
      </div>

      {/* FINAL CTA SECTION */}
      <div ref={contentRef}>
        {/* Slimmer Register Interest CTA */}
        <section className="py-12 md:py-16 bg-[#eae8e3]">
          <div className="container mx-auto px-8 text-center">
            <div
              className="max-w-2xl mx-auto space-y-4 opacity-0 animate-[fadeIn_1s_ease-in-out_forwards]"
              style={{ animationDelay: "0.3s" }}
            >
              <div>
                <SlidingButton
                  onClick={handleRegisterClick}
                  variant="dark"
                  duration={1000}
                  className="min-w-[200px] py-4 text-base"
                >
                  REGISTER INTEREST
                </SlidingButton>
              </div>
              <p className="text-sm font-mulish text-[#5a5a56]/60 mt-4">
                Be the first to access our bespoke pieces, private fittings, and upcoming events.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
