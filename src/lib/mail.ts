import nodemailer from "nodemailer";
import { domainToASCII } from "node:url";

export const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL?.trim() || "info@xn--efeinaat-rwb.com";

type Attachment = {
  filename: string;
  content: Buffer | Uint8Array;
};

type SendMailOptions = {
  subject: string;
  html: string;
  /** Varsayılan: CONTACT_EMAIL. Müşteri onay maili için müşteri adresi verin. */
  to?: string;
  replyTo?: string;
  text?: string;
  fields?: Record<string, string>;
  attachments?: Attachment[];
};

/** IDN alan adını Punycode ASCII'ye çevirir (efeinşaat.com → xn--efeinaat-rwb.com). */
function toPunycodeEmail(email: string) {
  const at = email.lastIndexOf("@");
  if (at < 0) return email;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const ascii = domainToASCII(domain);
  if (!ascii) return email;
  return `${local}@${ascii}`;
}

function asciiFallbackEmail(email: string) {
  const at = email.lastIndexOf("@");
  if (at < 0) return email;
  return `${email.slice(0, at)}@efeinsaat.com`;
}

function uniqueEmails(list: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const v = item.trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function isAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /535|Invalid login|authentication failed|EAUTH/i.test(message);
}

function requireSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim() || "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT || "465");
  const pass = process.env.SMTP_PASS;
  const rawUser = process.env.SMTP_USER?.trim() || CONTACT_EMAIL;

  if (!pass) {
    throw new Error(
      "SMTP_PASS tanımlı değil. Hostinger mailbox şifresini .env.local içine ekleyin."
    );
  }

  // Kullanıcı adı adayları: ş'li → Punycode → ASCII → bilinen alternatif Punycode
  const userCandidates = uniqueEmails([
    rawUser,
    toPunycodeEmail(rawUser),
    asciiFallbackEmail(rawUser),
    "info@efeinsaat.com",
    "info@xn--efeinaat-rwb.com",
    "info@xn--efeinaat-xkb.com",
  ]);

  const toCandidates = uniqueEmails([
    CONTACT_EMAIL,
    toPunycodeEmail(CONTACT_EMAIL),
    asciiFallbackEmail(CONTACT_EMAIL),
    "info@efeinsaat.com",
  ]);

  return { host, port, pass, userCandidates, toCandidates };
}

function createTransport(host: string, port: number, user: string, pass: string) {
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: 20000,
  });
}

/**
 * Hostinger SMTP ile mail gönderir.
 * Auth 535 olursa alternatif kullanıcı adı biçimlerini sırayla dener.
 */
export async function sendMail({
  subject,
  html,
  to: toOverride,
  replyTo,
  text,
  attachments,
}: SendMailOptions) {
  const { host, port, pass, userCandidates, toCandidates } = requireSmtpConfig();
  const to = toOverride?.trim() || toCandidates[0];

  const mailOptions = (user: string) => ({
    from: `"Efe İnşaat" <${user}>`,
    to,
    replyTo,
    subject,
    html,
    text,
    // Türkçe karakterler için UTF-8
    encoding: "utf-8" as const,
    attachments: attachments?.map((file) => ({
      filename: file.filename,
      content: Buffer.isBuffer(file.content)
        ? file.content
        : Buffer.from(file.content),
    })),
  });

  let lastError: unknown;

  for (const user of userCandidates) {
    const transporter = createTransport(host, port, user, pass);

    try {
      await transporter.sendMail(mailOptions(user));
      return;
    } catch (error) {
      lastError = error;
      if (!isAuthError(error)) throw error;
    }
  }

  if (port === 465) {
    for (const user of userCandidates) {
      const transporter = createTransport(host, 587, user, pass);
      try {
        await transporter.sendMail(mailOptions(user));
        return;
      } catch (error) {
        lastError = error;
        if (!isAuthError(error)) throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("SMTP kimlik doğrulama başarısız.");
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
