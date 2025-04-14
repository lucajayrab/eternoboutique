"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import SlidingButton from "@/components/sliding-button"

// Form validation schema
const formSchema = z.object({
  // Personal Info
  firstname: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  age: z.coerce.number().int().optional(),

  // Contact Details
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phonecontact: z.string().regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, {
    message: "Please enter a valid phone number.",
  }),
  countrylocation: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),

  // Preferences
  industrysector: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  private_fitting_interest: z.boolean().default(false),
})

export default function SectionedRegistrationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      age: undefined,
      email: "",
      phonecontact: "",
      countrylocation: "",
      city: "",
      industrysector: "",
      private_fitting_interest: false,
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

  // Section header component for consistency
  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-lg font-medium tracking-wide uppercase text-eterno-gray mb-6 mt-10 first:mt-0">{title}</h3>
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
                    <FormLabel className="text-sm text-eterno-gray font-light">First Name</FormLabel>
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
                    <FormLabel className="text-sm text-eterno-gray font-light">Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="font-light text-sm w-full" />
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
                    <FormLabel className="text-sm text-eterno-gray font-light">Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder=""
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
                    <FormLabel className="text-sm text-eterno-gray font-light">Email</FormLabel>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-eterno-gray font-light">Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="" {...field} className="font-light text-sm w-full" />
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
                    <FormLabel className="text-sm text-eterno-gray font-light">Country</FormLabel>
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
                    <FormLabel className="text-sm text-eterno-gray font-light">City</FormLabel>
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
                    <FormLabel className="text-sm text-eterno-gray font-light">Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} className="font-light text-sm w-full" />
                    </FormControl>
                    <FormMessage className="font-light" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="private_fitting_interest"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-eterno-text data-[state=checked]:border-eterno-text"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-light">I am interested in private fittings</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {submitError && <div className="text-eterno-accent text-sm font-light mt-4">{submitError}</div>}

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
