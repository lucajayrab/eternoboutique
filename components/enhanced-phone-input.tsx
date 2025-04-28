"use client"
import { Input } from "@/components/ui/input"
import { Controller, type Control } from "react-hook-form"

// Common country codes for the dropdown
const COUNTRY_CODES = [
  { code: "+44", name: "UK" },
  { code: "+33", name: "France" },
  { code: "+39", name: "Italy" },
  { code: "+49", name: "Germany" },
  { code: "+34", name: "Spain" },
  { code: "+971", name: "UAE" },
  { code: "+1", name: "USA/Canada" },
  { code: "+61", name: "Australia" },
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
  // Function to extract country code and number from a full phone number
  const splitPhoneNumber = (fullNumber: string) => {
    // Default values
    let countryCode = "+44" // Default to UK
    let nationalNumber = ""

    if (fullNumber) {
      // Try to extract country code (anything starting with + followed by digits)
      const countryCodeMatch = fullNumber.match(/^\+\d+/)
      if (countryCodeMatch) {
        const extractedCode = countryCodeMatch[0]
        // Check if the extracted code is in our list
        if (COUNTRY_CODES.some((cc) => cc.code === extractedCode)) {
          countryCode = extractedCode
          // Remove country code from the full number to get national number
          nationalNumber = fullNumber.replace(countryCodeMatch[0], "").trim()
        } else {
          // If code not in our list, just use the number as is
          nationalNumber = fullNumber.replace(/^\+/, "").trim()
        }
      } else {
        // If no country code format detected, use the number as is
        nationalNumber = fullNumber.trim()
      }
    }

    return { countryCode, nationalNumber }
  }

  return (
    <div className={`${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...rest } }) => {
          // Split the current value into country code and national number
          const { countryCode, nationalNumber } = splitPhoneNumber(value || "")

          // Function to combine country code and number
          const handlePhoneChange = (newCountryCode: string, newNationalNumber: string) => {
            // Remove any non-digit characters from the national number
            const cleanNumber = newNationalNumber.replace(/[^\d]/g, "")

            // Ensure we have a clean country code (just in case)
            const cleanCountryCode = newCountryCode.startsWith("+")
              ? newCountryCode
              : `+${newCountryCode.replace(/[^\d]/g, "")}`

            // Combine country code and cleaned national number - ensure proper formatting for HubSpot
            onChange(`${cleanCountryCode}${cleanNumber ? " " + cleanNumber : ""}`)
          }

          return (
            <div className="flex">
              {/* Country code dropdown */}
              <select
                className="h-10 w-1/3 border-eterno-text/20 border-0 border-b bg-transparent px-0 py-1 text-sm font-light focus:outline-none focus:border-eterno-text/50 rounded-none"
                value={countryCode}
                onChange={(e) => handlePhoneChange(e.target.value, nationalNumber)}
                {...rest}
                style={{ touchAction: "manipulation" }}
              >
                {COUNTRY_CODES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} ({country.name})
                  </option>
                ))}
              </select>

              {/* National number input */}
              <Input
                type="tel"
                placeholder=""
                value={nationalNumber}
                onChange={(e) => handlePhoneChange(countryCode, e.target.value)}
                className="h-10 w-2/3 border-eterno-text/20 border-0 border-b bg-transparent px-0 py-1 text-sm font-light focus:outline-none focus:border-eterno-text/50 rounded-none"
                pattern="[0-9]*"
                inputMode="numeric"
                {...rest}
              />
            </div>
          )
        }}
      />
      {error && <p className="text-sm font-light text-eterno-accent mt-1">{error}</p>}
    </div>
  )
}
