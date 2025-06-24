// @file: client/src/app/[locale]/page.tsx
import { useTranslations } from "next-intl";
import { UserRole } from '@zbir/types';
export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <main className="flex flex-col items-center justify-center px-6 py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">ZBIR </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{t('zbir')}</p>
      </div>

      <div className="mt-10 max-w-2xl w-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{t('projectTitle')}</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {t.rich('projectDescription', {
            strong: (chunks) => <strong>{chunks}</strong>
          })}
        </p>
      </div>
    </main>
  );
}
