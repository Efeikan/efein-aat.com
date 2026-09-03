/**
 * Cloudflare Workers uyumlu mail: yalnızca Resend HTTP API.
 * FormSubmit / SMTP yok.
 */
import { domainToASCII } from "node:url";

export const DISPLAY_EMAIL = "info@efeinşaat.com";

export const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL?.trim() || DISPLAY_EMAIL;

/** Resend API yalnızca ASCII e-posta kabul eder; IDN domain punycode'a çevrilir. */
export function toAsciiEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.lastIndexOf("@");
  if (at <= 0) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const asciiDomain = domainToASCII(domain);
  return asciiDomain ? `${local}@${asciiDomain}` : trimmed;
}

function normalizeAddressForResend(address: string): string {
  const trimmed = address.trim();
  const angle = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  if (angle) {
    return `${angle[1].trim()} <${toAsciiEmail(angle[2].trim())}>`;
  }
  return toAsciiEmail(trimmed);
}

function normalizeResendPayload(payload: Record<string, unknown>) {
  const out = { ...payload };
  if (typeof out.from === "string") {
    out.from = normalizeAddressForResend(out.from);
  }
  if (Array.isArray(out.to)) {
    out.to = out.to.map((entry) =>
      typeof entry === "string" ? normalizeAddressForResend(entry) : entry
    );
  }
  if (typeof out.reply_to === "string") {
    out.reply_to = normalizeAddressForResend(out.reply_to);
  } else if (Array.isArray(out.reply_to)) {
    out.reply_to = out.reply_to.map((entry) =>
      typeof entry === "string" ? normalizeAddressForResend(entry) : entry
    );
  }
  return out;
}

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
  /** Varsayılan: CONTACT_EMAIL (info@efeinsaat.com) */
  to?: string;
  replyTo?: string;
  text?: string;
  fields?: Record<string, string>;
  attachments?: Attachment[];
  customerConfirmation?: CustomerConfirmation;
};

const TIMEOUT_MS = 15_000;

function logMail(level: "info" | "warn" | "error", message: string, extra?: unknown) {
  const prefix = `[mail][${new Date().toISOString()}]`;
  if (level === "info") console.info(prefix, message, extra ?? "");
  else if (level === "warn") console.warn(prefix, message, extra ?? "");
  else console.error(prefix, message, extra ?? "");
}

export function getMailEnvStatus() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  return {
    transport: "resend",
    contact: CONTACT_EMAIL,
    from:
      process.env.MAIL_FROM?.trim() ||
      "Efe İnşaat Form <onboarding@resend.dev>",
    hasResendKey: Boolean(apiKey),
    keyLength: apiKey.length,
    present: {
      RESEND_API_KEY: Boolean(apiKey),
      CONTACT_EMAIL: Boolean(process.env.CONTACT_EMAIL?.trim()),
      MAIL_FROM: Boolean(process.env.MAIL_FROM?.trim()),
    },
  };
}

export function toClientMailError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  logMail("error", "client-facing failure", msg);

  if (/RESEND_API_KEY|tanımlı değil|eksik/i.test(msg)) {
    return "Mail yapılandırması eksik (RESEND_API_KEY). Lütfen daha sonra tekrar deneyin.";
  }
  if (/only send testing emails to your own email/i.test(msg)) {
    return "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin veya e-posta ile ulaşın.";
  }
  if (/domain|from|not verified|validation|non-ascii/i.test(msg)) {
    return "Gönderen adresi doğrulanamadı. Lütfen daha sonra tekrar deneyin.";
  }
  return "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin veya e-posta ile ulaşın.";
}

async function resendSend(payload: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY tanımlı değil. Cloudflare Secrets / .env.local içine ekleyin."
    );
  }

  logMail("info", "Resend request", {
    to: payload.to,
    from: payload.from,
    subject: payload.subject,
  });

  const normalized = normalizeResendPayload(payload);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalized),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const raw = await response.text();
  type ResendJson = {
    id?: string;
    message?: string;
    name?: string;
    statusCode?: number;
  };
  let parsed: ResendJson | null = null;
  try {
    parsed = JSON.parse(raw) as ResendJson;
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    const detail =
      parsed?.message ||
      parsed?.name ||
      raw.slice(0, 400) ||
      `HTTP ${response.status}`;
    logMail("error", "Resend API failed", {
      status: response.status,
      detail,
      body: raw.slice(0, 800),
    });
    throw new Error(`Resend hatası (${response.status}): ${detail}`);
  }

  logMail("info", "Resend success", {
    status: response.status,
    id: parsed?.id,
  });

  return parsed;
}

/**
 * Yönetici bildirimi (+ isteğe bağlı müşteri onay maili) — Resend.
 */
export async function sendMail(options: SendMailOptions) {
  const from =
    process.env.MAIL_FROM?.trim() ||
    "Efe İnşaat Form <onboarding@resend.dev>";

  const to = options.to?.trim() || CONTACT_EMAIL;

  const payload: Record<string, unknown> = {
    from,
    to: [to],
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  if (options.replyTo) {
    payload.reply_to = options.replyTo;
  }

  if (options.attachments?.length) {
    payload.attachments = options.attachments.map((file) => ({
      filename: file.filename,
      content: (Buffer.isBuffer(file.content)
        ? file.content
        : Buffer.from(file.content)
      ).toString("base64"),
    }));
  }

  await resendSend(payload);

  // Formu dolduran kullanıcıya teşekkür / onay maili (info@ üzerinden)
  if (options.customerConfirmation) {
    const c = options.customerConfirmation;
    await resendSend({
      from,
      to: [c.to],
      subject: c.subject,
      html: c.html,
      text: c.text,
      reply_to: DISPLAY_EMAIL,
    });
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
