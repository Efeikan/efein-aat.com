import nodemailer from "nodemailer";
import { domainToASCII } from "node:url";

export const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL?.trim() || "info@xn--efeinaat-rwb.com";

/** FormSubmit / görünür iletişim adresi */
export const DISPLAY_EMAIL = "info@efeinşaat.com";

type Attachment = {
  filename: string;
  content: Buffer | Uint8Array;
};

type CustomerConfirmation = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type SendMailOptions = {
  subject: string;
  html: string;
  /** Varsayılan: CONTACT_EMAIL */
  to?: string;
  replyTo?: string;
  text?: string;
  fields?: Record<string, string>;
  attachments?: Attachment[];
  /** FormSubmit yolunda _autoresponse; SMTP yolunda ayrı mail */
  customerConfirmation?: CustomerConfirmation;
};

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

/** Cloudflare Workers: SMTP TCP yok → proxy/connect hataları */
function isConnectError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /proxy request failed|cannot connect|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|socket|network|fetch failed|ConnectTimeout/i.test(
    message
  );
}

/** OpenNext / workerd ortamı */
function isCloudflareWorker() {
  return (
    typeof (globalThis as { WebSocketPair?: unknown }).WebSocketPair !==
      "undefined" || process.env.MAIL_TRANSPORT === "http"
  );
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
    connectionTimeout: 15000,
  });
}

async function sendViaSmtp(options: SendMailOptions) {
  const { host, port, pass, userCandidates, toCandidates } = requireSmtpConfig();
  const to = options.to?.trim() || toCandidates[0];

  const mailOptions = (user: string) => ({
    from: `"Efe İnşaat" <${user}>`,
    to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
    text: options.text,
    encoding: "utf-8" as const,
    attachments: options.attachments?.map((file) => ({
      filename: file.filename,
      content: Buffer.isBuffer(file.content)
        ? file.content
        : Buffer.from(file.content),
    })),
  });

  let lastError: unknown;

  const tryPorts = port === 465 ? [465, 587] : [port];

  for (const p of tryPorts) {
    for (const user of userCandidates) {
      const transporter = createTransport(host, p, user, pass);
      try {
        await transporter.sendMail(mailOptions(user));
        return user;
      } catch (error) {
        lastError = error;
        if (isConnectError(error)) throw error;
        if (!isAuthError(error)) throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("SMTP kimlik doğrulama başarısız.");
}

/**
 * Cloudflare Workers uyumlu HTTP yolu.
 * Alıcı Hostinger kutusu (FormSubmit → info@…).
 */
async function sendViaFormSubmit(options: SendMailOptions) {
  // Yönetici adresi: FormSubmit için ASCII daha sorunsuz
  const to =
    options.to?.trim() ||
    "info@efeinsaat.com";

  const body = new FormData();
  body.append("_subject", options.subject);
  body.append("_template", "table");
  body.append("_captcha", "false");
  body.append("_honey", "");

  if (options.replyTo) {
    body.append("_replyto", options.replyTo);
    body.append("email", options.replyTo);
  }

  if (options.fields) {
    for (const [key, value] of Object.entries(options.fields)) {
      if (value) body.append(key, value);
    }
  }

  if (options.text) body.append("message", options.text);
  if (options.html) body.append("html_content", options.html);

  // Müşteriye otomatik yanıt (FormSubmit; alıcı formdaki email alanı)
  if (options.customerConfirmation?.text) {
    body.append("_autoresponse", options.customerConfirmation.text);
  }

  if (options.attachments?.length) {
    for (const file of options.attachments) {
      const bytes = Buffer.isBuffer(file.content)
        ? file.content
        : Buffer.from(file.content);
      body.append(
        "attachment",
        new Blob([Uint8Array.from(bytes)]),
        file.filename
      );
    }
  }

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body,
    }
  );

  const payload = (await response.json().catch(() => null)) as {
    success?: string | boolean;
    message?: string;
    error?: string;
  } | null;

  const ok =
    response.ok &&
    (payload?.success === true ||
      payload?.success === "true" ||
      payload?.success === "ok");

  if (!ok) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        `Mail sunucusu yanıt vermedi (${response.status})`
    );
  }
}

/**
 * Önce SMTP (lokal Node), Cloudflare Workers’ta veya bağlantı hatasında HTTP (FormSubmit).
 */
export async function sendMail(options: SendMailOptions) {
  const forceHttp =
    isCloudflareWorker() || process.env.MAIL_TRANSPORT === "http";

  if (!forceHttp && process.env.SMTP_PASS) {
    try {
      await sendViaSmtp({
        ...options,
        to: options.to,
      });

      // Müşteri onay maili (SMTP)
      if (options.customerConfirmation && !options.to) {
        await sendViaSmtp({
          to: options.customerConfirmation.to,
          subject: options.customerConfirmation.subject,
          html: options.customerConfirmation.html,
          text: options.customerConfirmation.text,
          replyTo: DISPLAY_EMAIL,
        });
      }
      return;
    } catch (error) {
      if (!isConnectError(error) && !isAuthError(error)) throw error;
      // Workers / ağ: HTTP’ye düş
      console.warn("SMTP başarısız, FormSubmit kullanılıyor:", error);
    }
  }

  // Yöneticiye (veya to override) HTTP
  await sendViaFormSubmit({
    ...options,
    // Müşteriye ayrı to ile FormSubmit istenmez (aktivasyon gerekir);
    // customerConfirmation → _autoresponse
    to: options.to && options.customerConfirmation ? undefined : options.to,
    customerConfirmation: options.customerConfirmation,
  });
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
