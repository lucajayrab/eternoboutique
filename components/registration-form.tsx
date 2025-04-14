"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import SlidingButton from "@/components/sliding-button"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  age: z.coerce.number().int().min(18, {
    message: "You must be at least 18 years old.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
})

export default function RegistrationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 18,
      country: "",
      city: "",
      phone: "",
      email: "",
      industry: "",
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
            name="firstName"
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
            name="lastName"
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
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Age"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? "" : Number.parseInt(e.target.value, 10)
                      field.onChange(value)
                    }}
                    className="font-light text-sm w-full"
                  />
                </FormControl>
                <FormMessage className="font-light" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="tel" placeholder="Phone" {...field} className="font-light text-sm w-full" />
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
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Industry" {...field} className="font-light text-sm w-full" />
                </FormControl>
                <FormMessage className="font-light" />
              </FormItem>
            )}
          />
          {submitError && <div className="text-eterno-accent text-sm font-light">{submitError}</div>}
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
