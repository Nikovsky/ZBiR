// @file: client/src/app/[locale]/register/registerForm.schema.ts
import { z } from 'zod';

export const registerSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z
        .string()
        .min(1, t('Register.errors.email.required'))
        .email(t('Register.errors.email.invalid')),
      password: z
        .string()
        .min(6, t('Register.errors.password.min')),
      confirmPassword: z
        .string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('Register.errors.confirmPassword.match'),
      path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<ReturnType<typeof registerSchema>>;
