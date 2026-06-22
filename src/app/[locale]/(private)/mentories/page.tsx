"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { PaywallModal } from "@/components/ui/PaywallModal";
import { CheckCircle, Clock, FileText, ArrowRight } from "lucide-react";

export default function MentoriesPage() {
  const t = useTranslations("mentoring");
  const { data: session } = useSession();
  const [showPaywall, setShowPaywall] = useState(false);

  const user = session?.user as any;
  const hasSubscription = user?.subscriptionStatus === "ACTIVE";

  const includes = [t("include1"), t("include2"), t("include3"), t("include4")];

  return (
    <div className="max-w-3xl mx-auto">
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          title={t("paywallTitle")}
          description={t("paywallDesc")}
        />
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#F2F2F0]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {t("title")}
        </h1>
        <p className="text-[#9CA3AF] mt-2">{t("subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#15171C] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-[#3D7FFF]" />
            <span className="text-xs text-[#3D7FFF] font-medium uppercase tracking-wide">60 min</span>
          </div>
          <h2 className="text-xl font-bold text-[#F2F2F0] mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {t("price")}
          </h2>
          <p className="text-sm text-[#9CA3AF] mb-5 leading-relaxed">{t("description")}</p>
          <p className="text-xs font-medium text-[#9CA3AF] mb-3 uppercase tracking-wide">{t("includes")}</p>
          <div className="space-y-2">
            {includes.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                <CheckCircle size={14} className="text-[#00D9A3] flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#15171C] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-[#00D9A3]" />
            <span className="text-xs text-[#00D9A3] font-medium uppercase tracking-wide">Informe inicial</span>
          </div>
          <h3 className="text-lg font-semibold text-[#F2F2F0] mb-2">Primera sessió gratuïta</h3>
          <p className="text-sm text-[#9CA3AF] mb-5 leading-relaxed">
            Si encara no has fet la primera sessió de contacte, comença per aquí. És completament gratuïta.
          </p>
          <a
            href="/ca/informe-gratuit"
            className="inline-flex items-center gap-2 text-sm text-[#00D9A3] hover:underline"
          >
            Reservar sessió gratuïta <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {hasSubscription ? (
        <div>
          <h2 className="text-sm font-semibold text-[#F2F2F0] mb-4">{t("bookSession")}</h2>
          <CalendlyEmbed eventType="mentoring" />
        </div>
      ) : (
        <div className="bg-[#15171C] border border-white/5 rounded-xl p-8 text-center">
          <p className="text-[#9CA3AF] text-sm mb-4">{t("paywallDesc")}</p>
          <button
            onClick={() => setShowPaywall(true)}
            className="bg-[#00D9A3] hover:bg-[#00D9A3]/90 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-all duration-200"
          >
            {t("paywallCta")}
          </button>
        </div>
      )}
    </div>
  );
}
