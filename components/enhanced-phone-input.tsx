"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Controller, type Control } from "react-hook-form"
import { ChevronDown, ChevronUp } from "lucide-react"

// Common country codes for quick selection
const COMMON_COUNTRIES = [
  { code: "+1", name: "United States/Canada" },
  { code: "+44", name: "United Kingdom" },
  { code: "+61", name: "Australia" },
  { code: "+33", name: "France" },
  { code: "+49", name: "Germany" },
  { code: "+39", name: "Italy" },
  { code: "+34", name: "Spain" },
  { code: "+81", name: "Japan" },
  { code: "+86", name: "China" },
  { code: "+91", name: "India" },
]

interface EnhancedPhoneInputProps {
  control: Control<any>
  name: string
  placeholder?: string
  error?: string
  className?: string
}

export default function EnhancedPhoneInput({
  control,
  name,
  placeholder = "Phone number",
  error,
  className = "",
}: EnhancedPhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(COMMON_COUNTRIES[1]) // Default to UK

  const toggleDropdown = () => setIsOpen(!isOpen)

  const selectCountry = (
    country: (typeof COMMON_COUNTRIES)[0],
    onChange: (value: string) => void,
    currentValue: string,
  ) => {
    setSelectedCountry(country)
    setIsOpen(false)

    // Extract the national number (remove any existing country code)
    const nationalNumber = currentValue.replace(/^\+\d+\s*/, "")

    // Set the new value with the selected country code
    onChange(`${country.code} ${nationalNumber}`)
  }

  // Format the phone number as the user types
  const formatPhoneNumber = (value: string, onChange: (value: string) => void) => {
    // Keep the country code intact
    const countryCodeMatch = value.match(/^\+\d+\s*/)
    const countryCode = countryCodeMatch ? countryCodeMatch[0] : selectedCountry.code + " "

    // Get the national number part (everything after the country code)
    let nationalNumber = value.replace(/^\+\d+\s*/, "")

    // Remove non-digit characters from the national number
    nationalNumber = nationalNumber.replace(/\D/g, "")

    // Format the national number with spaces for readability
    // This is a simple format - you can make it more sophisticated based on country
    if (nationalNumber.length > 6) {
      nationalNumber = `${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 6)} ${nationalNumber.slice(6)}`
    } else if (nationalNumber.length > 3) {
      nationalNumber = `${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3)}`
    }

    // Combine country code and formatted national number
    onChange(`${countryCode}${nationalNumber}`)
  }

  return (
    <div className={`relative ${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...rest } }) => (
          <div className="relative">
            {/* Country code dropdown button */}
            <div className="absolute left-0 top-0 flex items-center h-10 cursor-pointer z-10" onClick={toggleDropdown}>
              <span className="text-sm font-light mr-1">{selectedCountry.code}</span>
              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>

            {/* Phone input */}
            <Input
              type="tel"
              placeholder=""
              value={value || ""}
              onChange={(e) => formatPhoneNumber(e.target.value, onChange)}
              className="font-light text-sm w-full pl-16"
              {...rest}
            />

            {/* Country dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-20">
                {COMMON_COUNTRIES.map((country) => (
                  <div
                    key={country.code}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => selectCountry(country, onChange, value || "")}
                  >
                    <span className="font-medium">{country.code}</span> {country.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      />
      {error && <p className="text-sm font-light text-eterno-accent mt-1">{error}</p>}
    </div>
  )
}
