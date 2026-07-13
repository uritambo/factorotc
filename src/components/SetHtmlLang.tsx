"use client";
import { useEffect } from "react";

// El layout arrel no coneix el locale (viu per sobre del segment [locale]),
// així que l'atribut lang del <html> s'actualitza aquí al client.
export function SetHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
