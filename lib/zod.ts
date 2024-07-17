import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Use a valid email"),
  password: z.string().min(8, "Password must contain atleast 8 characters"),
  role: z.string().refine((value) => {
    if (value === "admin" || value === "partner" || value === "volunteer")
      return true;
  }, "Not a valid role"),
});

export const passwordResetSchema = z.object({
  email: z.string().email("Use a valid email"),
});

export const addOrgSchema = z.object({
  name: z.string(),
  email: z.string().email("Use a valid email"),
});

export const setPasswordSchema = z.object({
  password1: z
    .string()
    .min(8, "Password must contain atleast 8 characters")
    .refine((value) => {
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':",./<>?|\\ ]/.test(
        value,
      );
      return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    }, "Password must contain at least one uppercase letter, lowercase letter, number, and special character"),
  password2: z.string(),
});
