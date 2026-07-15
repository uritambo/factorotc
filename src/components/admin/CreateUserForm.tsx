"use client";
import { useRef, useState, useTransition } from "react";
import { UserPlus, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { createUserAction } from "@/app/actions/users";

export function CreateUserForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

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
          <UserPlus size={16} className="text-[#00D9A3]" />
          Crear usuari nou
        </span>
        {open ? <ChevronUp size={16} className="text-[#9CA3AF]" /> : <ChevronDown size={16} className="text-[#9CA3AF]" />}
      </button>

      {open && (
        <form
          ref={formRef}
          action={(formData) =>
            startTransition(async () => {
              setMessage(null);
              const result = await createUserAction(formData);
              setMessage({ ok: result.ok, text: result.message });
              if (result.ok) formRef.current?.reset();
            })
          }
          className="px-5 pb-5"
        >
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1">Nom complet</label>
              <input name="name" required placeholder="Joan Garcia" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1">Correu electrònic</label>
              <input name="email" type="email" required placeholder="client@exemple.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1">Contrasenya (mín. 8 caràcters)</label>
              <input name="password" type="text" required minLength={8} placeholder="contrasenya-segura" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1">Telèfon (opcional)</label>
              <input name="phone" placeholder="+34 600 000 000" className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-4">
            <input type="checkbox" name="activateSubscription" defaultChecked className="accent-[#00D9A3]" />
            Activar la subscripció mensual directament
          </label>
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 bg-[#00D9A3] hover:bg-[#00D9A3]/90 disabled:opacity-60 text-[#0A0B0D] font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200"
          >
            {pending ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
            Crear usuari
          </button>
          {message && (
            <p className={`text-xs mt-3 ${message.ok ? "text-[#00D9A3]" : "text-[#FF5C5C]"}`}>{message.text}</p>
          )}
        </form>
      )}
    </div>
  );
}
