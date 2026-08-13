import { NextResponse } from "next/server";
import { getMailEnvStatus } from "@/lib/mail";

export const runtime = "nodejs";

/**
 * Mail env teşhisi — şifre değeri dönmez.
 * Açmak için Cloudflare / .env: MAIL_DEBUG=1
 */
export async function GET() {
  if (process.env.MAIL_DEBUG?.trim() !== "1") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const status = getMailEnvStatus();
  return NextResponse.json({
    ok: true,
    note: "SMTP_PASS değeri güvenlik için gösterilmez",
    ...status,
    tips: [
      "Canlı log: npx wrangler tail",
      "Workers SMTP TCP desteklemez → MAIL_TRANSPORT=http + FormSubmit",
      "SMTP_USER için Punycode: info@xn--efeinaat-rwb.com",
    ],
  });
}
