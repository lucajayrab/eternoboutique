import { z } from "zod"

export const registrationFormSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  phonecontact: z.string(),
  countrylocation: z.string(),
  city: z.string(),
  industrysector: z.string(),
  age: z.number().optional(),
  private_fitting_interest: z.boolean().default(false), // ✅ required on output
})

export type RegistrationFormData = z.infer<typeof registrationFormSchema>
