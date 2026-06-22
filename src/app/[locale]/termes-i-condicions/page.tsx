import { getTranslations } from 'next-intl/server';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { AlertTriangle } from 'lucide-react';

export default async function TermesPage() {
  const t = await getTranslations('legal');

  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      <PublicNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-[#FF5C5C]/10 border border-[#FF5C5C]/20 text-[#FF5C5C] rounded-xl px-5 py-4 mb-8">
            <AlertTriangle size={20} className="flex-shrink-0" />
            <p className="text-sm font-medium">{t('disclaimer')}</p>
          </div>

          <h1 className="font-grotesk text-4xl font-bold text-[#F2F2F0] mb-8">{t('termes.title')}</h1>

          <div className="border border-white/5 bg-[#15171C] rounded-xl p-8 space-y-6">
            <p className="text-[#9CA3AF] leading-relaxed">{t('termes.content')}</p>

            {[
              {
                title: '1. Acceptació dels termes',
                content: 'En accedir i utilitzar la plataforma Factor OTC, l\'usuari accepta íntegrament els presents termes i condicions d\'ús. Si no estàs d\'acord amb algun dels termes, has de deixar d\'utilitzar la plataforma immediatament.',
              },
              {
                title: '2. Accés al servei',
                content: 'Factor OTC et proporciona accés a serveis d\'informació financera. L\'accés complet requereix una subscripció de pagament. Ens reservem el dret de modificar o interrompre el servei en qualsevol moment.',
              },
              {
                title: '3. Compte d\'usuari',
                content: 'Ets responsable de mantenir la confidencialitat del teu compte i contrasenya. Has de notificar-nos immediatament qualsevol ús no autoritzat del teu compte.',
              },
              {
                title: '4. Limitació de responsabilitat',
                content: 'Factor OTC no serà responsable de cap pèrdua financera derivada de l\'ús de la informació proporcionada a la plataforma. La informació té caràcter informatiu i no constitueix assessorament financer.',
              },
              {
                title: '5. Modificació dels termes',
                content: 'Factor OTC es reserva el dret de modificar els presents termes en qualsevol moment. Els canvis seran efectius a partir de la seva publicació a la plataforma.',
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="font-grotesk text-xl font-semibold text-[#F2F2F0] mb-3">{section.title}</h2>
                <p className="text-[#9CA3AF] leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
