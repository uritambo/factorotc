'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TrendingUp, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegistrePage() {
  const t = useTranslations('auth.register');
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string || 'ca';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: locale,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          preferredLanguage: form.preferredLanguage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('error'));
        return;
      }

      setSuccess(true);

      // Auto sign in
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 1500);
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
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

          {success && (
            <div className="flex items-center gap-3 bg-[#00D9A3]/10 border border-[#00D9A3]/20 text-[#00D9A3] rounded-lg px-4 py-3 mb-6">
              <CheckCircle size={16} />
              <span className="text-sm">{t('success')}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('name')}</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] placeholder-[#9CA3AF]/60 rounded-lg px-4 py-3 transition-colors"
                placeholder="Joan Garcia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('email')}</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] placeholder-[#9CA3AF]/60 rounded-lg px-4 py-3 transition-colors"
                placeholder="tu@exemple.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('phone')}</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] placeholder-[#9CA3AF]/60 rounded-lg px-4 py-3 transition-colors"
                placeholder="+34 600 000 000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('language')}</label>
              <select
                name="preferredLanguage"
                value={form.preferredLanguage}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] rounded-lg px-4 py-3 transition-colors"
              >
                <option value="ca">Català</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('password')}</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] placeholder-[#9CA3AF]/60 rounded-lg px-4 py-3 pr-12 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('confirmPassword')}</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] placeholder-[#9CA3AF]/60 rounded-lg px-4 py-3 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#00D9A3] hover:bg-[#00D9A3]/90 disabled:opacity-60 disabled:cursor-not-allowed text-[#0A0B0D] font-semibold py-3 rounded-lg transition-all mt-2"
            >
              {loading ? t('loading') : t('submit')}
            </button>
          </form>

          <p className="text-center text-sm text-[#9CA3AF] mt-6">
            {t('hasAccount')}{' '}
            <Link href={`/${locale}/login`} className="text-[#00D9A3] hover:underline font-medium">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
