import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { TrendingUp, PieChart, Newspaper, Users, Shield, ArrowRight, Check, Star } from 'lucide-react';

function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('landing');
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#00D9A3]/10 border border-[#00D9A3]/20 text-[#00D9A3] text-sm font-medium px-4 py-2 rounded-full mb-8">
          <Star size={14} fill="currentColor" />
          {t('hero.badge')}
        </div>
        <h1 className="font-grotesk text-5xl md:text-7xl font-bold text-[#F2F2F0] mb-6 leading-tight">
          {t('hero.title')}{' '}
          <span className="text-[#00D9A3]">{t('hero.titleHighlight')}</span>
        </h1>
        <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/registre`}
            className="inline-flex items-center justify-center gap-2 bg-[#00D9A3] hover:bg-[#00D9A3]/90 text-[#0A0B0D] font-semibold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,217,163,0.3)] hover:shadow-[0_0_30px_rgba(0,217,163,0.4)] text-lg"
          >
            {t('hero.cta')}
            <ArrowRight size={20} />
          </Link>
          <Link
            href={`/${locale}/preus`}
            className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-[#F2F2F0] font-semibold px-8 py-4 rounded-xl transition-all hover:bg-white/5 text-lg"
          >
            {t('hero.ctaSecondary')}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { label: t('stats.users'), value: '2.400+' },
            { label: t('stats.volume'), value: '180M€' },
            { label: t('stats.satisfaction'), value: '98%' },
            { label: t('stats.sessions'), value: '1.200+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-grotesk text-3xl font-bold text-[#F2F2F0] tabular-nums">{stat.value}</div>
              <div className="text-sm text-[#9CA3AF] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const t = useTranslations('landing.features');
  const features = [
    {
      icon: PieChart,
      title: t('portfolio.title'),
      description: t('portfolio.description'),
      color: '#00D9A3',
    },
    {
      icon: Newspaper,
      title: t('news.title'),
      description: t('news.description'),
      color: '#3D7FFF',
    },
    {
      icon: Users,
      title: t('mentoring.title'),
      description: t('mentoring.description'),
      color: '#00D9A3',
    },
    {
      icon: Shield,
      title: t('security.title'),
      description: t('security.description'),
      color: '#3D7FFF',
    },
  ];

  return (
    <section className="py-24 px-4 bg-[#15171C]/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-grotesk text-4xl font-bold text-[#F2F2F0] mb-4">{t('title')}</h2>
          <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="border border-white/5 bg-[#15171C] rounded-xl p-8 hover:border-white/10 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 className="font-grotesk text-xl font-semibold text-[#F2F2F0] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#9CA3AF] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ locale }: { locale: string }) {
  const t = useTranslations('landing.cta');
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="border border-[#00D9A3]/20 bg-[#00D9A3]/5 rounded-2xl p-12">
          <TrendingUp size={48} className="text-[#00D9A3] mx-auto mb-6" />
          <h2 className="font-grotesk text-4xl font-bold text-[#F2F2F0] mb-4">{t('title')}</h2>
          <p className="text-[#9CA3AF] text-lg mb-8">{t('subtitle')}</p>
          <Link
            href={`/${locale}/registre`}
            className="inline-flex items-center gap-2 bg-[#00D9A3] hover:bg-[#00D9A3]/90 text-[#0A0B0D] font-semibold px-8 py-4 rounded-xl transition-all text-lg"
          >
            {t('button')}
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      <PublicNavbar />
      <HeroSection locale={locale} />
      <FeaturesSection />
      <CtaSection locale={locale} />
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#00D9A3] flex items-center justify-center">
              <TrendingUp size={14} className="text-[#0A0B0D]" />
            </div>
            <span className="font-grotesk font-bold text-[#F2F2F0]">Factor OTC</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-[#9CA3AF]">
            <Link href={`/${locale}/avis-legal`} className="hover:text-[#F2F2F0] transition-colors">Avís Legal</Link>
            <Link href={`/${locale}/termes-i-condicions`} className="hover:text-[#F2F2F0] transition-colors">Termes</Link>
            <Link href={`/${locale}/politica-privacitat`} className="hover:text-[#F2F2F0] transition-colors">Privadesa</Link>
          </div>
          <p className="text-sm text-[#9CA3AF]">© 2024 Factor OTC. Tots els drets reservats.</p>
        </div>
      </footer>
    </div>
  );
}
