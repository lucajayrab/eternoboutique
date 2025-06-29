"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SlidingButton from "./sliding-button"
import EnhancedPhoneInput from "./enhanced-phone-input"

// Extended schema to match the API
const registrationSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phonecontact: z.string().min(5, "Please enter a valid phone number"),
  countrylocation: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  industrysector: z.string().optional(),
  dob: z.string().optional(),
})

type RegistrationFormData = z.infer<typeof registrationSchema>

export default function SectionedRegistrationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phonecontact: "",
      countrylocation: "",
      city: "",
      industrysector: "",
      dob: "",
    },
  })

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "An unexpected error occurred.")
      }

      // On success, redirect to confirmation page
      router.push("/confirmation")
    } catch (error) {
      console.error("Registration error:", error)
      setSubmitError(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const FormField = ({ name, label, placeholder, children }: any) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs font-light uppercase tracking-wider text-[#5a5a56]/90">
        {label}
      </Label>
      {children}
      {errors[name] && <p className="text-xs font-light text-red-600 mt-1">{errors[name]?.message}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-mulish">
      <div className="w-full max-w-lg">
        <div className="bg-white p-8 md:p-12 shadow-sm">
          <div className="text-center mb-10">
            <h1 className="text-xl md:text-2xl font-light text-[#5a5a56] uppercase tracking-widest mb-3">
              Register Interest
            </h1>
            <p className="text-xs text-[#5a5a56]/70 max-w-sm mx-auto">
              Join our exclusive list for early access and bespoke tailoring opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Details Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="firstname" label="First Name">
                  <Controller
                    name="firstname"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder=""
                        className="h-10 border-eterno-text/20 border-0 border-b bg-transparent px-0 py-1 text-sm font-light focus:outline-none focus:border-eterno-text/50 rounded-none"
                      />
                    )}
                  />
                </FormField>
                <FormField name="lastname" label="Last Name">
                  <Controller
                    name="lastname"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder=""
                        className="h-10 border-eterno-text/20 border-0 border-b bg-transparent px-0 py-1 text-sm font-light focus:outline-none focus:border-eterno-text/50 rounded-none"
                      />
                    )}
                  />
                </FormField>
              </div>
              <FormField name="email" label="Email Address">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder=""
                      className="h-10 border-eterno-text/20 border-0 border-b bg-transparent px-0 py-1 text-sm font-light focus:outline-none focus:border-eterno-text/50 rounded-none"
                    />
                  )}
                />
              </FormField>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <FormField name="phonecontact" label="Phone Number">
                <EnhancedPhoneInput control={control} name="phonecontact" />
              </FormField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField name="countrylocation" label="Country">
                  <Controller
                    name="countrylocation"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder=""
                        className="h-10 border-eterno-text/20 border-0 border-b bg-transparent px-0 py-1 text-sm font-light focus:outline-none focus:border-eterno-text/50 rounded-none"
                      />
                    )}
                  />
                </FormField>
                <FormField name="city" label="City">
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder=""
                        className="h-10 border-eterno-text/20 border-0 border-b bg-transparent px-0 py-1 text-sm font-light focus:outline-none focus:border-eterno-text/50 rounded-none"
                      />
                    )}
                  />
                </FormField>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-6">
              <FormField name="industrysector" label="Industry (Optional)">
                <Controller
                  name="industrysector"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder=""
                      className="h-10 border-eterno-text/20 border-0 border-b bg-transparent px-0 py-1 text-sm font-light focus:outline-none focus:border-eterno-text/50 rounded-none"
                    />
                  )}
                />
              </FormField>
            </div>

            {submitError && <p className="text-sm font-light text-red-600 text-center">{submitError}</p>}

            <div className="pt-4">
              <SlidingButton
                type="submit"
                variant="dark"
                duration={800}
                className="w-full py-4 text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Register Interest"}
              </SlidingButton>
            </div>

            <p className="text-center text-[10px] text-[#5a5a56]/60 pt-4">
              By registering, you agree to our terms and privacy policy. We will never share your information.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
