import { getTranslations } from 'next-intl/server';
import { Users, Shield, User, Mail, Calendar } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Admin Usuari', email: 'admin@factorotc.com', role: 'ADMIN', createdAt: '2024-01-01', subscription: 'Pro' },
  { id: '2', name: 'Joan Garcia', email: 'joan@exemple.com', role: 'USER', createdAt: '2024-01-05', subscription: 'Pro' },
  { id: '3', name: 'Maria López', email: 'maria@exemple.com', role: 'USER', createdAt: '2024-01-10', subscription: null },
  { id: '4', name: 'Pere Martínez', email: 'pere@exemple.com', role: 'USER', createdAt: '2024-01-15', subscription: 'Premium' },
  { id: '5', name: 'Anna Puig', email: 'anna@exemple.com', role: 'USER', createdAt: '2024-01-20', subscription: null },
];

export default async function UsuarisPage() {
  const t = await getTranslations('admin');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('users')}</h1>
          <p className="text-[#9CA3AF] mt-1">{t('userList')}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#00D9A3]/10 text-[#00D9A3] px-4 py-2 rounded-lg">
          <Users size={16} />
          <span className="font-semibold tabular-nums">{mockUsers.length} usuaris</span>
        </div>
      </div>

      <div className="border border-white/5 bg-[#15171C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Usuari</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Rol</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Subscripció</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Registre</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3D7FFF]/15 flex items-center justify-center">
                        <User size={14} className="text-[#3D7FFF]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F2F2F0]">{user.name}</p>
                        <p className="text-xs text-[#9CA3AF] flex items-center gap-1">
                          <Mail size={10} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-[#3D7FFF]/10 text-[#3D7FFF]'
                          : 'bg-white/5 text-[#9CA3AF]'
                      }`}
                    >
                      {user.role === 'ADMIN' && <Shield size={10} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.subscription ? (
                      <span className="text-xs font-medium text-[#00D9A3] bg-[#00D9A3]/10 px-2.5 py-1 rounded-full">
                        {user.subscription}
                      </span>
                    ) : (
                      <span className="text-xs text-[#9CA3AF]">Gratuït</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(user.createdAt).toLocaleDateString('ca-ES')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
