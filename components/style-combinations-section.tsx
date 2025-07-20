"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const CURATED_COMBINATIONS = [
  {
    id: "classic-elegance",
    name: "Classic Elegance",
    description: "Timeless sophistication",
    shirt: { color: "white", image: "/white-linen-shirt-new.png" },
    trousers: { color: "navy", image: "/navy-linen-trousers-new.png" },
  },
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    description: "Clean contemporary lines",
    shirt: { color: "black", image: "/black-linen-shirt-new.png" },
    trousers: { color: "black", image: "/black-linen-trousers-new.png" },
  },
  {
    id: "summer-breeze",
    name: "Summer Breeze",
    description: "Light and airy comfort",
    shirt: { color: "sky-blue", image: "/sky-blue-linen-shirt-new.png" },
    trousers: { color: "cream", image: "/cream-linen-trousers-new.png" },
  },
  {
    id: "earthy-tones",
    name: "Earthy Tones",
    description: "Natural harmony",
    shirt: { color: "sage", image: "/sage-linen-shirt-new.png" },
    trousers: { color: "natural", image: "/natural-linen-trousers.png" },
  },
]

const COLOR_OPTIONS = {
  shirts: [
    { name: "White", value: "white", hex: "#ffffff" },
    { name: "Black", value: "black", hex: "#2c2c2c" },
    { name: "Navy", value: "navy", hex: "#1e3a8a" },
    { name: "Pink", value: "pink", hex: "#f8bbd9" },
    { name: "Sage", value: "sage", hex: "#9ca3af" },
    { name: "Sky Blue", value: "sky-blue", hex: "#87ceeb" },
  ],
  trousers: [
    { name: "Black", value: "black", hex: "#2c2c2c" },
    { name: "Navy", value: "navy", hex: "#1e3a8a" },
    { name: "Cream", value: "cream", hex: "#f5f5dc" },
    { name: "Natural", value: "natural", hex: "#d2b48c" },
    { name: "White", value: "white", hex: "#ffffff" },
  ],
}

export default function StyleCombinationsSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCombination, setSelectedCombination] = useState(CURATED_COMBINATIONS[0])
  const [customShirtColor, setCustomShirtColor] = useState("white")
  const [customTrousersColor, setCustomTrousersColor] = useState("navy")

  const handleCombinationSelect = (combination: (typeof CURATED_COMBINATIONS)[0]) => {
    setSelectedCombination(combination)
    setCustomShirtColor(combination.shirt.color)
    setCustomTrousersColor(combination.trousers.color)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 max-w-6xl">
        {/* Section Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-4 border-b border-gray-200 hover:border-[#5a5a56]/30 transition-colors duration-200"
        >
          <h2 className="text-xl font-light tracking-wider uppercase text-[#5a5a56]">Style Combinations</h2>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[#5a5a56]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#5a5a56]" />
          )}
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="pt-8 space-y-8">
            {/* Curated Combinations */}
            <div>
              <h3 className="text-lg font-light tracking-wider uppercase text-[#5a5a56] mb-4">Curated Combinations</h3>
              <div className="flex flex-wrap gap-2">
                {CURATED_COMBINATIONS.map((combination) => (
                  <button
                    key={combination.id}
                    onClick={() => handleCombinationSelect(combination)}
                    className={`px-4 py-2 text-sm font-light tracking-wide transition-all duration-200 ${
                      selectedCombination.id === combination.id
                        ? "bg-[#5a5a56] text-white"
                        : "bg-gray-100 text-[#5a5a56] hover:bg-gray-200"
                    }`}
                  >
                    {combination.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shirt */}
              <div className="space-y-4">
                <h4 className="text-base font-light tracking-wider uppercase text-[#5a5a56]">Shirt</h4>
                <div className="bg-[#f9f8f5] rounded-lg p-6 aspect-square flex items-center justify-center">
                  <img
                    src={selectedCombination.shirt.image || "/placeholder.svg"}
                    alt="Selected shirt"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.shirts.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setCustomShirtColor(color.value)}
                      className={`w-6 h-6 rounded-full border transition-all duration-200 ${
                        customShirtColor === color.value ? "border-[#5a5a56] scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Trousers */}
              <div className="space-y-4">
                <h4 className="text-base font-light tracking-wider uppercase text-[#5a5a56]">Trousers</h4>
                <div className="bg-[#f9f8f5] rounded-lg p-6 aspect-square flex items-center justify-center">
                  <img
                    src={selectedCombination.trousers.image || "/placeholder.svg"}
                    alt="Selected trousers"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.trousers.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setCustomTrousersColor(color.value)}
                      className={`w-6 h-6 rounded-full border transition-all duration-200 ${
                        customTrousersColor === color.value ? "border-[#5a5a56] scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
