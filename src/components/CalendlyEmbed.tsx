"use client";

interface CalendlyEmbedProps {
  eventType: "free-report" | "mentoring";
}

export function CalendlyEmbed({ eventType }: CalendlyEmbedProps) {
  const url =
    eventType === "free-report"
      ? process.env.NEXT_PUBLIC_CALENDLY_FREE_REPORT_URL ?? ""
      : process.env.NEXT_PUBLIC_CALENDLY_MENTORING_URL ?? "";

  const isPlaceholder = !url || url.includes("placeholder");

  return (
    <div className="w-full rounded-xl border border-white/5 overflow-hidden bg-[#15171C]">
      {isPlaceholder ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center p-8">
          <div className="w-12 h-12 rounded-xl bg-[#00D9A3]/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#00D9A3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[#F2F2F0] font-medium">Widget de Calendly</p>
            <p className="text-[#9CA3AF] text-sm mt-1">
              {/* TODO: substituir per URL real de Calendly */}
              Configura la URL de Calendly a les variables d&apos;entorn per habilitar la reserva en línia.
            </p>
          </div>
          <code className="text-xs text-[#00D9A3] bg-[#00D9A3]/10 px-3 py-1.5 rounded-lg">
            {eventType === "free-report"
              ? "NEXT_PUBLIC_CALENDLY_FREE_REPORT_URL"
              : "NEXT_PUBLIC_CALENDLY_MENTORING_URL"}
          </code>
        </div>
      ) : (
        <iframe
          src={url}
          width="100%"
          height="700"
          frameBorder="0"
          title={
            eventType === "free-report"
              ? "Reservar informe gratuït"
              : "Reservar mentoria"
          }
        />
      )}
    </div>
  );
}
