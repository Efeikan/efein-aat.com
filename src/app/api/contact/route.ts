import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const { name, email, phone, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Lütfen tüm zorunlu alanları doldurun." },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Efe İnşaat Web Formu" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `🏗️ Yeni İletişim Formu - ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
          <div style="background: #f59e0b; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🏗️ Efe İnşaat - Yeni Mesaj</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #6b7280; width: 130px;">👤 Ad Soyad</td>
                <td style="padding: 10px; color: #1c1917;">${name}</td>
              </tr>
              <tr style="background: #fafaf9;">
                <td style="padding: 10px; font-weight: bold; color: #6b7280;">📧 E-posta</td>
                <td style="padding: 10px;"><a href="mailto:${email}" style="color: #f59e0b;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #6b7280;">📞 Telefon</td>
                <td style="padding: 10px; color: #1c1917;">${phone || "Belirtilmedi"}</td>
              </tr>
              <tr style="background: #fafaf9;">
                <td style="padding: 10px; font-weight: bold; color: #6b7280; vertical-align: top;">💬 Mesaj</td>
                <td style="padding: 10px; color: #1c1917; white-space: pre-line;">${message}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; color: #78716c;">
                Bu mesaja doğrudan <strong>${email}</strong> adresine yanıt verebilirsiniz.
                Mesaj gönderim tarihi: ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}
              </p>
            </div>
          </div>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Mail gönderme hatası:", error);
        return NextResponse.json(
            { error: "Mail gönderilemedi. Lütfen daha sonra tekrar deneyin." },
            { status: 500 }
        );
    }
}
