"use client"

import type React from "react"

import { useState } from "react"
import { ClipboardEdit, Phone, Scissors, PackageCheck, ArrowRight } from "lucide-react"

interface ProcessStep {
  icon: React.ReactNode
  title: string
  description: string
}

export default function ProcessSteps() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  const steps: ProcessStep[] = [
    {
      icon: <ClipboardEdit size={36} />,
      title: "Registration Form",
      description: "Complete our short form to express your interest.",
    },
    {
      icon: <Phone size={36} />,
      title: "Phone Consultation",
      description: "We'll call you to schedule your tailoring appointment.",
    },
    {
      icon: <Scissors size={36} />,
      title: "Boutique Tailoring",
      description: "Preview exclusive pieces and tailor your order.",
    },
    {
      icon: <PackageCheck size={36} />,
      title: "Delivery",
      description: "Receive your personalised order within 4–6 weeks.",
    },
  ]

  return (
    <section className="w-full bg-white py-20 px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <h2 className="font-mulish text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase text-[#5a5a56] text-center mb-16">
          Our Process
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-10 lg:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step container */}
              <div
                className="flex flex-col items-center text-center transition-all duration-300 ease-in-out"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{
                  transform: hoveredStep === index ? "scale(1.05)" : "scale(1)",
                }}
              >
                {/* Icon circle - updated background color */}
                <div className="w-20 h-20 rounded-full bg-[#eae8e3] flex items-center justify-center mb-6 transition-all duration-300">
                  <div className="text-[#5a5a56]">{step.icon}</div>
                </div>

                {/* Title - smaller and color matched */}
                <h3 className="font-mulish text-base md:text-lg font-light uppercase tracking-wider text-[#5a5a56] mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-mulish text-sm font-light text-[#5a5a56]/70 max-w-xs">{step.description}</p>
              </div>

              {/* Arrow - only show between steps, not after the last step */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-10 -right-6 transform translate-x-1/2 z-10">
                  <ArrowRight size={28} className="text-[#5a5a56]/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
