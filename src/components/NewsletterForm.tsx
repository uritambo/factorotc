"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle } from "lucide-react";

export function NewsletterForm() {
  const t = useTranslations("landing.newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-[#00D9A3] text-sm">
        <CheckCircle size={16} />
        {t("success")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 bg-[#15171C] border border-white/10 focus:border-[#00D9A3]/50 rounded-lg px-4 py-2.5 text-sm text-[#F2F2F0] placeholder-[#9CA3AF] outline-none transition-all duration-200"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 bg-[#00D9A3] hover:bg-[#00D9A3]/90 disabled:opacity-60 text-[#0A0B0D] font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200"
        >
          <Send size={14} />
          {t("button")}
        </button>
      </div>
      {status === "error" && <p className="text-[#FF5C5C] text-xs mt-2">{t("error")}</p>}
    </form>
  );
}
