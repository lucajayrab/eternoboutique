"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import SlidingButton from "@/components/sliding-button"
import EnhancedPhoneInput from "@/components/enhanced-phone-input"
import { registrationFormSchema, type RegistrationFormData } from "@/lib/form-schema"

export default function RegistrationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

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

  return (
    <div className="mt-16 w-full max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="First name" {...field} className="font-light text-sm w-full" />
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
                <FormControl>
                  <Input placeholder="Last name" {...field} className="font-light text-sm w-full" />
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
                <FormControl>
                  <Input type="date" placeholder="Date of Birth" {...field} className="font-light text-sm w-full" />
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
                <FormControl>
                  <Input placeholder="Country" {...field} className="font-light text-sm w-full" />
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
                <FormControl>
                  <Input placeholder="City" {...field} className="font-light text-sm w-full" />
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
                <FormControl>
                  <EnhancedPhoneInput
                    control={form.control}
                    name="phonecontact"
                    placeholder="Phone"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="E-mail" {...field} className="font-light text-sm w-full" />
                </FormControl>
                <FormMessage className="font-light" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industrysector"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Industry" {...field} className="font-light text-sm w-full" />
                </FormControl>
                <FormMessage className="font-light" />
              </FormItem>
            )}
          />
          {submitError && <div className="text-red-500 text-sm font-light">{submitError}</div>}
          <div className="flex justify-center mt-10">
            {isSubmitting ? (
              <button
                disabled
                className="w-64 h-12 mt-6 font-light border border-black rounded-none bg-black text-white flex items-center justify-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </button>
            ) : (
              <SlidingButton type="submit" onClick={() => {}} variant="dark" duration={1000} className="w-64 h-12 mt-6">
                ENQUIRE
              </SlidingButton>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
