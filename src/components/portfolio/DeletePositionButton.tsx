"use client";
import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deletePosition } from "@/app/actions/positions";

export function DeletePositionButton({ positionId }: { positionId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Segur que vols eliminar aquesta posició?")) return;
        const formData = new FormData();
        formData.set("positionId", positionId);
        startTransition(() => deletePosition(formData));
      }}
      className="p-2 rounded-lg text-[#9CA3AF] hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors"
      title="Eliminar posició"
    >
      {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}
