"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"

const SHIRT_COLORS = [
  { name: "White", color: "#f5f5f5", image: "/images/shirts/new-white-linen-shirt.png" },
  { name: "Black", color: "#2a2a33", image: "/images/shirts/new-black-linen-shirt.png" },
  { name: "Navy", color: "#2d2a3e", image: "/images/shirts/new-navy-linen-shirt.png" },
  { name: "Sky Blue", color: "#c9d7e8", image: "/images/shirts/new-sky-blue-linen-shirt.png" },
  { name: "Pink", color: "#e7d0d3", image: "/images/shirts/new-pink-linen-shirt.png" },
  { name: "Sage", color: "#9ca594", image: "/images/shirts/new-sage-linen-shirt.png" },
]

const TROUSER_COLORS = [
  { name: "Natural", color: "#f5f2e8", image: "/natural-linen-trousers.png" },
  { name: "Black", color: "#2a2a33", image: "/black-linen-trousers-new.png" },
  { name: "Navy", color: "#2d2a3e", image: "/navy-linen-trousers-new.png" },
  { name: "Cream", color: "#f8f6f0", image: "/cream-linen-trousers-new.png" },
]

const CURATED_COMBINATIONS = [
  { name: "Classic", shirt: "White", trouser: "Navy" },
  { name: "Modern", shirt: "Black", trouser: "Black" },
  { name: "Summer", shirt: "Sky Blue", trouser: "Natural" },
  { name: "Elegant", shirt: "Navy", trouser: "Cream" },
  { name: "Contemporary", shirt: "Sage", trouser: "Black" },
  { name: "Refined", shirt: "Pink", trouser: "Navy" },
]

export default function StyleCombinationsSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedShirt, setSelectedShirt] = useState("White")
  const [selectedTrouser, setSelectedTrouser] = useState("Navy")

  const handleCombinationSelect = (combination: { shirt: string; trouser: string }) => {
    setSelectedShirt(combination.shirt)
    setSelectedTrouser(combination.trouser)
  }

  const selectedShirtData = SHIRT_COLORS.find((s) => s.name === selectedShirt)
  const selectedTrouserData = TROUSER_COLORS.find((t) => t.name === selectedTrouser)

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-4 text-left group"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-light tracking-[0.15em] uppercase text-[#5a5a56]">
            Style Combinations
          </h2>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[#5a5a56] transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#5a5a56] transition-transform duration-200" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-8 space-y-8 animate-in slide-in-from-top duration-300">
            <div className="flex flex-wrap gap-2">
              {CURATED_COMBINATIONS.map((combination) => (
                <button
                  key={combination.name}
                  onClick={() => handleCombinationSelect(combination)}
                  className={`px-4 py-2 text-sm font-light tracking-wider transition-all duration-200 ${
                    selectedShirt === combination.shirt && selectedTrouser === combination.trouser
                      ? "bg-[#5a5a56] text-white"
                      : "text-[#5a5a56] hover:bg-[#5a5a56]/5"
                  }`}
                >
                  {combination.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-[#5a5a56] mb-4 tracking-wider uppercase">Shirt</h3>
                  <div className="relative aspect-square bg-[#f9f8f5] rounded-lg overflow-hidden">
                    {selectedShirtData && (
                      <Image
                        src={selectedShirtData.image || "/placeholder.svg"}
                        alt={`${selectedShirtData.name} Linen Shirt`}
                        fill
                        style={{ objectFit: "contain" }}
                        className="p-4"
                      />
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    {SHIRT_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedShirt(color.name)}
                        className={`w-6 h-6 rounded-full border transition-all duration-200 ${
                          selectedShirt === color.name
                            ? "border-[#5a5a56] ring-2 ring-[#5a5a56]/20 scale-110"
                            : "border-gray-300 hover:border-[#5a5a56]/50"
                        }`}
                        style={{ backgroundColor: color.color }}
                        aria-label={`Select ${color.name} shirt`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-[#5a5a56] mb-4 tracking-wider uppercase">Trousers</h3>
                  <div className="relative aspect-square bg-[#f9f8f5] rounded-lg overflow-hidden">
                    {selectedTrouserData && (
                      <Image
                        src={selectedTrouserData.image || "/placeholder.svg"}
                        alt={`${selectedTrouserData.name} Linen Trousers`}
                        fill
                        style={{ objectFit: "contain" }}
                        className="p-4"
                      />
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    {TROUSER_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedTrouser(color.name)}
                        className={`w-6 h-6 rounded-full border transition-all duration-200 ${
                          selectedTrouser === color.name
                            ? "border-[#5a5a56] ring-2 ring-[#5a5a56]/20 scale-110"
                            : "border-gray-300 hover:border-[#5a5a56]/50"
                        }`}
                        style={{ backgroundColor: color.color }}
                        aria-label={`Select ${color.name} trousers`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
