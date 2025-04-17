"use client"

import { useState, useEffect } from "react"
import { Controller, type Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"

// Dynamically import the phone input component with no SSR
const PhoneInput = dynamic(() => import("react-phone-input-2").then((mod) => mod.default), {
  ssr: false,
  loading: () => <Input className="w-full" placeholder="Loading phone input..." disabled />,
})

interface PhoneInputFieldProps {
  control: Control<any>
  name: string
  defaultCountry?: string
  placeholder?: string
  error?: string
  className?: string
}

export default function PhoneInputField({
  control,
  name,
  defaultCountry = "gb",
  placeholder = "Phone number",
  error,
  className = "",
}: PhoneInputFieldProps) {
  const [mounted, setMounted] = useState(false)
  const [phoneInputLoaded, setPhoneInputLoaded] = useState(false)

  // Only render the component on the client side to avoid hydration issues
  useEffect(() => {
    setMounted(true)

    // Check if we can load the phone input library
    const loadPhoneInput = async () => {
      try {
        // Don't try to import the CSS file directly
        // Just check if the component is available
        await import("react-phone-input-2")
        setPhoneInputLoaded(true)
      } catch (err) {
        console.error("Failed to load phone input:", err)
        setPhoneInputLoaded(false)
      }
    }

    loadPhoneInput()
  }, [])

  if (!mounted) {
    return (
      <Input
        className={`h-10 w-full border-eterno-text/20 border-0 border-b bg-transparent px-0 py-1 ${className}`}
        placeholder={placeholder}
        disabled
      />
    )
  }

  // If the phone input library couldn't be loaded, use a regular input
  if (!phoneInputLoaded) {
    return (
      <div className={className}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input type="tel" placeholder={placeholder} {...field} className="font-light text-sm w-full" />
          )}
        />
        {error && <p className="text-sm font-light text-eterno-accent mt-1">{error}</p>}
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            country={defaultCountry}
            value={value}
            onChange={(phone) => onChange(phone)}
            placeholder={placeholder}
            inputClass="!w-full !h-10 !bg-transparent !border-0 !border-b !border-eterno-text/20 !rounded-none !py-1 !px-0 !text-sm !font-light !ring-offset-background focus:!outline-none focus:!border-eterno-text/50"
            containerClass="!w-full"
            buttonClass="!bg-transparent !border-0 !border-b !border-eterno-text/20 !rounded-none"
            dropdownClass="!bg-white"
            enableSearch={true}
            disableSearchIcon={true}
            searchPlaceholder="Search countries"
          />
        )}
      />
      {error && <p className="text-sm font-light text-eterno-accent mt-1">{error}</p>}
    </div>
  )
}
