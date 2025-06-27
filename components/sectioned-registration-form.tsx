"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formSchema, type FormData } from "@/lib/form-schema"

export default function SectionedRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const router = useRouter()

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    try {
      formSchema.parse(formData)
      setErrors({})
      return true
    } catch (error: any) {
      const fieldErrors: Partial<FormData> = {}
      error.errors?.forEach((err: any) => {
        if (err.path?.[0]) {
          fieldErrors[err.path[0] as keyof FormData] = err.message
        }
      })
      setErrors(fieldErrors)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setTimeout(() => {
          router.push("/confirmation")
        }, 2000)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow-lg rounded-none">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-[#5a5a56] mb-2">Register Interest</h1>
            <p className="text-sm text-[#5a5a56]/70">Join our exclusive list for early access to the 2026 collection</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-[#5a5a56]">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="mt-1 rounded-none border-[#d4d4d4] focus:border-[#5a5a56] focus:ring-[#5a5a56]"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded-none">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-[#5a5a56]">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="mt-1 rounded-none border-[#d4d4d4] focus:border-[#5a5a56] focus:ring-[#5a5a56]"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded-none">{errors.lastName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-[#5a5a56]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1 rounded-none border-[#d4d4d4] focus:border-[#5a5a56] focus:ring-[#5a5a56]"
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded-none">{errors.email}</p>}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5a5a56] hover:bg-[#4a4a46] text-white py-3 rounded-none transition-colors duration-200"
            >
              {isSubmitting ? "Submitting..." : "Register Interest"}
            </Button>

            {submitStatus === "success" && (
              <div className="text-center p-4 bg-green-50 text-green-700 rounded-none">
                Registration successful! Redirecting...
              </div>
            )}

            {submitStatus === "error" && (
              <div className="text-center p-4 bg-red-50 text-red-700 rounded-none">
                Registration failed. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
