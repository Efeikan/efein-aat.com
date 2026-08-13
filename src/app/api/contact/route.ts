import { NextRequest, NextResponse } from "next/server";
import { CONTACT_EMAIL, escapeHtml, sendMail } from "@/lib/mail";

export const runtime = "nodejs";

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
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #e9efec; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(40, 56, 52, 0.12);">
            <tr>
              <td style="height: 6px; background: ${hazardStripe};"></td>
            </tr>
            <tr>
              <td style="background: linear-gradient(135deg, #2f433e 0%, #43665c 55%, #557f72 100%); padding: 32px;">
                <div style="color: #ffffff; font-size: 19px; font-weight: 700;">Efe İnşaat</div>
                <div style="color: #c2d7ce; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 4px;">Yeni İletişim Formu Mesajı</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 32px 4px 32px;">
                <h1 style="margin: 0; font-size: 20px; color: #1e2a26; font-weight: 700;">Web Sitesinden Yeni Talep</h1>
                <p style="margin: 6px 0 0 0; font-size: 14px; color: #6f9a8c;">Bir ziyaretçi iletişim formu üzerinden yazdı.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 32px 4px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  ${infoRow("👤", "Ad Soyad", safeName)}
                  ${infoRow("📧", "E-posta", safeEmail, `mailto:${safeEmail}`)}
                  ${infoRow("📞", "Telefon", safePhone, phone ? `tel:${safePhone.replace(/\s+/g, "")}` : undefined)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 32px 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background: #f2f7f5; border-radius: 10px; border: 1px solid #e0ebe6; border-left: 4px solid #557f72;">
                  <tr>
                    <td style="padding: 18px 20px;">
                      <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6f9a8c; margin: 0 0 8px 0;">Mesaj</div>
                      <div style="font-size: 15px; line-height: 1.6; color: #1e2a26;">${safeMessage}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 26px 32px 8px 32px;" align="center">
                <a href="mailto:${safeEmail}" style="display: inline-block; background: #557f72; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 10px;">Müşteriye Yanıt Ver</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 32px 28px 32px;">
                <p style="margin: 16px 0 0 0; font-size: 12px; color: #9bb0a8; border-top: 1px solid #e0ebe6; padding-top: 16px;">
                  Gönderim tarihi: <strong style="color: #5a6b64;">${submittedAt}</strong><br>
                  Bu e-posta efeinşaat.com iletişim formundan otomatik oluşturulmuştur.
                </p>
              </td>
            </tr>
            <tr>
              <td style="height: 6px; background: ${hazardStripe};"></td>
            </tr>
          </table>
          <p style="max-width: 600px; margin: 18px 0 0 0; font-size: 11px; color: #9bb0a8; text-align: center;">
            Efe İnşaat &middot; Ataşehir, İstanbul &middot; ${CONTACT_EMAIL}
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const honeypot = typeof body.website === "string" ? body.website.trim() : "";

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Lütfen tüm zorunlu alanları doldurun." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }

    await sendMail({
      subject: `Yeni İletişim Formu Mesajı - ${name}`,
      replyTo: email,
      html: buildEmailHtml(name, email, phone, message),
      text: `Ad: ${name}\nE-posta: ${email}\nTelefon: ${phone || "-"}\n\n${message}`,
      fields: {
        name,
        email,
        phone: phone || "Belirtilmedi",
        message,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Mail gönderilemedi. Lütfen daha sonra tekrar deneyin.",
      },
      { status: 500 }
    );
  }
}
