import { NextRequest, NextResponse } from "next/server";
import {
  DISPLAY_EMAIL,
  escapeHtml,
  sendMail,
  toClientMailError,
} from "@/lib/mail";

export const runtime = "nodejs";

const SITE_URL = "https://efeinsaat.com";
const SITE_DISPLAY = "efeinsaat.com";

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
                  Bu e-posta <a href="${SITE_URL}" style="color:#557f72;text-decoration:none;">${SITE_DISPLAY}</a> iletişim formundan otomatik oluşturulmuştur.
                </p>
              </td>
            </tr>
            <tr>
              <td style="height: 6px; background: ${hazardStripe};"></td>
            </tr>
          </table>
          <p style="max-width: 600px; margin: 18px 0 0 0; font-size: 11px; color: #9bb0a8; text-align: center;">
            Efe İnşaat &middot; Ataşehir, İstanbul &middot; <a href="${SITE_URL}" style="color:#557f72;text-decoration:none;">${SITE_DISPLAY}</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/** Formu dolduran kullanıcıya giden teşekkür / onay e-postası */
function buildCustomerConfirmationHtml(
  name: string,
  email: string,
  phone: string,
  message: string
) {
  const safeName = escapeHtml(name);
  const summaryRows = [
    ["Ad Soyad", name],
    ["E-posta", email],
    ["Telefon", phone || "Belirtilmedi"],
  ]
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:12px 14px;border-bottom:1px solid #e8efec;width:38%;vertical-align:top;">
          <span style="display:block;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6f9a8c;">${escapeHtml(label)}</span>
        </td>
        <td style="padding:12px 14px;border-bottom:1px solid #e8efec;vertical-align:top;">
          <span style="font-size:14px;font-weight:600;color:#1e2a26;line-height:1.45;">${escapeHtml(value)}</span>
        </td>
      </tr>`
    )
    .join("");

  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Mesajınız Alındı | Efe İnşaat</title>
</head>
<body style="margin:0;padding:0;background:#e9efec;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9efec;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d7e3de;">

          <tr>
            <td style="background:linear-gradient(135deg,#2f433e 0%,#43665c 55%,#557f72 100%);padding:32px 28px 28px 28px;">
              <div style="font-size:13px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.78);">Efe İnşaat</div>
              <h1 style="margin:12px 0 0 0;font-size:24px;line-height:1.3;font-weight:700;color:#ffffff;">Mesajınız Bize Ulaştı</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 28px 8px 28px;">
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.55;color:#1e2a26;">
                Sayın <strong>${safeName}</strong>,
              </p>
              <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#3d524b;">
                Efe İnşaat iletişim formunu doldurduğunuz için teşekkür ederiz. Mesajınız ekibimize başarıyla ulaşmıştır.
              </p>
              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.65;color:#3d524b;">
                Uzman ekibimiz en kısa sürede tarafınızla iletişime geçecektir.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 8px 28px;">
              <div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6f9a8c;margin:0 0 10px 2px;">
                Mesajınızın Özeti
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0ebe6;border-radius:12px;overflow:hidden;background:#fbfdfc;">
                ${summaryRows}
                <tr>
                  <td colspan="2" style="padding:14px;background:#f2f7f5;">
                    <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6f9a8c;margin-bottom:6px;">Mesaj</div>
                    <div style="font-size:14px;color:#2f433e;line-height:1.55;">${safeMessage}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 8px 28px;" align="center">
              <a href="${SITE_URL}" style="display:inline-block;padding:12px 22px;background:#557f72;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:10px;">
                Web Sitemizi Ziyaret Edin
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:28px;border-top:1px solid #e8efec;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:12px;">
                    <div style="font-size:15px;font-weight:700;color:#2f433e;">Efe İnşaat</div>
                    <div style="font-size:13px;color:#6f9a8c;margin-top:4px;line-height:1.5;">
                      Ataşehir, İstanbul<br />
                      Pimapen · Cam Balkon · Pergole · Sineklik
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:13px;line-height:1.7;color:#557f72;">
                    <a href="mailto:${DISPLAY_EMAIL}" style="color:#557f72;text-decoration:none;">${DISPLAY_EMAIL}</a><br />
                    <a href="${SITE_URL}" style="color:#557f72;text-decoration:none;">${SITE_DISPLAY}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;font-size:11px;line-height:1.5;color:#9bb0a8;">
                    Bu e-posta, iletişim formunuzu gönderdiğiniz için otomatik olarak iletilmiştir.
                    Yanıtlamak için bu mesaja cevap yazabilir veya ${DISPLAY_EMAIL} adresine ulaşabilirsiniz.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildCustomerConfirmationText(
  name: string,
  email: string,
  phone: string,
  message: string
) {
  return `Sayın ${name},

Efe İnşaat iletişim formunu doldurduğunuz için teşekkür ederiz. Mesajınız ekibimize başarıyla ulaşmıştır.

Uzman ekibimiz en kısa sürede tarafınızla iletişime geçecektir.

Mesajınızın özeti
- Ad Soyad: ${name}
- E-posta: ${email}
- Telefon: ${phone || "Belirtilmedi"}
- Mesaj: ${message}

Efe İnşaat
${DISPLAY_EMAIL}
${SITE_DISPLAY}
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
      customerConfirmation: {
        to: email,
        subject: "Mesajınız Alındı | Efe İnşaat",
        html: buildCustomerConfirmationHtml(name, email, phone, message),
        text: buildCustomerConfirmationText(name, email, phone, message),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json(
      { error: toClientMailError(error) },
      { status: 500 }
    );
  }
}
