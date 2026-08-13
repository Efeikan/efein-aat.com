import nodemailer from "nodemailer";
import { domainToASCII } from "node:url";

export const DISPLAY_EMAIL = "info@efeinşaat.com";

const PUNYCODE_RW = "info@xn--efeinaat-rwb.com";
const PUNYCODE_XKB = "info@xn--efeinaat-xkb.com";
const ASCII_EMAIL = "info@efeinsaat.com";

export const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL?.trim() || PUNYCODE_RW;

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

const SMTP_TIMEOUT_MS = 15_000;

class MailUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MailUserError";
  }
}

function logMail(level: "info" | "warn" | "error", message: string, extra?: unknown) {
  const prefix = `[mail][${new Date().toISOString()}]`;
  if (level === "info") console.info(prefix, message, extra ?? "");
  else if (level === "warn") console.warn(prefix, message, extra ?? "");
  else console.error(prefix, message, extra ?? "");
}

function dumpError(error: unknown) {
  if (error instanceof Error) {
    const extra = error as Error & {
      code?: string;
      response?: string;
      responseCode?: number;
      command?: string;
    };
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: extra.code,
      response: extra.response,
      responseCode: extra.responseCode,
      command: extra.command,
    };
  }
  return { message: String(error) };
}

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
    const v = item?.trim();
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
  return /proxy request failed|cannot connect|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|socket|network|fetch failed|ConnectTimeout|certificate|SSL|TLS|ECONNRESET/i.test(
    errorMessage(error)
  );
}

function isCloudflareWorker() {
  return (
    typeof (globalThis as { WebSocketPair?: unknown }).WebSocketPair !==
      "undefined" || process.env.MAIL_TRANSPORT === "http"
  );
}

export function getMailEnvStatus() {
  const host = process.env.SMTP_HOST?.trim() || "smtp.hostinger.com";
  const port = process.env.SMTP_PORT?.trim() || "465";
  const user = process.env.SMTP_USER?.trim() || PUNYCODE_RW;
  const pass = process.env.SMTP_PASS?.trim() || "";
  const contact = process.env.CONTACT_EMAIL?.trim() || PUNYCODE_RW;
  const transport =
    process.env.MAIL_TRANSPORT?.trim() ||
    (isCloudflareWorker() ? "http" : "smtp");
  const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());

  return {
    host,
    port,
    user,
    contact,
    transport,
    hasPass: Boolean(pass),
    passLength: pass.length,
    hasResend,
    present: {
      SMTP_HOST: Boolean(process.env.SMTP_HOST?.trim()),
      SMTP_PORT: Boolean(process.env.SMTP_PORT?.trim()),
      SMTP_USER: Boolean(process.env.SMTP_USER?.trim()),
      SMTP_PASS: Boolean(pass),
      CONTACT_EMAIL: Boolean(process.env.CONTACT_EMAIL?.trim()),
      MAIL_TRANSPORT: Boolean(process.env.MAIL_TRANSPORT?.trim()),
      RESEND_API_KEY: hasResend,
    },
  };
}

export function toClientMailError(error: unknown): string {
  logMail("error", "client-facing failure", dumpError(error));
  if (error instanceof MailUserError) return error.message;

  const msg = errorMessage(error);
  if (/Activate Form|needs Activation|aktivasyon/i.test(msg)) {
    return "FormSubmit aktivasyon maili gönderildi. Hostinger gelen kutusu ve Spam klasöründe “Activate Form” linkine tıklayın; sonra formu tekrar gönderin.";
  }
  if (/SMTP_PASS|şifre|password|eksik ortam|RESEND/i.test(msg)) {
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

function resolveSmtpConfig() {
  const env = getMailEnvStatus();
  const pass = process.env.SMTP_PASS?.trim();
  if (!pass) {
    throw new Error(
      "SMTP_PASS eksik. Cloudflare Worker → Settings → Variables and secrets içine ekleyin."
    );
  }

  const rawUser = env.user;
  const userCandidates = uniqueEmails([
    rawUser,
    toPunycodeEmail(rawUser),
    toPunycodeEmail(DISPLAY_EMAIL),
    PUNYCODE_RW,
    PUNYCODE_XKB,
    ASCII_EMAIL,
    DISPLAY_EMAIL,
    asciiFallbackEmail(rawUser),
  ]);

  const toCandidates = uniqueEmails([
    env.contact,
    toPunycodeEmail(env.contact),
    PUNYCODE_RW,
    ASCII_EMAIL,
    DISPLAY_EMAIL,
  ]);

  return {
    host: env.host,
    port: Number(env.port) || 465,
    pass,
    userCandidates,
    toCandidates,
  };
}

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
      rejectUnauthorized: false,
      servername: host,
    },
  });
}

