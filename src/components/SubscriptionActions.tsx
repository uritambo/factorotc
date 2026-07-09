"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, Zap, Loader2 } from "lucide-react";

interface SubscriptionActionsProps {
  isActive: boolean;
  hasStripeCustomer: boolean;
}

export function SubscriptionActions({ isActive, hasStripeCustomer }: SubscriptionActionsProps) {
  const t = useTranslations("subscription");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function callStripe(endpoint: "portal" | "checkout") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stripe/${endpoint}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setLoading(false);
    }
  }

  const usePortal = isActive && hasStripeCustomer;

  return (
    <div>
      <button
        onClick={() => callStripe(usePortal ? "portal" : "checkout")}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-[#00D9A3] hover:bg-[#00D9A3]/90 disabled:opacity-60 text-[#0A0B0D] font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : usePortal ? <CreditCard size={16} /> : <Zap size={16} />}
        {usePortal ? t("stripePortal") : t("subscribeCta")}
      </button>
      {error && <p className="text-[#FF5C5C] text-xs mt-3">{error}</p>}
      <p className="text-xs text-[#9CA3AF] mt-3">{t("portalHint")}</p>
    </div>
  );
}
