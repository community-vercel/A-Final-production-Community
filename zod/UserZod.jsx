import { z } from "zod";

const phoneRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

export const UserZod = z.object({

    email: z.string().email({ message: "Please enter a valid email address" }),
    name: z.string().min(1, { message: "Please enter your full name" }),
    phone: z
    .string()
    .regex(phoneRegex, { message: "Please enter a valid American phone number" }),
    // role: z
    //   .array(z.string())
    //   .min(1, { message: "Please select at least one role" })
    //   .max(5, { message: "You can select up to 5 roles" }), // Adjust max based on your needs
 
  })

