import { z } from "zod";

const phoneRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

export const NewProfileZod = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  name: z
    .string()
    .min(1, { message: "Please enter full name" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
 
  phone: z
    .string()
    .regex(phoneRegex, { message: "Please enter a valid American phone number" }),
  
});
