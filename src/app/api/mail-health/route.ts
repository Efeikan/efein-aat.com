import { NextResponse } from "next/server";
import { getMailEnvStatus } from "@/lib/mail";

export const runtime = "nodejs";

/** MAIL_DEBUG=1 iken Resend env teşhisi (API key değeri dönmez). */
export async function GET() {
  if (process.env.MAIL_DEBUG?.trim() !== "1") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const status = getMailEnvStatus();
  return NextResponse.json({
    ok: true,
    note: "RESEND_API_KEY değeri güvenlik için gösterilmez",
    ...status,
    tips: [
      "Canlı log: npx wrangler tail",
      "Resend: https://resend.com/api-keys",
      "onboarding@resend.dev ile testte alıcı genelde Resend hesap e-postanızdır; domain doğrulayınca info@xn--efeinaat-rwb.com (efeinşaat.com) serbestçe gider",
    ],
  });
}
