import { z } from "zod";

export const signupSchema = z.object({
    mobno: z.string().trim().length(10).regex(/^\d{10}$/, "Invalid mobile number format"),
    password: z
        .string()
        .min(4, "Password must be at least 4 characters long")
        .max(64, "Password too long"),
    name: z
        .string()
        .trim()
        .min(1, "Name cannot be empty")
        .max(100, "Name too long")
});

export const loginSchema = z.object({
    mobno: z.string().trim().length(10).regex(/^\d{10}$/, "Invalid mobile number format"),
    password: z
        .string()
        .min(4, "Password must be at least 4 characters long")
        .max(64, "Password too long"),
});