import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function FromTheYarnSection() {
  return (
    <section className="w-full py-12 md:py-16 bg-white">
      {/* Mobile-only additional top padding */}
      <div className="md:hidden h-8"></div>

      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-light tracking-wider uppercase text-[#6d6d6d] lookbook-heading">
                From the Yarn
              </h2>
              <p className="text-gray-500 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed eterno-body">
                At ETERNO, we believe that true luxury begins with the finest materials. Our journey starts with the
                selection of premium linen yarns, sourced from the world&apos;s most prestigious mills. Each fiber is
                chosen for its exceptional quality, durability, and natural beauty.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed eterno-body">
                Our artisans transform these exquisite yarns into fabrics that embody the essence of Mediterranean
                elegance. The result is clothing that not only looks refined but feels extraordinary against the
                skin—cool in the summer heat, yet surprisingly cozy when temperatures drop.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                className="inline-flex h-10 items-center justify-center rounded-none border border-[#6d6d6d] bg-white px-8 text-sm font-medium text-[#6d6d6d] shadow-sm transition-colors hover:bg-[#6d6d6d] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6d6d6d] disabled:pointer-events-none disabled:opacity-50 eterno-button"
                variant="outline"
              >
                Explore Materials
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
              <Image
                src="/luxury-linen-boutique.png"
                alt="Luxury linen fabric close-up"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
