import { z } from 'zod';
const phoneRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

export const RegisterZod = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    fullname: z.string().min(1, { message: "Please enter your full name" }),
    // phone: z
    // .string()
    // .regex(phoneRegex, { message: "Please enter a valid American phone number" }),
    // role: z
    //   .array(z.string())
    //   .min(1, { message: "Please select at least one role" })
    //   .max(5, { message: "You can select up to 5 roles" }), // Adjust max based on your needs
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .max(20, { message: "Password is too long" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Path of error
  });
