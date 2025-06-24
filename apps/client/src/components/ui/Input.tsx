// @file: src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

type InputProps = {
  label: string
  error?: string
  id: string
} & InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...rest }, ref) => {
    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>

        <input
          id={id}
          ref={ref}
          className={clsx(
            'w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500',
            'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
            error ? 'border-red-500' : 'border-gray-300',
            className,
          )}
          {...rest}
        />

        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
