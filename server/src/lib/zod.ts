import z from "zod";

export const signupZodSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  fullName: z.string().min(1, { message: "Full name is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const loginZodSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters" }),
});
