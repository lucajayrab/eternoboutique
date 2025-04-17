import { z } from "zod"

export const registrationFormSchema = z.object({
  firstname: z.string().min(1, "Please enter your first name"),
  lastname: z.string().min(1, "Please enter your last name"),
  email: z.string().email("Please enter a valid email address (e.g., name@example.com)"),
  phonecontact: z.string().min(1, "Please enter your phone number with country code (e.g., +44 1234567890)"),
  countrylocation: z.string().min(1, "Please enter your country"),
  city: z.string().min(1, "Please enter your city"),
  industrysector: z.string().min(1, "Please enter your industry"),
  dob: z.string().optional(),
})

export type RegistrationFormData = z.infer<typeof registrationFormSchema>
