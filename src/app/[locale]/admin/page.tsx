import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Users, PieChart, Newspaper, TrendingUp, ArrowRight, GraduationCap } from 'lucide-react';

async function getAdminMetrics() {
  try {
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7)); // dilluns
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const [totalUsers, activeSubscriptions, mentoringThisWeek, pendingArticles] =
      await Promise.all([
        prisma.user.count(),
        prisma.subscription.count({ where: { status: 'ACTIVE' } }),
        prisma.mentoringSession.count({
          where: { status: 'SCHEDULED', scheduledAt: { gte: weekStart, lt: weekEnd } },
        }),
        prisma.newsArticle.count({ where: { status: 'PENDING' } }),
      ]);

    return { totalUsers, activeSubscriptions, mentoringThisWeek, pendingArticles };
  } catch {
    // Sense connexió a la BD (p. ex. entorn de demo) mostrem zeros en lloc de petar
    return { totalUsers: 0, activeSubscriptions: 0, mentoringThisWeek: 0, pendingArticles: 0 };
  }
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('admin');
  const metrics = await getAdminMetrics();

  const stats = [
    { label: t('totalUsers'), value: String(metrics.totalUsers), icon: Users, color: '#00D9A3' },
    { label: t('activeSubscriptions'), value: String(metrics.activeSubscriptions), icon: TrendingUp, color: '#3D7FFF' },
    { label: t('mentoringThisWeek'), value: String(metrics.mentoringThisWeek), icon: GraduationCap, color: '#00D9A3' },
    { label: t('pendingArticles'), value: String(metrics.pendingArticles), icon: Newspaper, color: '#FF5C5C' },
  ];

  const quickLinks = [
    { href: `/${locale}/admin/usuaris`, label: t('users'), icon: Users, desc: 'Gestiona els comptes d\'usuari' },
    { href: `/${locale}/admin/carteres`, label: t('portfolios'), icon: PieChart, desc: 'Visualitza les carteres dels usuaris' },
    { href: `/${locale}/admin/noticies`, label: t('news'), icon: Newspaper, desc: 'Publica i gestiona notícies' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('title')}</h1>
        <p className="text-[#9CA3AF] mt-1">Panell d'administració de Factor OTC</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="border border-white/5 bg-[#15171C] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#9CA3AF]">{stat.label}</p>
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="font-grotesk text-2xl font-bold text-[#F2F2F0] tabular-nums">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-5">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="border border-white/5 bg-[#15171C] rounded-xl p-6 hover:border-white/10 hover:bg-[#1A1D24] transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#3D7FFF]/10 flex items-center justify-center">
                  <Icon size={20} className="text-[#3D7FFF]" />
                </div>
                <ArrowRight size={16} className="text-[#9CA3AF] group-hover:text-[#F2F2F0] transition-colors" />
              </div>
              <h3 className="font-grotesk font-semibold text-[#F2F2F0] mb-1">{link.label}</h3>
              <p className="text-sm text-[#9CA3AF]">{link.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
