import { z } from "zod"; // Add new import
const MAX_FILE_SIZE = 7 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const phoneRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

export const AddBusinessZod = z.object({
  b_name: z.string().min(1, "Name is required"),
  b_description: z.string().min(1, "Description is required"),
  b_email: z.string().email({ message: "Please enter email address" }),
  b_phone: z.string().regex(phoneRegex, { message: "Please enter a valid American phone number" }),
  b_website: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  b_location: z.string().optional(),
  b_operating_hours:z.string().optional(),
  b_tags:z.string().optional(),
  b_metaname:z.string().optional(),
  b_metades:z.string().optional(),
  // b_state:z.string().min(1, "State is required"),
  // b_country:z.string().min(1, "Country is required"),
  // b_city:z.string().min(1, "City is required"),
  b_zip:z.string().min(1, "Zip code is required"),
  b_facebook: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  b_instagram: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  b_youtube: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  b_tiktok: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  b_twitter: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  b_discount_code:z.string().optional(),
  b_discount_message:z.string().optional(),
  b_language:z.string().optional(),
});
