import { NextRequest, NextResponse } from "next/server";
import {
  CONTACT_EMAIL,
  DISPLAY_EMAIL,
  escapeHtml,
  sendMail,
  toClientMailError,
} from "@/lib/mail";

export const runtime = "nodejs";

const SITE_URL = "https://xn--efeinaat-rwb.com";
const SITE_DISPLAY = "efeinşaat.com";

function buildQuoteEmailHtml(fields: Record<string, string>, fileName?: string) {
  const rows = [
    ["Proje Türü", fields.projectType],
    ["Lokasyon", fields.location],
    ["Arsa/Yapı m²", fields.area],
    ["Tapu Durumu", fields.deedStatus],
    ["Ad Soyad", fields.name],
    ["Telefon", fields.phone],
    ["E-posta", fields.email],
    ["Ek Notlar", fields.notes || "Belirtilmedi"],
    ["Dosya", fileName || "Yüklenmedi"],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e0ebe6;color:#6f9a8c;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;width:34%;">${escapeHtml(label)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e0ebe6;color:#1e2a26;font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Yeni Teklif Talebi</title>
</head>
<body style="margin:0;padding:24px;background:#e9efec;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" style="max-width:640px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;">
    <tr><td style="background:linear-gradient(135deg,#2f433e,#557f72);padding:24px 28px;color:#fff;">
      <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;opacity:.8;">Efe İnşaat</div>
      <h1 style="margin:8px 0 0;font-size:22px;">Yeni Teklif Talebi</h1>
    </td></tr>
    <tr><td style="padding:8px 12px;">
      <table width="100%" cellpadding="0" cellspacing="0">${tableRows}</table>
    </td></tr>
    <tr><td style="padding:16px 28px 24px;font-size:12px;color:#9bb0a8;">
      Alıcı: ${escapeHtml(CONTACT_EMAIL)} ·
      <a href="${SITE_URL}" style="color:#557f72;text-decoration:none;">${SITE_DISPLAY}</a>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Müşteriye giden otomatik onay / teşekkür e-postası */
function buildCustomerConfirmationHtml(fields: Record<string, string>) {
  const name = escapeHtml(fields.name);
  const summaryRows = [
    ["Telefon", fields.phone],
    ["E-posta", fields.email],
    ["Proje Türü", fields.projectType],
    ["Lokasyon", fields.location],
    ["Alan (m²)", fields.area],
    ["Tapu Durumu", fields.deedStatus],
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

  const notesBlock = fields.notes
    ? `<tr>
        <td colspan="2" style="padding:14px;background:#f2f7f5;border-radius:10px;">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#6f9a8c;margin-bottom:6px;">Proje Notu</div>
          <div style="font-size:14px;color:#2f433e;line-height:1.55;">${escapeHtml(fields.notes)}</div>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Teklif Talebiniz Alındı | Efe İnşaat</title>
</head>
<body style="margin:0;padding:0;background:#e9efec;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9efec;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d7e3de;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2f433e 0%,#43665c 55%,#557f72 100%);padding:32px 28px 28px 28px;">
              <div style="font-size:13px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.78);">Efe İnşaat</div>
              <h1 style="margin:12px 0 0 0;font-size:24px;line-height:1.3;font-weight:700;color:#ffffff;">Teklif Talebiniz Bize Ulaştı</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 28px 8px 28px;">
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.55;color:#1e2a26;">
                Sayın <strong>${name}</strong>,
              </p>
              <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#3d524b;">
                Efe İnşaat teklif formunu doldurduğunuz için teşekkür ederiz. Talebiniz ve proje detaylarınız ekibimize başarıyla ulaşmıştır.
              </p>
              <p style="margin:0 0 22px 0;font-size:15px;line-height:1.65;color:#3d524b;">
                Uzman ekibimiz detayları inceleyerek en kısa sürede tarafınızla iletişime geçecektir.
              </p>
            </td>
          </tr>

          <!-- Summary -->
          <tr>
            <td style="padding:0 28px 8px 28px;">
              <div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6f9a8c;margin:0 0 10px 2px;">
                Talebinizin Özeti
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0ebe6;border-radius:12px;overflow:hidden;background:#fbfdfc;">
                ${summaryRows}
                ${notesBlock}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:24px 28px 8px 28px;" align="center">
              <a href="${SITE_URL}" style="display:inline-block;padding:12px 22px;background:#557f72;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:10px;">
                Web Sitemizi Ziyaret Edin
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px;border-top:1px solid #e8efec;margin-top:8px;">
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
                    Bu e-posta, teklif formunuzu gönderdiğiniz için otomatik olarak iletilmiştir.
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

function buildCustomerConfirmationText(fields: Record<string, string>) {
  return `Sayın ${fields.name},

Efe İnşaat teklif formunu doldurduğunuz için teşekkür ederiz. Talebiniz ve proje detaylarınız ekibimize başarıyla ulaşmıştır.

Uzman ekibimiz detayları inceleyerek en kısa sürede tarafınızla iletişime geçecektir.

Talebinizin özeti
- Telefon: ${fields.phone}
- E-posta: ${fields.email}
- Proje Türü: ${fields.projectType}
- Lokasyon: ${fields.location}
- Alan (m²): ${fields.area}
- Tapu Durumu: ${fields.deedStatus}
${fields.notes ? `- Not: ${fields.notes}` : ""}

Efe İnşaat
${DISPLAY_EMAIL}
${SITE_DISPLAY}
`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const get = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : "";
    };

    const honeypot = get("website");
    if (honeypot) return NextResponse.json({ success: true });

    const fields = {
      projectType: get("projectType"),
      location: get("location"),
      area: get("area"),
      deedStatus: get("deedStatus"),
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      notes: get("notes"),
      kvkk: get("kvkk"),
    };

    if (
      !fields.projectType ||
      !fields.location ||
      !fields.area ||
      !fields.deedStatus ||
      !fields.name ||
      !fields.phone ||
      !fields.email
    ) {
      return NextResponse.json(
        { error: "Lütfen tüm zorunlu alanları doldurun." },
        { status: 400 }
      );
    }

    if (fields.kvkk !== "true") {
      return NextResponse.json(
        { error: "KVKK onayını kabul etmeniz gerekmektedir." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }

    const phoneDigits = fields.phone.replace(/\D/g, "").replace(/^90/, "");
    if (phoneDigits.length !== 10) {
      return NextResponse.json(
        { error: "Geçerli bir telefon numarası girin." },
        { status: 400 }
      );
    }

    const uploaded = formData.get("file");
    let attachment: { filename: string; content: Buffer } | undefined;
    if (uploaded instanceof File && uploaded.size > 0) {
      if (uploaded.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Dosya boyutu 5 MB’ı aşamaz." },
          { status: 400 }
        );
      }
      attachment = {
        filename: uploaded.name,
        content: Buffer.from(await uploaded.arrayBuffer()),
      };
    }

    // Yönetici bildirimi + müşteri onay (Resend)
    await sendMail({
      subject: `Yeni Teklif Talebi - ${fields.name}`,
      replyTo: fields.email,
      html: buildQuoteEmailHtml(fields, attachment?.filename),
      text: Object.entries(fields)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
      fields: {
        projectType: fields.projectType,
        location: fields.location,
        area: fields.area,
        deedStatus: fields.deedStatus,
        name: fields.name,
        phone: fields.phone,
        email: fields.email,
        notes: fields.notes || "Belirtilmedi",
        file: attachment?.filename || "Yüklenmedi",
      },
      attachments: attachment ? [attachment] : undefined,
      customerConfirmation: {
        to: fields.email,
        subject: "Teklif Talebiniz Alındı | Efe İnşaat",
        html: buildCustomerConfirmationHtml(fields),
        text: buildCustomerConfirmationText(fields),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Teklif formu hatası:", error);
    return NextResponse.json(
      { error: toClientMailError(error) },
      { status: 500 }
    );
  }
}
