import { z } from "zod"

export const registrationFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phonecontact: z
    .string()
    .min(5, "Phone number is too short")
    .refine((val) => !val || /^\+\d+\s*\d+$/.test(val), {
      message: "Please enter a valid phone number",
    }),
  countrylocation: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  industrysector: z.string().min(1, "Industry is required"),
  dob: z.string().optional(),
})

export type RegistrationFormData = z.infer<typeof registrationFormSchema>
