// @file: client/src/components/layout/Footer.tsx
import { ThemeSelector } from '@/components/ui/ThemeSelector'
import { LangSelector } from '@/components/ui/LangSelector'
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center py-2 text-sm text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>&copy; {new Date().getFullYear()} ZBIR {t("rights")}</div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <LangSelector />
          <ThemeSelector />
        </div>
      </div>
    </footer>
  )
}
