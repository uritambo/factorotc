import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Check, Zap, Crown, Star } from 'lucide-react';

export default async function SubscripcioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const session = await auth();

  // Mock subscription data
  const subscription = {
    status: 'INACTIVE',
    plan: null,
  };

  const plans = [
    {
      name: 'Gratuït',
      price: '0€',
      period: '/mes',
      description: 'Per a inversors que volen començar',
      icon: Star,
      color: '#9CA3AF',
      current: !subscription.plan || subscription.plan === 'free',
      features: [
        'Informe d\'orientació gratuït',
        'Accés bàsic a notícies',
        'Seguiment de fins a 3 posicions',
        'Tauler bàsic',
      ],
    },
    {
      name: 'Pro',
      price: '49€',
      period: '/mes',
      description: 'Per a inversors seriosos',
      icon: Zap,
      color: '#00D9A3',
      popular: true,
      current: subscription.plan === 'pro',
      features: [
        'Tot del pla Gratuït',
        'Cartera il·limitada',
        'Notícies i anàlisi completes',
        '1 sessió de mentoria al mes',
        'Alertes de mercat',
        'Exportació de dades',
      ],
    },
    {
      name: 'Premium',
      price: '99€',
      period: '/mes',
      description: 'Per a inversors professionals',
      icon: Crown,
      color: '#3D7FFF',
      current: subscription.plan === 'premium',
      features: [
        'Tot del pla Pro',
        'Sessions de mentoria il·limitades',
        'Anàlisi personalitzada',
        'Accés prioritari',
        'Suport dedicat',
        'API d\'accés',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">La meva subscripció</h1>
        <p className="text-[#9CA3AF] mt-1">Gestiona el teu pla i facturació</p>
      </div>

      {/* Current Status */}
      <div className="border border-white/5 bg-[#15171C] rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#9CA3AF] mb-1">Pla actual</p>
            <p className="font-grotesk text-xl font-bold text-[#F2F2F0]">
              {subscription.plan ? subscription.plan : 'Gratuït'}
            </p>
          </div>
          <span className="bg-[#9CA3AF]/10 text-[#9CA3AF] text-sm font-medium px-3 py-1.5 rounded-full">
            Inactiu
          </span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`relative border rounded-xl p-6 flex flex-col transition-all ${
                plan.current
                  ? 'border-[#00D9A3]/30 bg-[#00D9A3]/5'
                  : plan.popular
                  ? 'border-[#00D9A3]/20 bg-[#15171C] hover:border-[#00D9A3]/30'
                  : 'border-white/5 bg-[#15171C] hover:border-white/10'
              }`}
            >
              {plan.popular && !plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#00D9A3] text-[#0A0B0D] text-xs font-bold px-4 py-1.5 rounded-full">
                    Recomanat
                  </span>
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white/10 text-[#F2F2F0] text-xs font-bold px-4 py-1.5 rounded-full">
                    Pla actual
                  </span>
                </div>
              )}

              <div className="mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${plan.color}15` }}
                >
                  <Icon size={22} style={{ color: plan.color }} />
                </div>
                <h3 className="font-grotesk text-xl font-bold text-[#F2F2F0]">{plan.name}</h3>
                <p className="text-sm text-[#9CA3AF] mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="font-grotesk text-3xl font-bold text-[#F2F2F0] tabular-nums">{plan.price}</span>
                <span className="text-[#9CA3AF] text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={14} className="text-[#00D9A3] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-[#9CA3AF]">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <div className="w-full py-2.5 rounded-lg text-center text-sm font-medium bg-white/5 text-[#9CA3AF] cursor-default">
                  Pla actual
                </div>
              ) : (
                <button className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all bg-[#00D9A3] hover:bg-[#00D9A3]/90 text-[#0A0B0D]">
                  Subscriure's
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#9CA3AF] text-center">
        Els pagaments es processen de forma segura a través de Stripe. Pots cancel·lar en qualsevol moment.
      </p>
    </div>
  );
}
