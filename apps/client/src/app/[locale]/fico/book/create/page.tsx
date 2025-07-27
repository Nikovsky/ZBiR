'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { UserRegion } from '@zbir/types'
import { notify } from '@/store/notification.zustand'
import KeyValueTable from '@/components/ui/KeyValueTable'
import { createFicoBook } from '@/lib/api/fico-book.api'
import { bookFormSchema, BookFormData } from './../../schema/bookForm.schema'

export default function FicoBookCreatePage() {
  const router = useRouter()
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      name: '',
      description: '',
      region: UserRegion.NONE,
      openedAt: new Date(),
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = async (data: BookFormData) => {
    try {
      await createFicoBook(data)
      notify.success('Księga została utworzona.', 3)
      router.push('/fico/book')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Błąd podczas tworzenia księgi'
      notify.error(msg, 4)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Utwórz nową księgę</h1>
        <button onClick={() => router.back()} className="btn btn-sm btn-outline">
          ⬅ Wróć
        </button>
      </div>

      <p className="text-sm text-base-content/70">
        Wypełnij formularz, aby utworzyć nową księgę finansową.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <KeyValueTable
          rows={[
            {
              label: 'Nazwa księgi',
              content: (
                <>
                  <input {...register('name')} className="input input-sm input-bordered w-full" />
                  {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
                </>
              ),
            },
            {
              label: 'Opis',
              content: (
                <textarea {...register('description')} className="textarea textarea-sm textarea-bordered w-full" rows={2} />
              ),
            },
            {
              label: 'Region',
              content: (
                <>
                  <select {...register('region')} className="select select-sm select-bordered w-full">
                    {Object.values(UserRegion).map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  {errors.region && <p className="text-xs text-error mt-1">{errors.region.message}</p>}
                </>
              ),
            },
            {
              label: 'Data otwarcia',
              content: (
                <>
                  <input
                    type="date"
                    {...register('openedAt')}
                    className="input input-sm input-bordered w-full"
                  />
                  {errors.openedAt && <p className="text-xs text-error mt-1">{errors.openedAt.message}</p>}
                </>
              ),
            },
          ]}
        />

        <div className="flex justify-end gap-4">
          <button type="submit" className="btn btn-success btn-sm" disabled={isSubmitting}>
            Utwórz księgę
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => reset()}>
            Resetuj formularz
          </button>
        </div>
      </form>
    </div>
  )
}
