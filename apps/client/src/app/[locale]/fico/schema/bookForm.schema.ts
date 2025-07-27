// @file: client/src/app/[locale]/fico/schema/bookForm.schema.ts
import { z } from 'zod'
import { UserRegion } from '@zbir/types'

export const bookFormSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana'),
  description: z.string().optional(),
  region: z.nativeEnum(UserRegion, { required_error: 'Wybierz region' }),
  openedAt: z.coerce.date({ errorMap: () => ({ message: 'Wprowadź poprawną datę' }) }),
})

export type BookFormData = z.infer<typeof bookFormSchema>
