'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TrendingUp, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string || 'ca';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('error'));
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00D9A3] flex items-center justify-center">
              <TrendingUp size={22} className="text-[#0A0B0D]" />
            </div>
            <span className="font-grotesk text-xl font-bold text-[#F2F2F0]">Factor OTC</span>
          </Link>
          <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('title')}</h1>
          <p className="text-[#9CA3AF] mt-2">{t('subtitle')}</p>
        </div>

        <div className="border border-white/5 bg-[#15171C] rounded-2xl p-8">
          {error && (
            <div className="flex items-center gap-3 bg-[#FF5C5C]/10 border border-[#FF5C5C]/20 text-[#FF5C5C] rounded-lg px-4 py-3 mb-6">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] placeholder-[#9CA3AF]/60 rounded-lg px-4 py-3 transition-colors"
                placeholder="tu@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] placeholder-[#9CA3AF]/60 rounded-lg px-4 py-3 pr-12 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#F2F2F0] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00D9A3] hover:bg-[#00D9A3]/90 disabled:opacity-60 disabled:cursor-not-allowed text-[#0A0B0D] font-semibold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(0,217,163,0.2)]"
            >
              {loading ? t('loading') : t('submit')}
            </button>
          </form>

          <p className="text-center text-sm text-[#9CA3AF] mt-6">
            {t('noAccount')}{' '}
            <Link href={`/${locale}/registre`} className="text-[#00D9A3] hover:underline font-medium">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
