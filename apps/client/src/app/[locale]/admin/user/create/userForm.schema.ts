// @file: client/src/app/[locale]/admin/user/userForm.schema.ts
import { z } from 'zod'
import { UserRole } from '@zbir/types'

export const userFormSchema = z
  .object({
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string().min(1, 'Email jest wymagany').email('Niepoprawny adres email'),
    password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
    confirmPassword: z.string().min(8, 'Powtórz hasło'),
    role: z.nativeEnum(UserRole, { required_error: 'Wybierz rolę' }),
    isActive: z.boolean(),
    isBlocked: z.boolean(),
    isEmailConfirmed: z.boolean(),
    twoFactorEnabled: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła muszą być takie same',
    path: ['confirmPassword'],
  })

export type UserFormData = z.infer<typeof userFormSchema>
