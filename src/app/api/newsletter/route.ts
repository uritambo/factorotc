import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

// TODO: connectar amb un proveïdor real de newsletter (Resend, Mailchimp…)
// De moment només validem l'email i responem OK perquè la UI funcioni.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  console.log("[newsletter] nova subscripció:", parsed.data.email);
  return NextResponse.json({ ok: true });
}
