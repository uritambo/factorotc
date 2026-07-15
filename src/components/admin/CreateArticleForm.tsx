"use client";
import { useRef, useState, useTransition } from "react";
import { Plus, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { createArticle } from "@/app/actions/news";

export function CreateArticleForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] placeholder-[#9CA3AF]/60 rounded-lg px-3 py-2 text-sm transition-colors";

  return (
    <div className="border border-white/5 bg-[#15171C] rounded-xl">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-grotesk font-semibold text-[#F2F2F0] flex items-center gap-2">
          <Plus size={16} className="text-[#00D9A3]" />
          Crear notícia manualment
        </span>
        {open ? <ChevronUp size={16} className="text-[#9CA3AF]" /> : <ChevronDown size={16} className="text-[#9CA3AF]" />}
      </button>

      {open && (
        <form
          ref={formRef}
          action={(formData) =>
            startTransition(async () => {
              setError(null);
              try {
                await createArticle(formData);
                formRef.current?.reset();
                setOpen(false);
              } catch {
                setError("No s'ha pogut crear la notícia. Revisa les dades.");
              }
            })
          }
          className="px-5 pb-5 space-y-3"
        >
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-1">Titular</label>
            <input name="title" required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-1">Resum</label>
            <textarea name="summary" required rows={3} className={inputClass} />
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1">Font</label>
              <input name="source" placeholder="Factor OTC" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1">URL (opcional)</label>
              <input name="url" placeholder="https://…" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1">Tickers (separats per comes)</label>
              <input name="relatedTickers" placeholder="ITX.MC, AAPL" className={inputClass} />
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 bg-[#00D9A3] hover:bg-[#00D9A3]/90 disabled:opacity-60 text-[#0A0B0D] font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200"
          >
            {pending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Publicar notícia
          </button>
          {error && <p className="text-[#FF5C5C] text-xs">{error}</p>}
        </form>
      )}
    </div>
  );
}
