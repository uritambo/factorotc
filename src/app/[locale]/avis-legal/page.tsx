import { getTranslations } from 'next-intl/server';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { AlertTriangle } from 'lucide-react';

export default async function AvisLegalPage() {
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

          <h1 className="font-grotesk text-4xl font-bold text-[#F2F2F0] mb-8">{t('avisLegal.title')}</h1>

          <div className="border border-white/5 bg-[#15171C] rounded-xl p-8 prose prose-invert max-w-none">
            <p className="text-[#9CA3AF] leading-relaxed whitespace-pre-line">{t('avisLegal.content')}</p>

            <h2 className="font-grotesk text-xl font-semibold text-[#F2F2F0] mt-8 mb-4">Titular del lloc web</h2>
            <p className="text-[#9CA3AF]">
              Factor OTC és una plataforma de serveis financers. Per a qualsevol consulta legal,
              podeu contactar amb nosaltres a través del correu electrònic legal@factorotc.com.
            </p>

            <h2 className="font-grotesk text-xl font-semibold text-[#F2F2F0] mt-8 mb-4">Propietat intel·lectual</h2>
            <p className="text-[#9CA3AF]">
              Tots els continguts d'aquest lloc web, incloent textos, gràfics, imatges, dissenys i
              programari, estan protegits per la legislació de propietat intel·lectual vigent.
            </p>

            <h2 className="font-grotesk text-xl font-semibold text-[#F2F2F0] mt-8 mb-4">Exempció de responsabilitat</h2>
            <p className="text-[#9CA3AF]">
              La informació proporcionada en aquesta plataforma té caràcter purament informatiu i
              educatiu. Factor OTC no és una empresa d'assessorament financer regulada. Tots els
              continguts han de ser interpretats com a informació general i no com a consell
              d'inversió personalitzat. Les inversions en mercats financers comportuen riscos
              significatius, incloent la possibilitat de pèrdua total del capital invertit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