async function sendViaSmtp(options: SendMailOptions) {
  const { host, port, pass, userCandidates, toCandidates } = resolveSmtpConfig();
  const to = options.to?.trim() || toCandidates[0];

  logMail("info", "SMTP attempt start", { host, port, to, userCandidates });

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

  const tryPorts =
    port === 465 ? [465, 587] : port === 587 ? [587, 465] : [port, 465, 587];

  let lastError: unknown;

  for (const p of tryPorts) {
    for (const user of userCandidates) {
      try {
        const transporter = createTransport(host, p, user, pass);
        await transporter.sendMail(mailOptions(user));
        logMail("info", "SMTP success", { host, port: p, user, to });
        return;
      } catch (error) {
        lastError = error;
        logMail("warn", "SMTP attempt failed", {
          host,
          port: p,
          user,
          to,
          error: dumpError(error),
        });
        if (isConnectError(error)) break;
        if (!isAuthError(error)) throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("SMTP bağlantısı kurulamadı.");
}

/** Cloudflare Workers uyumlu — Resend HTTP API */
async function sendViaResend(options: SendMailOptions) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY tanımlı değil");
  }

  const to =
    options.to?.trim() ||
    process.env.CONTACT_EMAIL?.trim() ||
    ASCII_EMAIL;

  const from =
    process.env.MAIL_FROM?.trim() ||
    "Efe İnşaat <onboarding@resend.dev>";

  const payload: Record<string, unknown> = {
    from,
    to: [to],
    subject: options.subject,
    html: options.html,
    text: options.text,
  };
  if (options.replyTo) payload.reply_to = options.replyTo;

  if (options.attachments?.length) {
    payload.attachments = options.attachments.map((file) => ({
      filename: file.filename,
      content: (Buffer.isBuffer(file.content)
        ? file.content
        : Buffer.from(file.content)
      ).toString("base64"),
    }));
  }

  logMail("info", "Resend request", { to, from, subject: options.subject });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(SMTP_TIMEOUT_MS),
  });

  const raw = await response.text();
  logMail("info", "Resend response", {
    status: response.status,
    body: raw.slice(0, 500),
  });

  if (!response.ok) {
    throw new Error(`Resend HTTP ${response.status}: ${raw.slice(0, 300)}`);
  }

  // Müşteri onay maili
  if (options.customerConfirmation && !options.to) {
    const c = options.customerConfirmation;
    const confirmPayload = {
      from,
      to: [c.to],
      subject: c.subject,
      html: c.html,
      text: c.text,
      reply_to: DISPLAY_EMAIL,
    };
    const confirmRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(confirmPayload),
      signal: AbortSignal.timeout(SMTP_TIMEOUT_MS),
    });
    const confirmRaw = await confirmRes.text();
    logMail("info", "Resend customer confirmation", {
      status: confirmRes.status,
      body: confirmRaw.slice(0, 400),
    });
    if (!confirmRes.ok) {
      throw new Error(
        `Resend onay maili HTTP ${confirmRes.status}: ${confirmRaw.slice(0, 300)}`
      );
    }
  }
}

