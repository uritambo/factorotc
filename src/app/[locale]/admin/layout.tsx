import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      <Navbar
        userRole={(session.user as any).role}
        userName={session.user.name || session.user.email || 'Admin'}
      />
      <main className="ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
