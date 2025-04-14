"use client"

interface LuxuryBannerProps {
  headline?: string
}

export default function LuxuryBanner({ headline = "BOUTIQUE LINEN TAILORING" }: LuxuryBannerProps) {
  return (
    <section className="bg-white pt-24 pb-16 px-8 flex items-center justify-center mt-[70px]">
      <div className="container mx-auto">
        <h2 className="font-mulish text-lg md:text-xl font-light tracking-widest uppercase text-[#5a5a56] text-center">
          {headline}
        </h2>
      </div>
    </section>
  )
}
