import { z } from "zod"; // Add new import

export const AddTypeZod = z.object({
    type: z.string().min(1, "Please add Type"), 
});
