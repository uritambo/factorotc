'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  PieChart,
  Newspaper,
  Users,
  CreditCard,
  User,
  LogOut,
  Shield,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

interface NavbarProps {
  userRole?: string;
  userName?: string;
}

export function Navbar({ userRole, userName }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.locale as string || 'ca';

  const navItems = [
    { href: `/${locale}/dashboard`, label: t('dashboard'), icon: LayoutDashboard },
    { href: `/${locale}/cartera`, label: t('portfolio'), icon: PieChart },
    { href: `/${locale}/noticies`, label: t('news'), icon: Newspaper },
    { href: `/${locale}/mentories`, label: t('mentoring'), icon: Users },
    { href: `/${locale}/subscripcio`, label: t('subscription'), icon: CreditCard },
    { href: `/${locale}/perfil`, label: t('profile'), icon: User },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-[#15171C] border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00D9A3] flex items-center justify-center">
            <TrendingUp size={18} className="text-[#0A0B0D]" />
          </div>
          <span className="font-grotesk text-lg font-bold text-[#F2F2F0]">Factor OTC</span>
        </Link>
      </div>

      {/* Nav Items */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                active
                  ? 'bg-[#00D9A3]/10 text-[#00D9A3]'
                  : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F2F2F0]'
              }`}
            >
              <Icon size={18} className={active ? 'text-[#00D9A3]' : ''} />
              <span className="text-sm font-medium">{item.label}</span>
              {active && <ChevronRight size={14} className="ml-auto text-[#00D9A3]" />}
            </Link>
          );
        })}

        {userRole === 'ADMIN' && (
          <Link
            href={`/${locale}/admin`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive(`/${locale}/admin`)
                ? 'bg-[#3D7FFF]/10 text-[#3D7FFF]'
                : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F2F2F0]'
            }`}
          >
            <Shield size={18} />
            <span className="text-sm font-medium">{t('admin')}</span>
          </Link>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <LanguageToggle />
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#3D7FFF]/20 flex items-center justify-center">
            <User size={14} className="text-[#3D7FFF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#F2F2F0] truncate">{userName || 'Usuari'}</p>
            <p className="text-xs text-[#9CA3AF]">{userRole === 'ADMIN' ? 'Admin' : 'Pro'}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="text-[#9CA3AF] hover:text-[#FF5C5C] transition-colors"
            title={t('logout')}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
