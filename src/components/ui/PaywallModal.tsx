"use client";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Lock, X, Zap } from "lucide-react";
import Link from "next/link";

interface PaywallModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
}

export function PaywallModal({ isOpen = true, onClose, title, description }: PaywallModalProps) {
  const t = useTranslations("paywall");
  const params = useParams();
  const locale = (params?.locale as string) ?? "ca";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 bg-[#15171C] border border-white/10 rounded-xl p-8 shadow-2xl">
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#F2F2F0] transition-colors">
            <X size={20} />
          </button>
        )}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-[#00D9A3]/10 flex items-center justify-center mb-6">
            <Lock size={28} className="text-[#00D9A3]" />
          </div>
          <h2 className="text-2xl font-bold text-[#F2F2F0] mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {title ?? t("title")}
          </h2>
          <p className="text-[#9CA3AF] mb-8">
            {description ?? t("description")}
          </p>
          <Link
            href={`/${locale}/preus`}
            className="w-full flex items-center justify-center gap-2 bg-[#00D9A3] hover:bg-[#00D9A3]/90 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            onClick={onClose}
          >
            <Zap size={18} />
            {t("cta")}
          </Link>
          {onClose && (
            <button onClick={onClose} className="mt-3 text-[#9CA3AF] hover:text-[#F2F2F0] text-sm transition-colors">
              {t("dismiss")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
