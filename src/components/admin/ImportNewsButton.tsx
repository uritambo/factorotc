"use client";
import { useState, useTransition } from "react";
import { DownloadCloud, Loader2 } from "lucide-react";
import { importNewsAction } from "@/app/actions/news";

export function ImportNewsButton({ configured }: { configured: boolean }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (!configured) {
    return (
      <p className="text-xs text-[#9CA3AF]">
        Per importar notícies reals, afegeix <code className="text-[#00D9A3]">FINNHUB_API_KEY</code> a .env
        (clau gratuïta a finnhub.io)
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setMessage(null);
            const result = await importNewsAction();
            setMessage(result.message);
          })
        }
        className="flex items-center gap-2 bg-[#3D7FFF] hover:bg-[#3D7FFF]/90 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <DownloadCloud size={16} />}
        {pending ? "Important…" : "Importar notícies"}
      </button>
      {message && <span className="text-xs text-[#9CA3AF]">{message}</span>}
    </div>
  );
}
