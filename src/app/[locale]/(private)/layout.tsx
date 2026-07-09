import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Navbar } from '@/components/layout/Navbar';
import { hasActiveSubscription } from '@/lib/subscription';

// Routes that stay accessible without an active subscription so the user
// can always manage their profile and payment details
const paywallExemptRoutes = ['/perfil', '/subscripcio', '/mentories'];

export default async function PrivateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const user = session.user as { id: string; role?: string };
  const pathname = (await headers()).get('x-pathname') ?? '';
  const pathnameWithoutLocale = pathname.replace(/^\/(ca|es)/, '') || '/';
  const isExempt = paywallExemptRoutes.some((r) => pathnameWithoutLocale.startsWith(r));

  if (!isExempt && user.role !== 'ADMIN') {
    const active = await hasActiveSubscription(user.id);
    if (!active) {
      redirect(`/${locale}/preus?paywall=1`);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      <Navbar
        userRole={(session.user as any).role}
        userName={session.user.name || session.user.email || 'Usuari'}
      />
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
