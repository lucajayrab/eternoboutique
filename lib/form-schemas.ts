import * as z from "zod"

// Shared form schema to ensure type consistency across components
export const registrationFormSchema = z.object({
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
  // Make this explicitly required (not optional) with a default value
  private_fitting_interest: z.boolean().default(false),
})

// Export the type for use in components
export type RegistrationFormData = z.infer<typeof registrationFormSchema>
