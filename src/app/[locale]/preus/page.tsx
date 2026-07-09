import { getTranslations } from "next-intl/server";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { PaywallOnRedirect } from "@/components/ui/PaywallOnRedirect";

export default async function PreusPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ paywall?: string }>;
}) {
  const { locale } = await params;
  const { paywall } = await searchParams;
  const t = await getTranslations("pricing");

  const monthlyFeatures = [t("monthly1"), t("monthly2"), t("monthly3"), t("monthly4"), t("monthly5")];
  const mentoringFeatures = [t("mentoring1"), t("mentoring2"), t("mentoring3"), t("mentoring4")];

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0D] px-6 py-20">
      {paywall && <PaywallOnRedirect />}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#F2F2F0] mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {t("title")}
          </h1>
          <p className="text-[#9CA3AF]">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Monthly */}
          <div className="bg-[#15171C] border border-[#00D9A3]/30 rounded-xl p-8 shadow-[0_0_40px_rgba(0,217,163,0.06)] relative">
            <div className="absolute -top-3 left-6 bg-[#00D9A3] text-black text-xs font-bold px-3 py-1 rounded-full">
              {t("popular")}
            </div>
            <p className="text-xs font-medium text-[#00D9A3] uppercase tracking-wide mb-4">{t("monthlyPlan")}</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-bold text-[#F2F2F0] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {t("monthlyPrice")}
              </span>
              <span className="text-[#9CA3AF]">{t("monthlyPer")}</span>
            </div>
            <p className="text-sm text-[#9CA3AF] mb-6">{t("monthlyDescription")}</p>
            <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-4">{t("monthlyIncludes")}</p>
            <div className="space-y-3 mb-8">
              {monthlyFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-[#F2F2F0]">
                  <CheckCircle size={15} className="text-[#00D9A3] flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <Link
              href={`/${locale}/registre`}
              className="block text-center bg-[#00D9A3] hover:bg-[#00D9A3]/90 text-black font-semibold py-3 rounded-lg text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,217,163,0.2)]"
            >
              {t("getStarted")}
            </Link>
          </div>

          {/* Mentoring */}
          <div className="bg-[#15171C] border border-white/5 rounded-xl p-8">
            <p className="text-xs font-medium text-[#3D7FFF] uppercase tracking-wide mb-4">{t("mentoringTitle")}</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-bold text-[#F2F2F0] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {t("mentoringPrice")}
              </span>
              <span className="text-[#9CA3AF]">{t("mentoringPer")}</span>
            </div>
            <p className="text-sm text-[#9CA3AF] mb-6">{t("mentoringDescription")}</p>
            <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-4">{t("mentoringIncludes")}</p>
            <div className="space-y-3 mb-8">
              {mentoringFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-[#F2F2F0]">
                  <CheckCircle size={15} className="text-[#3D7FFF] flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <Link
              href={`/${locale}/mentories`}
              className="block text-center border border-white/10 hover:border-white/20 text-[#F2F2F0] py-3 rounded-lg text-sm transition-all duration-200"
            >
              {t("bookMentoring")}
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-[#F2F2F0] mb-8 text-center" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {t("faqTitle")}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-[#15171C] border border-white/5 rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#F2F2F0] mb-3">{faq.q}</p>
                    <p className="text-sm text-[#9CA3AF] leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
