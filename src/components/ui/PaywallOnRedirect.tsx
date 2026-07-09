"use client";
import { useState } from "react";
import { PaywallModal } from "@/components/ui/PaywallModal";

/**
 * Shown on /preus when the private-zone layout redirects a user whose
 * subscription is not active (?paywall=1). Dismissable.
 */
export function PaywallOnRedirect() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return <PaywallModal onClose={() => setOpen(false)} />;
}