async function postFormSubmit(to: string, payload: Record<string, string>) {
  const url = `https://formsubmit.co/ajax/${encodeURIComponent(to)}`;
  logMail("info", "FormSubmit request", { to, url });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: "https://efeinsaat.com",
      Referer: "https://efeinsaat.com/",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(SMTP_TIMEOUT_MS),
  });

  const raw = await response.text();
  type FormSubmitJson = {
    success?: string | boolean;
    message?: string;
    error?: string;
  };
  let parsed: FormSubmitJson | null = null;
  try {
    parsed = JSON.parse(raw) as FormSubmitJson;
  } catch {
    parsed = null;
  }

  logMail("info", "FormSubmit response", {
    to,
    status: response.status,
    body: raw.slice(0, 500),
  });

  const msg = parsed?.message || parsed?.error || raw;
  if (/Activate Form|needs Activation/i.test(msg)) {
    throw new MailUserError(
      `FormSubmit aktivasyon gerekli (${to}). Hostinger → Gelen / Spam içinde “Activate Form” mailini açıp linke tıklayın. Sonra formu tekrar gönderin.`
    );
  }

  const ok =
    response.ok &&
    !!parsed &&
    (parsed.success === true ||
      parsed.success === "true" ||
      parsed.success === "ok");

  if (!ok) {
    throw new Error(
      parsed?.message ||
        parsed?.error ||
        `FormSubmit başarısız (HTTP ${response.status}): ${raw.slice(0, 200)}`
    );
  }
}

async function sendViaFormSubmit(options: SendMailOptions) {
  // FormSubmit ş karakterini reddediyor → ASCII / Punycode kullan
  const recipients = uniqueEmails([
    options.to?.trim() || "",
    ASCII_EMAIL,
    PUNYCODE_RW,
    CONTACT_EMAIL,
  ]);

  const payload: Record<string, string> = {
    _subject: options.subject,
    _template: "table",
    _captcha: "false",
  };

  if (options.replyTo) {
    payload._replyto = options.replyTo;
    payload.email = options.replyTo;
  }
  if (options.fields) {
    for (const [key, value] of Object.entries(options.fields)) {
      if (value) payload[key] = value;
    }
  }
  if (options.text) payload.message = options.text;
  if (options.html) payload.html_content = options.html;
  if (options.customerConfirmation?.text) {
    payload._autoresponse = options.customerConfirmation.text;
  }

  let lastError: unknown;
  let activationError: MailUserError | null = null;

  for (const to of recipients) {
    try {
      await postFormSubmit(to, payload);
      logMail("info", "FormSubmit success", { to });
      return;
    } catch (error) {
      lastError = error;
      if (error instanceof MailUserError) {
        activationError = error;
        logMail("warn", "FormSubmit needs activation", { to, message: error.message });
        // Diğer adayları da dene; hepsi aktivasyonsa kullanıcıya bildir
        continue;
      }
      logMail("warn", "FormSubmit recipient failed", {
        to,
        error: dumpError(error),
      });
    }
  }

  if (activationError) throw activationError;
  throw lastError instanceof Error
    ? lastError
    : new Error("FormSubmit tüm alıcı adaylarında başarısız.");
}

export async function sendMail(options: SendMailOptions) {
  const env = getMailEnvStatus();
  logMail("info", "sendMail start", {
    subject: options.subject,
    env: {
      transport: env.transport,
      hasPass: env.hasPass,
      hasResend: env.hasResend,
      isWorker: isCloudflareWorker(),
      present: env.present,
    },
  });

  const preferHttp =
    isCloudflareWorker() || process.env.MAIL_TRANSPORT === "http";

  const errors: unknown[] = [];

  // 1) Resend (Workers için en güvenilir)
  if (env.hasResend) {
    try {
      await sendViaResend(options);
      return;
    } catch (error) {
      errors.push(error);
      logMail("warn", "Resend failed", dumpError(error));
    }
  }

  // 2) Lokal SMTP
  if (!preferHttp) {
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
      errors.push(error);
      logMail("warn", "SMTP failed", dumpError(error));
    }
  } else {
    logMail("info", "Skipping SMTP on Workers/http transport");
  }

  // 3) FormSubmit (aktivasyon gerekir)
  try {
    await sendViaFormSubmit({
      ...options,
      to: options.to && options.customerConfirmation ? undefined : options.to,
      customerConfirmation: options.customerConfirmation,
    });
  } catch (error) {
    errors.push(error);
    logMail("error", "All mail transports failed", {
      errors: errors.map(dumpError),
    });
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
