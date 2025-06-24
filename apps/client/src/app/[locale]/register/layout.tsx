// @file: apps/client/src/app/[locale]/register/layout.tsx
import { withRolePresetGuard } from '@/lib/auth/withRolePresetGuard'
import { AccessPreset } from '@zbir/types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await withRolePresetGuard(AccessPreset.NON_LOGGED, '/dashboard')
  return <>{children}</>
}
