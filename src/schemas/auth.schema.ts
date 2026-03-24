import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
    .object({
        firstName: z.string().min(2, "First name is required"),
        lastName: z.string().min(2, "Last name is required"),
        email: z.string("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;