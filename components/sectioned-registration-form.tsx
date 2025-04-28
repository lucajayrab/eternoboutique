"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import SlidingButton from "@/components/sliding-button"
import { registrationFormSchema, type RegistrationFormData } from "@/lib/form-schema"
import EnhancedPhoneInput from "@/components/enhanced-phone-input"

export default function SectionedRegistrationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formBackupRestored, setFormBackupRestored] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Use the shared schema and type
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phonecontact: "+44 ", // Pre-fill with UK country code
      countrylocation: "",
      city: "",
      industrysector: "",
      dob: "",
    },
  })

  // Try to restore form data from localStorage if available
  useEffect(() => {
    try {
      const savedForm = localStorage.getItem("form_backup")
      if (savedForm) {
        const parsedForm = JSON.parse(savedForm)
        form.reset(parsedForm)
        setFormBackupRestored(true)

        // Clear the notification after 3 seconds
        setTimeout(() => {
          setFormBackupRestored(false)
        }, 3000)
      }
    } catch (error) {
      console.error("Error restoring form data:", error)
    }
  }, [form])

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
    setSubmitSuccess(false)

    try {
      // Ensure phone number is properly formatted
      if (!values.phonecontact.startsWith("+")) {
        values.phonecontact = `+44 ${values.phonecontact}`
      }

      // Store form data in localStorage as backup
      localStorage.setItem("form_backup", JSON.stringify(values))

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
        // Clear backup on success
        localStorage.removeItem("form_backup")

        // Navigate to confirmation page immediately
        router.push("/confirmation")
      } else {
        // Show error message
        setSubmitError(data.message || "Failed to submit registration. Please try again.")
        console.error("Submission error:", data.error)

        // If there are specific field errors, log them
        if (data.details && data.details.length > 0) {
          console.error("Field errors:", data.details)
          setSubmitError(`${submitError} ${data.details.map((d: any) => d.message).join(", ")}`)
        }

        // Even if there's an error with HubSpot, we'll still redirect after a delay
        // since the data might have been submitted successfully to one of the systems
        setTimeout(() => {
          router.push("/confirmation")
        }, 3000)
      }
    } catch (error) {
      console.error("Error:", error)
      setSubmitError(
        "An unexpected error occurred, but your information may have been received. Redirecting shortly...",
      )

      // Even if there's an error, we'll redirect after a delay
      setTimeout(() => {
        router.push("/confirmation")
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Section header component for consistency
  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-lg font-medium tracking-wide uppercase text-[#5a5a56] mb-6 mt-10 first:mt-0">{title}</h3>
  )

  return (
    <div className="w-full max-w-xl mx-auto bg-[#f5f4f1] p-4 sm:p-6 md:p-8 rounded-lg shadow-sm">
      {formBackupRestored && (
        <div className="mb-6 p-3 bg-blue-50 text-blue-700 rounded flex items-center" role="status">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          <span>Your previous form data has been restored.</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-labelledby="form-title" noValidate>
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
                      <Input
                        placeholder=""
                        {...field}
                        className="font-light text-sm w-full"
                        autoComplete="given-name"
                      />
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
                      <Input
                        placeholder=""
                        {...field}
                        className="font-light text-sm w-full"
                        autoComplete="family-name"
                      />
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
                      <Input
                        type="date"
                        placeholder=""
                        {...field}
                        className="font-light text-sm w-full"
                        autoComplete="bday"
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
                    <FormLabel className="text-sm text-[#5a5a56] font-light">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder=""
                        {...field}
                        className="font-light text-sm w-full"
                        autoComplete="email"
                        inputMode="email"
                      />
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
                      <EnhancedPhoneInput
                        control={form.control}
                        name="phonecontact"
                        placeholder="+44 1234567890"
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
                      <Input
                        placeholder=""
                        {...field}
                        className="font-light text-sm w-full"
                        autoComplete="country-name"
                      />
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
                      <Input
                        placeholder=""
                        {...field}
                        className="font-light text-sm w-full"
                        autoComplete="address-level2"
                      />
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

          {/* Accessibility-enhanced status messages */}
          <div aria-live="polite" className="sr-only">
            {submitError && `Form error: ${submitError}`}
            {submitSuccess && "Form submitted successfully. Redirecting to confirmation page."}
            {isSubmitting && "Submitting form, please wait."}
          </div>

          {submitError && (
            <div className="text-red-500 text-sm font-light mt-4 p-3 bg-red-50 rounded" role="alert">
              {submitError}
              <p className="mt-2">However, your information may have been received. Redirecting shortly...</p>
            </div>
          )}

          {/* Add consent text here */}
          <div className="text-xs text-[#5a5a56]/70 text-center mt-6 mb-4">
            By submitting this form, you agree to receive marketing emails from ETERNO. You can unsubscribe at any time.
          </div>

          <div className="flex justify-center mt-10">
            {isSubmitting ? (
              <button
                disabled
                className="w-full sm:w-64 h-12 font-light border border-black rounded-none bg-black text-white flex items-center justify-center"
                aria-busy="true"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </button>
            ) : (
              <SlidingButton
                type="submit"
                onClick={() => {}}
                variant="dark"
                duration={1000}
                className="w-full sm:w-64 h-12"
              >
                ENQUIRE
              </SlidingButton>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
