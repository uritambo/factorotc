'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { TrendingUp, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function PublicNavbar() {
  const t = useTranslations('nav');
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale as string || 'ca';
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}/informe-gratuit`, label: 'Informe gratuït' },
    { href: `/${locale}/preus`, label: t('subscription') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0B0D]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00D9A3] flex items-center justify-center">
              <TrendingUp size={18} className="text-[#0A0B0D]" />
            </div>
            <span className="font-grotesk text-lg font-bold text-[#F2F2F0]">Factor OTC</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[#00D9A3]'
                    : 'text-[#9CA3AF] hover:text-[#F2F2F0]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium text-[#9CA3AF] hover:text-[#F2F2F0] transition-colors"
            >
              {t('login')}
            </Link>
            <Link
              href={`/${locale}/registre`}
              className="bg-[#00D9A3] hover:bg-[#00D9A3]/90 text-[#0A0B0D] text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {t('register')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#9CA3AF] hover:text-[#F2F2F0]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#15171C] border-t border-white/5 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-[#9CA3AF] hover:text-[#F2F2F0] transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
            <LanguageToggle />
            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium text-[#9CA3AF] hover:text-[#F2F2F0] py-2"
              onClick={() => setMobileOpen(false)}
            >
              {t('login')}
            </Link>
            <Link
              href={`/${locale}/registre`}
              className="bg-[#00D9A3] text-[#0A0B0D] text-sm font-semibold px-4 py-2 rounded-lg text-center"
              onClick={() => setMobileOpen(false)}
            >
              {t('register')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
