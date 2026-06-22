'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === 'ca' ? 'es' : 'ca';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#F2F2F0] transition-colors text-sm px-2 py-1 rounded-md hover:bg-white/5"
      title={locale === 'ca' ? 'Cambiar a Español' : 'Canviar a Català'}
    >
      <Globe size={16} />
      <span className="font-medium uppercase">{locale === 'ca' ? 'ES' : 'CA'}</span>
    </button>
  );
}
