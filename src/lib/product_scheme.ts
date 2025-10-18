import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  price: z
    .number()
    .positive("Price must be greater than 0")
    .max(999999999, "Price is too large")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "Price can have maximum 2 decimal places",
    }),
  images: z
    .array(z.string().url("Invalid image URL format"))
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),
  categoryId: z.string().min(1, "Category is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;
