import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Space_Grotesk } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Factor OTC — Plataforma d\'Inversió Professional',
  description: 'Factor OTC és la plataforma definitiva per a inversors professionals.',
};

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
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-[#0A0B0D] text-[#F2F2F0] antialiased`}>
        <SessionProvider session={session}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}


export function generateStaticParams() {
  return [{ locale: 'ca' }, { locale: 'es' }];
}
