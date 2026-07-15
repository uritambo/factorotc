"use client";
import { useRef, useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { addPosition } from "@/app/actions/positions";

interface PositionFormProps {
  /** Si és un admin editant la cartera d'un altre usuari */
  targetUserId?: string;
}

export function PositionForm({ targetUserId }: PositionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await addPosition(formData);
        formRef.current?.reset();
      } catch {
        setError("No s'ha pogut afegir la posició. Revisa les dades.");
      }
    });
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] placeholder-[#9CA3AF]/60 rounded-lg px-3 py-2 text-sm transition-colors tabular-nums";

  return (
    <form ref={formRef} action={handleSubmit} className="border border-white/5 bg-[#15171C] rounded-xl p-5">
      <h3 className="font-grotesk font-semibold text-[#F2F2F0] mb-4 flex items-center gap-2">
        <Plus size={16} className="text-[#00D9A3]" />
        Afegir posició
      </h3>
      {targetUserId && <input type="hidden" name="targetUserId" value={targetUserId} />}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div>
          <label className="block text-xs text-[#9CA3AF] mb-1">Ticker</label>
          <input name="ticker" required placeholder="AAPL, ITX.MC…" className={inputClass} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block text-xs text-[#9CA3AF] mb-1">Empresa</label>
          <input name="companyName" required placeholder="Apple Inc." className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-[#9CA3AF] mb-1">Quantitat</label>
          <input name="quantity" type="number" step="any" min="0" required placeholder="10" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-[#9CA3AF] mb-1">Preu de compra</label>
          <input name="avgBuyPrice" type="number" step="any" min="0" required placeholder="150.00" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs text-[#9CA3AF] mb-1">Data de compra</label>
          <input name="purchaseDate" type="date" className={inputClass} />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-2 bg-[#00D9A3] hover:bg-[#00D9A3]/90 disabled:opacity-60 text-[#0A0B0D] font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-200"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Afegir
          </button>
        </div>
      </div>
      <p className="text-xs text-[#9CA3AF] mt-3">
        Per a valors europeus fes servir el símbol de Yahoo Finance (p. ex. <code className="text-[#00D9A3]">ITX.MC</code> per
        Inditex, <code className="text-[#00D9A3]">MC.PA</code> per LVMH). Els fons indexats/ETFs també funcionen (p. ex.{" "}
        <code className="text-[#00D9A3]">VWCE.DE</code>).
      </p>
      {error && <p className="text-[#FF5C5C] text-xs mt-2">{error}</p>}
    </form>
  );
}
