// @file: apps/client/src/app/[locale]/camp/layout.tsx
import { withRolePresetGuard } from '@/lib/auth/withRolePresetGuard'
import { AccessPreset } from '@zbir/types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    await withRolePresetGuard(AccessPreset.LOGGED, '/dashboard')
    return <>{children}</>
}
