import { z } from "zod"; // Add new import
const MAX_FILE_SIZE = 7 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const phoneRegex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;

export const AddPropertyZod = z.object({
  p_name: z.string().min(1, "Name is required"),
  p_uname: z.string().min(1, "User Name is required").optional(),
  p_price: z.string().min(1, "Price").optional(),
  p_area:z.string().min(1, "Area").optional(),
  p_zip: z.string().min(1, "Zip  required").optional(),
  p_bed:z.string().optional(),
  p_baths:z.string().optional(),
  p_unit:z.string().min(1, "Area  required").optional(),
  p_description: z.string().min(1, "Description is required"),
  p_email: z.string().email({ message: "Please enter email address" }),
  p_phone: z.string().regex(phoneRegex, { message: "Please enter a valid American phone number" }),
  p_metaname:z.string().optional(),
  p_metades:z.string().optional(),
  p_location: z.string().optional(),
  p_operating_hours:z.string().optional(),
  p_tags:z.string().optional(),
  p_purpose:z.string().optional(),
  p_installement:z.string().optional(),

  p_language:z.string().optional(),
});
