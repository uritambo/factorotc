import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSubscription } from '@/lib/subscription';
import { SubscriptionActions } from '@/components/SubscriptionActions';
import { CalendarDays, GraduationCap, FileText } from 'lucide-react';

type MentoringHistoryItem = {
  id: string;
  scheduledAt: Date;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  type: 'FREE_REPORT' | 'EXTRA_MENTORING';
  price: number;
};

async function getMentoringHistory(userId: string): Promise<MentoringHistoryItem[]> {
  try {
    return await prisma.mentoringSession.findMany({
      where: { userId },
      orderBy: { scheduledAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export default async function SubscripcioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('subscription');
  const tMentoring = await getTranslations('mentoring');
  const session = await auth();

  const userId = (session?.user as { id: string } | undefined)?.id ?? '';
  const subscription = userId ? await getSubscription(userId) : null;
  const history = userId ? await getMentoringHistory(userId) : [];

  const isActive = subscription?.status === 'ACTIVE';
  const statusLabel =
    subscription?.status === 'ACTIVE'
      ? t('active')
      : subscription?.status === 'CANCELLED'
      ? t('cancelled')
      : t('inactive');
  const statusClasses = isActive
    ? 'bg-[#00D9A3]/10 text-[#00D9A3]'
    : subscription?.status === 'CANCELLED'
    ? 'bg-[#FF5C5C]/10 text-[#FF5C5C]'
    : 'bg-[#9CA3AF]/10 text-[#9CA3AF]';

  const dateFormatter = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'ca-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const statusKey = { SCHEDULED: 'scheduled', COMPLETED: 'completed', CANCELLED: 'cancelled' } as const;
  const typeKey = { FREE_REPORT: 'free_report', EXTRA_MENTORING: 'extra_mentoring' } as const;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('title')}</h1>
        <p className="text-[#9CA3AF] mt-1">{t('subtitle')}</p>
      </div>

      {/* Estat actual */}
      <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-[#9CA3AF] mb-1">{t('plan')}</p>
            <p className="font-grotesk text-xl font-bold text-[#F2F2F0]">{t('planName')}</p>
          </div>
          <span className={`self-start sm:self-auto text-sm font-medium px-3 py-1.5 rounded-full ${statusClasses}`}>
            {statusLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-6">
          <CalendarDays size={15} />
          <span>{t('renewalDate')}:</span>
          <span className="text-[#F2F2F0] tabular-nums">
            {subscription?.renewalDate ? dateFormatter.format(subscription.renewalDate) : t('noRenewal')}
          </span>
        </div>

        <SubscriptionActions
          isActive={isActive}
          hasStripeCustomer={Boolean(subscription?.stripeCustomerId)}
        />
      </div>

      {/* Historial de mentories */}
      <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
        <h2 className="font-grotesk text-lg font-semibold text-[#F2F2F0] mb-5">
          {t('mentoringHistory')}
        </h2>

        {history.length === 0 ? (
          <div className="flex flex-col items-center text-center py-8 gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#3D7FFF]/10 flex items-center justify-center">
              <GraduationCap size={22} className="text-[#3D7FFF]" />
            </div>
            <p className="text-sm text-[#9CA3AF]">{t('noMentorings')}</p>
            <Link
              href={`/${locale}/mentories`}
              className="text-sm text-[#00D9A3] hover:underline font-medium"
            >
              {t('bookFirstMentoring')}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#9CA3AF] uppercase tracking-wide border-b border-white/5">
                  <th className="pb-3 pr-4 font-medium">{t('date')}</th>
                  <th className="pb-3 pr-4 font-medium">{t('type')}</th>
                  <th className="pb-3 pr-4 font-medium">{t('sessionStatus')}</th>
                  <th className="pb-3 font-medium text-right">{t('price')}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-4 text-[#F2F2F0] tabular-nums">
                      {dateFormatter.format(item.scheduledAt)}
                    </td>
                    <td className="py-3 pr-4 text-[#9CA3AF]">
                      <span className="inline-flex items-center gap-1.5">
                        {item.type === 'FREE_REPORT' ? (
                          <FileText size={13} className="text-[#00D9A3]" />
                        ) : (
                          <GraduationCap size={13} className="text-[#3D7FFF]" />
                        )}
                        {tMentoring(`type.${typeKey[item.type]}`)}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-[#9CA3AF]">
                      {tMentoring(`status.${statusKey[item.status]}`)}
                    </td>
                    <td className="py-3 text-right text-[#F2F2F0] tabular-nums">
                      {item.price > 0 ? `${item.price.toFixed(2)}€` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
