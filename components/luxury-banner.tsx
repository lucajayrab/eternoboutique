"use client"

interface LuxuryBannerProps {
  headline?: string
}

export default function LuxuryBanner({ headline = "BOUTIQUE LINEN TAILORING" }: LuxuryBannerProps) {
  return (
    <section className="bg-white pt-24 pb-16 px-8 flex items-center justify-center mt-[70px]">
      <div className="container mx-auto">
        <h2 className="font-mulish text-xl md:text-2xl lg:text-3xl font-light tracking-widest uppercase text-eterno-gray text-center">
          {headline}
        </h2>
      </div>
    </section>
  )
}
