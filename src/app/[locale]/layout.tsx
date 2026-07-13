import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';
import { SetHtmlLang } from '@/components/SetHtmlLang';

export const metadata: Metadata = {
  title: 'Factor OTC — Mentoria i formació financera',
  description:
    "Seguiment de cartera d'inversió en temps real, notícies financeres en català i mentoria personalitzada.",
};

// El <html> i el <body> només es renderitzen al layout arrel (src/app/layout.tsx);
// duplicar-los aquí produïa HTML invàlid i errors d'hidratació de React.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <SetHtmlLang locale={locale} />
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}

export function generateStaticParams() {
  return [{ locale: 'ca' }, { locale: 'es' }];
}
