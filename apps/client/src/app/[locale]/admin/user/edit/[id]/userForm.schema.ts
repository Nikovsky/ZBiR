// @file: client/src/app/[locale]/admin/user/userForm.schema.ts
import { z } from 'zod'
import { UserRole, Gender } from '@zbir/types'

/**
 * Formularz edycji / tworzenia użytkownika (dane konta i personalne)
 */
export const editUserFormSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().optional(),
    username: z.string().optional(),
    email: z.string().min(1, 'Email jest wymagany').email('Niepoprawny adres email'),
    emailVerified: z.coerce.date().optional(),
    image: z.string().optional(),
    isActive: z.boolean(),
    isBlocked: z.boolean(),
    isEmailConfirmed: z.boolean(),
    twoFactorEnabled: z.boolean(),
    role: z.nativeEnum(UserRole),

    // Personal Data
    personalData: z
      .object({
        id: z.string().uuid(),
        firstName: z.string().optional(),
        middleName: z.string().optional(),
        lastName: z.string().optional(),
        phoneNumber: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
        // birthDate: z.coerce.date().optional(),
        birthDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .or(z.literal(''))
          .optional(),
        gender: z.nativeEnum(Gender).optional(),
        canUserEdit: z.boolean(),
      })
      .optional(),
  })

export type EditUserFormData = z.infer<typeof editUserFormSchema>

/**
 * Formularz zmiany hasła admin → user
 */
export const changePasswordSchema = z.object({
  id: z.string().uuid(),
  newPassword: z.string().min(8, 'Nowe hasło musi mieć co najmniej 8 znaków'),
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
