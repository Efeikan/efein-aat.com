import nodemailer from "nodemailer";
import { domainToASCII } from "node:url";

export const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL?.trim() || "info@xn--efeinaat-rwb.com";

/** Görünür / reply-to iletişim adresi */
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
  to?: string;
  replyTo?: string;
  text?: string;
  fields?: Record<string, string>;
  attachments?: Attachment[];
  customerConfirmation?: CustomerConfirmation;
};

type SmtpConfig = {
  host: string;
  port: number;
  pass: string;
  userCandidates: string[];
  toCandidates: string[];
};

const SMTP_TIMEOUT_MS = 15_000;

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

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isAuthError(error: unknown) {
  return /535|Invalid login|authentication failed|EAUTH/i.test(
    errorMessage(error)
  );
}

function isConnectError(error: unknown) {
  return /proxy request failed|cannot connect|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|socket|network|fetch failed|ConnectTimeout|certificate|SSL|TLS/i.test(
    errorMessage(error)
  );
}

/** OpenNext / Cloudflare Workers — outbound SMTP TCP desteklenmez */
function isCloudflareWorker() {
  return (
    typeof (globalThis as { WebSocketPair?: unknown }).WebSocketPair !==
      "undefined" || process.env.MAIL_TRANSPORT === "http"
  );
}

/**
 * Canlı / lokal ortam değişkenlerini kontrol eder (değerleri loglamaz).
 */
export function getMailEnvStatus() {
  const keys = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "CONTACT_EMAIL",
    "MAIL_TRANSPORT",
  ] as const;

  const present: Record<string, boolean> = {};
  for (const key of keys) {
    present[key] = Boolean(process.env[key]?.trim());
  }

  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_EMAIL"];
  const missing = required.filter((key) => !present[key]);

  return {
    present,
    missing,
    transport: process.env.MAIL_TRANSPORT?.trim() || (isCloudflareWorker() ? "http" : "smtp"),
    okForSmtp: missing.length === 0,
  };
}

/**
 * İstemciye ham proxy/SMTP detayı sızdırmaz.
 */
export function toClientMailError(error: unknown): string {
  console.error("[mail]", errorMessage(error), error);

  const msg = errorMessage(error);

  if (/SMTP_PASS|tanımlı değil|eksik ortam/i.test(msg)) {
    return "Mail yapılandırması eksik. Lütfen daha sonra tekrar deneyin.";
  }
  if (isConnectError(error) || /proxy/i.test(msg)) {
    return "Mesajınız şu an iletilemedi. Lütfen birkaç dakika sonra tekrar deneyin.";
  }
  if (isAuthError(error)) {
    return "Mail sunucusu kimlik doğrulaması başarısız. Lütfen daha sonra tekrar deneyin.";
  }

  return "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin veya e-posta ile ulaşın.";
}

function requireSmtpConfig(): SmtpConfig {
  const status = getMailEnvStatus();
  if (!status.okForSmtp) {
    throw new Error(
      `Eksik ortam değişkenleri: ${status.missing.join(", ")}. Cloudflare Worker Secrets / .env.local kontrol edin.`
    );
  }

  const host = process.env.SMTP_HOST!.trim() || "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT || "465");
  const pass = process.env.SMTP_PASS!;
  const rawUser = process.env.SMTP_USER!.trim();

  const userCandidates = uniqueEmails([
    rawUser,
    toPunycodeEmail(rawUser),
    asciiFallbackEmail(rawUser),
    "info@efeinşaat.com",
    "info@efeinsaat.com",
    "info@xn--efeinaat-rwb.com",
  ]);

  const toCandidates = uniqueEmails([
    CONTACT_EMAIL,
    toPunycodeEmail(CONTACT_EMAIL),
    asciiFallbackEmail(CONTACT_EMAIL),
    "info@efeinsaat.com",
  ]);

  return { host, port, pass, userCandidates, toCandidates };
}

/**
 * Port 465 → SSL (secure: true)
 * Port 587 → STARTTLS (secure: false, requireTLS: true)
 * Canlıda sertifika/proxy sorunları için rejectUnauthorized: false
 */
function createTransport(
  host: string,
  port: number,
  user: string,
  pass: string
) {
  const useSsl = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure: useSsl,
    requireTLS: !useSsl && port === 587,
    auth: { user, pass },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
    tls: {
      minVersion: "TLSv1.2",
      // Bazı edge / proxy ortamlarda zincir doğrulaması bağlantıyı keser
      rejectUnauthorized: false,
      servername: host,
    },
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

  // Önce yapılandırılan port, sonra yedek (465 ↔ 587)
  const tryPorts =
    port === 465 ? [465, 587] : port === 587 ? [587, 465] : [port, 465, 587];

  let lastError: unknown;

  for (const p of tryPorts) {
    for (const user of userCandidates) {
      const transporter = createTransport(host, p, user, pass);
      try {
        await transporter.sendMail(mailOptions(user));
        console.info(`[mail] SMTP OK host=${host} port=${p} user=${user}`);
        return;
      } catch (error) {
        lastError = error;
        console.warn(
          `[mail] SMTP fail host=${host} port=${p} user=${user}:`,
          errorMessage(error)
        );
        if (isConnectError(error)) {
          // Bu port/ortamda TCP yok → diğer porta veya HTTP’ye
          break;
        }
        if (!isAuthError(error)) throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("SMTP bağlantısı kurulamadı.");
}

async function sendViaFormSubmit(options: SendMailOptions) {
  const to = options.to?.trim() || "info@efeinsaat.com";

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
      signal: AbortSignal.timeout(SMTP_TIMEOUT_MS),
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

  console.info(`[mail] HTTP OK to=${to}`);
}

/**
 * Canlı (Cloudflare Workers): HTTP (FormSubmit) — SMTP TCP çalışmaz.
 * Lokal Node: SMTP (465 SSL → 587 STARTTLS yedek), başarısızsa HTTP.
 */
export async function sendMail(options: SendMailOptions) {
  const env = getMailEnvStatus();
  console.info("[mail] env check", {
    transport: env.transport,
    missing: env.missing,
    present: env.present,
  });

  const preferHttp =
    isCloudflareWorker() || process.env.MAIL_TRANSPORT === "http";

  if (!preferHttp && env.okForSmtp) {
    try {
      await sendViaSmtp({ ...options, to: options.to });

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
      console.warn("[mail] SMTP başarısız, HTTP yedeğine geçiliyor:", error);
      if (!isConnectError(error) && !isAuthError(error)) {
        // Beklenmeyen hatalarda da HTTP dene; yine olmazsa aşağıda fırlatılır
      }
    }
  }

  try {
    await sendViaFormSubmit({
      ...options,
      to: options.to && options.customerConfirmation ? undefined : options.to,
      customerConfirmation: options.customerConfirmation,
    });
  } catch (error) {
    console.error("[mail] HTTP yedek de başarısız:", error);
    throw error;
  }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
