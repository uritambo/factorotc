import { getTranslations } from 'next-intl/server';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { AlertTriangle, Shield } from 'lucide-react';

export default async function PoliticaPrivacitatPage() {
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

          <h1 className="font-grotesk text-4xl font-bold text-[#F2F2F0] mb-8">{t('privacitat.title')}</h1>

          <div className="border border-white/5 bg-[#15171C] rounded-xl p-8 space-y-6">
            <div className="flex items-start gap-3 bg-[#3D7FFF]/5 border border-[#3D7FFF]/20 rounded-lg p-4">
              <Shield size={18} className="text-[#3D7FFF] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#9CA3AF]">{t('privacitat.content')}</p>
            </div>

            {[
              {
                title: '1. Responsable del tractament',
                content: 'Factor OTC és el responsable del tractament de les teves dades personals. Podeu contactar amb nosaltres a privacitat@factorotc.com.',
              },
              {
                title: '2. Dades que recollim',
                content: 'Recollim les dades que ens proporciones en registrar-te: nom, correu electrònic i telèfon (opcional). També recollim dades d\'ús de la plataforma per millorar el servei.',
              },
              {
                title: '3. Finalitat del tractament',
                content: 'Utilitzem les teves dades per proporcionar els serveis de la plataforma, gestionar la teva subscripció, enviar comunicacions relacionades amb el servei i millorar l\'experiència d\'usuari.',
              },
              {
                title: '4. Base jurídica',
                content: 'El tractament es basa en l\'execució del contracte de serveis, el teu consentiment per a comunicacions de màrqueting i el nostre interès legítim per millorar el servei.',
              },
              {
                title: '5. Els teus drets',
                content: 'Tens dret a accedir, rectificar, suprimir, limitar el tractament, la portabilitat i oposar-te al tractament de les teves dades. Pots exercir-los a privacitat@factorotc.com.',
              },
              {
                title: '6. Conservació de dades',
                content: 'Conservem les teves dades mentre mantinguis el teu compte actiu i durant el temps necessari per complir amb les obligacions legals.',
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
