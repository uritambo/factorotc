import { getTranslations } from "next-intl/server";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { CheckCircle } from "lucide-react";

export default async function InformeGratuitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("freeReport");

  const includes = [t("include1"), t("include2"), t("include3"), t("include4")];

  return (
    <div className="min-h-screen bg-[#0A0B0D] px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#00D9A3]/10 border border-[#00D9A3]/20 rounded-full px-4 py-1.5 text-sm text-[#00D9A3] mb-6 font-medium">
            Completament gratuït · Sense compromís
          </div>
          <h1 className="text-4xl font-bold text-[#F2F2F0] mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {t("title")}
          </h1>
          <p className="text-[#9CA3AF] text-lg leading-relaxed max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-[#15171C] border border-white/5 rounded-xl p-6">
            <p className="text-sm font-medium text-[#9CA3AF] uppercase tracking-wide mb-4">{t("includes")}</p>
            <div className="space-y-3">
              {includes.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-[#F2F2F0]">
                  <CheckCircle size={15} className="text-[#00D9A3] flex-shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#15171C] border border-white/5 rounded-xl p-6">
            <p className="text-sm text-[#9CA3AF] leading-relaxed">{t("description")}</p>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-[#9CA3AF]/60">{t("noCommitment")}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#F2F2F0] mb-4">{t("bookNow")}</h2>
          <CalendlyEmbed eventType="free-report" />
        </div>
      </div>
    </div>
  );
}
