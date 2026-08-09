import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "efe.ikan2005@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml(name: string, email: string, phone: string, message: string) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Belirtilmedi");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
  const submittedAt = new Date().toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "long",
    timeStyle: "short",
  });

  const hazardStripe =
    "repeating-linear-gradient(135deg, #f2b705 0px, #f2b705 14px, #1e2a26 14px, #1e2a26 28px)";

  const infoRow = (icon: string, label: string, value: string, href?: string) => `
    <tr>
      <td style="padding: 0 0 14px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background: #f2f7f5; border-radius: 10px; border: 1px solid #e0ebe6;">
          <tr>
            <td style="width: 46px; padding: 14px 0 14px 14px; vertical-align: middle;">
              <div style="width: 34px; height: 34px; background: #557f72; border-radius: 8px; text-align: center; line-height: 34px; font-size: 16px;">${icon}</div>
            </td>
            <td style="padding: 14px 16px 14px 12px; vertical-align: middle;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6f9a8c; margin: 0 0 2px 0;">${label}</div>
              ${
                href
                  ? `<a href="${href}" style="font-size: 15px; font-weight: 600; color: #1e2a26; text-decoration: none;">${value}</a>`
                  : `<div style="font-size: 15px; font-weight: 600; color: #1e2a26;">${value}</div>`
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  return `
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Efe İnşaat - Yeni İletişim Formu Mesajı</title>
  </head>
  <body style="margin: 0; padding: 0; background: #e9efec; font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
      ${safeName} adlı ziyaretçi Efe İnşaat web sitesinden yeni bir mesaj gönderdi.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #e9efec; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(40, 56, 52, 0.12);">

            <!-- Hazard stripe accent -->
            <tr>
              <td style="height: 6px; background: ${hazardStripe};"></td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #2f433e 0%, #43665c 55%, #557f72 100%); padding: 32px 32px 28px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="vertical-align: middle;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width: 48px; height: 48px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); border-radius: 12px; text-align: center; vertical-align: middle; font-size: 24px;">🏗️</td>
                          <td style="padding-left: 14px; vertical-align: middle;">
                            <div style="color: #ffffff; font-size: 19px; font-weight: 700; letter-spacing: 0.02em;">Efe İnşaat</div>
                            <div style="color: #c2d7ce; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 2px;">Pimapen &middot; Cam Balkon &middot; Pergole &middot; Sineklik</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" style="vertical-align: middle;">
                      <span style="display: inline-block; background: rgba(255,255,255,0.15); color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.3);">Yeni Mesaj</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="padding: 28px 32px 4px 32px;">
                <h1 style="margin: 0; font-size: 20px; color: #1e2a26; font-weight: 700;">📋 Web Sitesinden Yeni Talep</h1>
                <p style="margin: 6px 0 0 0; font-size: 14px; color: #6f9a8c;">Bir ziyaretçi iletişim formu üzerinden sizinle iletişime geçmek istiyor.</p>
              </td>
            </tr>

            <!-- Info cards -->
            <tr>
              <td style="padding: 20px 32px 4px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  ${infoRow("👤", "Ad Soyad", safeName)}
                  ${infoRow("📧", "E-posta", safeEmail, `mailto:${safeEmail}`)}
                  ${infoRow("📞", "Telefon", safePhone, phone ? `tel:${safePhone.replace(/\s+/g, "")}` : undefined)}
                </table>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding: 8px 32px 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background: #f2f7f5; border-radius: 10px; border: 1px solid #e0ebe6; border-left: 4px solid #557f72;">
                  <tr>
                    <td style="padding: 18px 20px;">
                      <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6f9a8c; margin: 0 0 8px 0;">💬 Mesaj</div>
                      <div style="font-size: 15px; line-height: 1.6; color: #1e2a26;">${safeMessage}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding: 26px 32px 8px 32px;" align="center">
                <a href="mailto:${safeEmail}" style="display: inline-block; background: #557f72; color: #ffffff; font-size: 14px; font-weight: 700; letter-spacing: 0.03em; text-decoration: none; padding: 14px 32px; border-radius: 10px;">✉️ Müşteriye Yanıt Ver</a>
              </td>
            </tr>

            <!-- Footer note -->
            <tr>
              <td style="padding: 20px 32px 28px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #e0ebe6; padding-top: 16px;">
                  <tr>
                    <td>
                      <p style="margin: 16px 0 0 0; font-size: 12px; color: #9bb0a8;">
                        Gönderim tarihi: <strong style="color: #5a6b64;">${submittedAt}</strong><br>
                        Bu e-posta <strong style="color: #5a6b64;">efeinsaat.com</strong> iletişim formundan otomatik olarak oluşturulmuştur. Yanıtlarken doğrudan "Yanıtla" butonunu kullanabilirsiniz.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Hazard stripe accent -->
            <tr>
              <td style="height: 6px; background: ${hazardStripe};"></td>
            </tr>
          </table>

          <p style="max-width: 600px; margin: 18px 0 0 0; font-size: 11px; color: #9bb0a8; text-align: center;">
            Efe İnşaat &middot; Ataşehir, İstanbul &middot; +90 535 747 77 63
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

async function sendWithResend(name: string, email: string, phone: string, message: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL || "Efe İnşaat Web Formu <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `🏗️ Yeni İletişim Formu Mesajı - ${name}`,
    html: buildEmailHtml(name, email, phone, message),
  });

  if (error) {
    throw new Error(error.message || "Resend mail gönderimi başarısız.");
  }
}

async function sendWithFormSubmit(name: string, email: string, phone: string, message: string) {
  const siteUrl = process.env.SITE_URL || "https://efeinsaat.com";

  const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // FormSubmit rejects requests without a Referer/Origin as "browsed as HTML file"
      Referer: siteUrl,
      Origin: siteUrl,
    },
    body: JSON.stringify({
      name,
      email,
      phone: phone || "Belirtilmedi",
      message,
      _replyto: email,
      _subject: `Yeni İletişim Formu - ${name}`,
      _template: "table",
      _captcha: "false",
    }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.message || data.error || "FormSubmit mail gönderimi başarısız.");
  }

  // FormSubmit returns success as the STRING "false" (not boolean false) on failure,
  // e.g. when the destination inbox still needs one-time activation.
  if (String(data.success) === "false") {
    throw new Error(data.message || "Mail gönderilemedi.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const honeypot = typeof body.website === "string" ? body.website.trim() : "";

    // Honeypot: bots fill hidden fields
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Lütfen tüm zorunlu alanları doldurun." },
        { status: 400 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    }

    if (process.env.RESEND_API_KEY) {
      await sendWithResend(name, email, phone, message);
    } else {
      await sendWithFormSubmit(name, email, phone, message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json(
      {
        error:
          "Mail gönderilemedi. İlk kullanımda efe.ikan2005@gmail.com adresine gelen onay mailini onaylayın, ardından tekrar deneyin.",
      },
      { status: 500 }
    );
  }
}
