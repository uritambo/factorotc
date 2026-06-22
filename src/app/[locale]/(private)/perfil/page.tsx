'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { User, Mail, Phone, Globe, Shield, CheckCircle } from 'lucide-react';

export default function PerfilPage() {
  const t = useTranslations('profile');
  const { data: session } = useSession();

  const [form, setForm] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    language: 'ca',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call an API route
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('title')}</h1>
        <p className="text-[#9CA3AF] mt-1">Gestiona la teva informació personal</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[#3D7FFF]/20 flex items-center justify-center">
          <User size={32} className="text-[#3D7FFF]" />
        </div>
        <div>
          <p className="font-grotesk text-xl font-bold text-[#F2F2F0]">{session?.user?.name || 'Usuari'}</p>
          <p className="text-[#9CA3AF]">{session?.user?.email}</p>
          <span className="text-xs bg-[#00D9A3]/10 text-[#00D9A3] px-2 py-0.5 rounded-full mt-1 inline-block">
            {(session?.user as any)?.role === 'ADMIN' ? 'Administrador' : 'Usuari'}
          </span>
        </div>
      </div>

      {/* Personal Info */}
      <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
        <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0] mb-5">{t('personalInfo')}</h2>

        {saved && (
          <div className="flex items-center gap-2 bg-[#00D9A3]/10 border border-[#00D9A3]/20 text-[#00D9A3] rounded-lg px-4 py-3 mb-5">
            <CheckCircle size={16} />
            <span className="text-sm">{t('saved')}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                <User size={14} className="inline mr-1" />
                {t('name')}
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] rounded-lg px-4 py-3 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                <Mail size={14} className="inline mr-1" />
                {t('email')}
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                disabled
                className="w-full bg-white/3 border border-white/5 text-[#9CA3AF] rounded-lg px-4 py-3 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                <Phone size={14} className="inline mr-1" />
                {t('phone')}
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+34 600 000 000"
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] rounded-lg px-4 py-3 transition-colors placeholder-[#9CA3AF]/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                <Globe size={14} className="inline mr-1" />
                {t('language')}
              </label>
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] rounded-lg px-4 py-3 transition-colors"
              >
                <option value="ca">Català</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#00D9A3] hover:bg-[#00D9A3]/90 text-[#0A0B0D] font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            {t('save')}
          </button>
        </form>
      </div>

      {/* Security */}
      <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-[#3D7FFF]" />
          <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0]">{t('security')}</h2>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('currentPassword')}</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] rounded-lg px-4 py-3 transition-colors placeholder-[#9CA3AF]/60"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('newPassword')}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] rounded-lg px-4 py-3 transition-colors placeholder-[#9CA3AF]/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">{t('confirmPassword')}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] rounded-lg px-4 py-3 transition-colors placeholder-[#9CA3AF]/60"
              />
            </div>
          </div>
          <button
            type="submit"
            className="border border-white/10 hover:border-white/20 text-[#F2F2F0] font-semibold px-6 py-2.5 rounded-lg transition-colors hover:bg-white/5"
          >
            {t('savePassword')}
          </button>
        </form>
      </div>
    </div>
  );
}
