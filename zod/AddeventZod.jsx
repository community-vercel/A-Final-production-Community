import { z } from "zod"; // Add new import
const MAX_FILE_SIZE = 7 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const phoneRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

export const AddeventZod = z.object({
  e_name: z.string().min(1, "Name is required"),
  e_description: z.string().min(1, "Description is required"),
  e_email: z.string().email({ message: "Please enter email address" }),
  e_phone: z.string().regex(phoneRegex, { message: "Please enter a valid American phone number" }),
  e_username: z.string().min(1, "Name is required"),
  e_location:z.string().optional(),
  e_participant:z.string().optional(),
  e_metaname:z.string().optional(),
  e_metades:z.string().optional(),
  e_price:z.string().optional(),
  e_paymenttitle:z.string().optional(),
  e_paymentinstruction:z.string().optional(),

  e_zip:z.string().min(1, "Zip code is required"),
  
  e_language:z.string().optional(),
});
