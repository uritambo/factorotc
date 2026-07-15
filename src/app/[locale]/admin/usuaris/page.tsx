import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { CreateUserForm } from '@/components/admin/CreateUserForm';
import { toggleSubscription } from '@/app/actions/users';
import { Users, Shield, User, Mail } from 'lucide-react';

async function getUsers() {
  try {
    return await prisma.user.findMany({
      include: { subscription: { select: { status: true } } },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export default async function UsuarisPage() {
  const t = await getTranslations('admin');
  const users = await getUsers();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('users')}</h1>
          <p className="text-[#9CA3AF] mt-1">{t('userList')}</p>
        </div>
        <div className="flex items-center gap-2 bg-[#00D9A3]/10 text-[#00D9A3] px-4 py-2 rounded-lg">
          <Users size={16} />
          <span className="font-semibold tabular-nums">{users.length} usuaris</span>
        </div>
      </div>

      <CreateUserForm />

      <div className="border border-white/5 bg-[#15171C] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Usuari</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Rol</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Subscripció</th>
                <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Registre</th>
                <th className="text-right text-xs font-medium text-[#9CA3AF] px-6 py-4">Accions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#9CA3AF]">
                    No s&apos;han pogut carregar els usuaris (base de dades no disponible)
                  </td>
                </tr>
              )}
              {users.map((user) => {
                const isActive = user.subscription?.status === 'ACTIVE';
                return (
                  <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3D7FFF]/15 flex items-center justify-center">
                          <User size={14} className="text-[#3D7FFF]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#F2F2F0]">{user.name ?? '—'}</p>
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
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          isActive ? 'bg-[#00D9A3]/10 text-[#00D9A3]' : 'bg-[#9CA3AF]/10 text-[#9CA3AF]'
                        }`}
                      >
                        {isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#9CA3AF] tabular-nums">
                        {user.createdAt.toLocaleDateString('ca-ES')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={toggleSubscription} className="inline">
                        <input type="hidden" name="userId" value={user.id} />
                        <input type="hidden" name="activate" value={isActive ? 'false' : 'true'} />
                        <button
                          type="submit"
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-[#FF5C5C]/10 text-[#FF5C5C] hover:bg-[#FF5C5C]/20'
                              : 'bg-[#00D9A3]/10 text-[#00D9A3] hover:bg-[#00D9A3]/20'
                          }`}
                        >
                          {isActive ? 'Desactivar subscripció' : 'Activar subscripció'}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
