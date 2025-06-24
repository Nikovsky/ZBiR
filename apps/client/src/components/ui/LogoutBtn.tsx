// @file: client/src/components/ui/LogoutBtn.tsx
import { useLogout } from '@/lib/auth/auth.context'

export default function LogoutButton() {
  const logout = useLogout()

  return (
    <button
      onClick={logout}
      className="text-sm text-red-600 hover:underline"
    >
      Wyloguj się
    </button>
  )
}
