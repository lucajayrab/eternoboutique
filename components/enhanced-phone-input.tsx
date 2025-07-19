"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface EnhancedPhoneInputProps {
  control?: any
  name?: string
  value?: string
  onChange?: (value: string) => void
}

export default function EnhancedPhoneInput({ control, name, value, onChange }: EnhancedPhoneInputProps) {
  const [phoneValue, setPhoneValue] = useState(value || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setPhoneValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <Input
      type="tel"
      value={phoneValue}
      onChange={handleChange}
      placeholder=""
      className="h-10 border-eterno-text/20 border-0 border-b bg-transparent px-0 py-1 text-sm font-light focus:outline-none focus:border-eterno-text/50 rounded-none"
    />
  )
}
