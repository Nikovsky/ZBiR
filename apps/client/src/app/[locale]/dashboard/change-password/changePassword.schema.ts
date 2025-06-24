// @file: client/src/app/[locale]/dashboard/change-password/changePassword.schema.ts

import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Obecne hasło jest wymagane'),
    newPassword: z.string().min(8, 'Nowe hasło musi mieć co najmniej 8 znaków'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Hasła nie są zgodne',
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
