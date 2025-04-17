"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import SlidingButton from "@/components/sliding-button"
import EnhancedPhoneInput from "@/components/enhanced-phone-input"
import { registrationFormSchema, type RegistrationFormData } from "@/lib/form-schema"

export default function SectionedRegistrationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [isPhoneInputAvailable, setIsPhoneInputAvailable] = useState(false)
  const [PhoneInputField, setPhoneInputField] = useState<any>(null)

  // Use the shared schema and type
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phonecontact: "",
      countrylocation: "",
      city: "",
      industrysector: "",
      dob: "", // Changed from age to dob
    },
  })

  // Try to load the advanced phone input component, but don't rely on it
  useEffect(() => {
    const loadPhoneInput = async () => {
      try {
        const module = await import("@/components/phone-input")
        setPhoneInputField(() => module.default)
        setIsPhoneInputAvailable(true)
      } catch (error) {
        console.error("Failed to load phone input component:", error)
        setIsPhoneInputAvailable(false)
      }
    }

    loadPhoneInput()
  }, [])

  // Function to extract the HubSpot tracking cookie
  const getHutk = () => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/hubspotutk=([^;]+)/)
      return match ? match[1] : ""
    }
    return ""
  }

  async function onSubmit(values: RegistrationFormData) {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Get the HubSpot tracking cookie
      const hutk = getHutk()
      console.log("HubSpot tracking cookie (hutk):", hutk || "Not found")

      // Submit to our API route
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          hutk, // Add the tracking cookie to the payload
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Navigate to confirmation page after registration is complete
        router.push("/confirmation")
      } else {
        // Show error message
        setSubmitError(data.message || "Failed to submit registration. Please try again.")
        console.error("Submission error:", data.error)
      }
    } catch (error) {
      console.error("Error:", error)
      setSubmitError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Section header component for consistency
  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-lg font-medium tracking-wide uppercase text-[#5a5a56] mb-6 mt-10 first:mt-0">{title}</h3>
  )

  return (
    <div className="w-full max-w-xl mx-auto bg-[#f5f4f1] p-8 rounded-lg shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info Section */}
          <div className="pb-6 border-b border-gray-100">
            <SectionHeader title="Personal Info" />
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#5a5a56] font-light">First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="font-light text-sm w-full" />
                    </FormControl>
                    <FormMessage className="font-light" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#5a5a56] font-light">Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="font-light text-sm w-full" />
                    </FormControl>
                    <FormMessage className="font-light" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#5a5a56] font-light">Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="" {...field} className="font-light text-sm w-full" />
                    </FormControl>
                    <FormMessage className="font-light" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact Details Section - Reordered as requested */}
          <div className="pb-6 border-b border-gray-100">
            <SectionHeader title="Contact Details" />
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#5a5a56] font-light">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="" {...field} className="font-light text-sm w-full" />
                    </FormControl>
                    <FormMessage className="font-light" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phonecontact"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#5a5a56] font-light">Phone</FormLabel>
                    <FormControl>
                      {/* Always use our enhanced phone input in the preview environment */}
                      <EnhancedPhoneInput
                        control={form.control}
                        name="phonecontact"
                        error={fieldState.error?.message}
                        className="font-light text-sm w-full"
                      />
                    </FormControl>
                    <FormMessage className="font-light" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countrylocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#5a5a56] font-light">Country</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="font-light text-sm w-full" />
                    </FormControl>
                    <FormMessage className="font-light" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#5a5a56] font-light">City</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="font-light text-sm w-full" />
                    </FormControl>
                    <FormMessage className="font-light" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Preferences Section */}
          <div className="pb-6">
            <SectionHeader title="Preferences" />
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="industrysector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#5a5a56] font-light">Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="font-light text-sm w-full" />
                    </FormControl>
                    <FormMessage className="font-light" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {submitError && <div className="text-red-500 text-sm font-light mt-4">{submitError}</div>}

          <div className="flex justify-center mt-10">
            {isSubmitting ? (
              <button
                disabled
                className="w-64 h-12 font-light border border-black rounded-none bg-black text-white flex items-center justify-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </button>
            ) : (
              <SlidingButton type="submit" onClick={() => {}} variant="dark" duration={1000} className="w-64 h-12">
                ENQUIRE
              </SlidingButton>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
