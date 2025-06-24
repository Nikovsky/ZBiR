// @file: client/src/components/ui/Throbber.tsx
import clsx from 'clsx'

type ThrobberProps = {
  className?: string
}

export const Throbber = ({ className }: ThrobberProps) => {
  return (
    <svg
      className={clsx('animate-spin text-white dark:text-gray-100', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}
