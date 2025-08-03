import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1)
  .max(255);

export const passwordSchema = z.string().trim().min(6, "Password must be at least 6 characters long");

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
  password: z.string().trim().min(6, "Password must be at least 6 characters long"),
});

export const resendVerificationSchema = z.object({
  email: emailSchema,
});
