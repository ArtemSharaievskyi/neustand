import { NextRequest } from "next/server";
import { Resend } from "resend";
import {
  ACCEPTED_FILE_MIME_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_MESSAGE_LENGTH,
  MAX_TOTAL_FILE_SIZE,
} from "../../lib/contact-constraints";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_REQUEST_BYTES = 12 * 1024 * 1024;

type RateLimitEntry = { count: number; resetAt: number };
const rateLimitStore = new Map<string, RateLimitEntry>();

type DetectedFile = { mime: (typeof ACCEPTED_FILE_MIME_TYPES)[number]; extension: string };

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown-client";
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const previous = rateLimitStore.get(key);
  if (!previous || previous.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (previous.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((previous.resetAt - now) / 1000) };
  }

  previous.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function textValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function detectFileType(bytes: Uint8Array): DetectedFile | null {
  if (bytes.length >= 5 && new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-") {
    return { mime: "application/pdf", extension: ".pdf" };
  }
  if (bytes.length >= 8 && bytes.slice(0, 8).every((byte, index) => byte === [137, 80, 78, 71, 13, 10, 26, 10][index])) {
    return { mime: "image/png", extension: ".png" };
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mime: "image/jpeg", extension: ".jpg" };
  }
  if (bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP") {
    return { mime: "image/webp", extension: ".webp" };
  }
  return null;
}

function safeFileName(name: string, extension: string) {
  const base = name
    .replace(/[/\\]/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90)
    .replace(/\.+$/, "") || "anhang";
  return base.toLowerCase().endsWith(extension) ? base : `${base}${extension}`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function makeError(message: string, status: number, headers?: HeadersInit) {
  return Response.json({ ok: false, message }, { status, headers });
}

class RequestTooLargeError extends Error {}

async function readRequestBody(request: NextRequest) {
  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_REQUEST_BYTES) {
        await reader.cancel();
        throw new RequestTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(getClientKey(request));
  if (!rate.allowed) {
    return makeError("Zu viele Anfragen. Bitte später erneut versuchen.", 429, {
      "Retry-After": String(rate.retryAfter),
    });
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader && !/^\d+$/.test(contentLengthHeader)) {
    return makeError("Die Anfrage konnte nicht gelesen werden. Bitte erneut versuchen.", 400);
  }
  if (contentLengthHeader && Number(contentLengthHeader) > MAX_REQUEST_BYTES) {
    return makeError("Die Anfrage ist zu groß. Bitte Dateien verkleinern oder weniger Dateien auswählen.", 413);
  }

  let formData: FormData;
  try {
    const body = await readRequestBody(request);
    formData = await new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body,
    }).formData();
  } catch (error) {
    if (error instanceof RequestTooLargeError) {
      return makeError("Die Anfrage ist zu gr\u00df. Bitte Dateien verkleinern oder weniger Dateien ausw\u00e4hlen.", 413);
    }
    return makeError("Die Anfrage konnte nicht gelesen werden. Bitte erneut versuchen.", 400);
  }

  if (textValue(formData, "company")) {
    return makeError("Die Anfrage konnte nicht verarbeitet werden.", 400);
  }

  const firstName = textValue(formData, "firstName");
  const lastName = textValue(formData, "lastName");
  const email = textValue(formData, "email");
  const message = textValue(formData, "message");
  const requestId = textValue(formData, "requestId");

  if (!firstName || firstName.length > 80) return makeError("Bitte einen gültigen Vornamen angeben.", 400);
  if (!lastName || lastName.length > 80) return makeError("Bitte einen gültigen Nachnamen angeben.", 400);
  if (!isValidEmail(email)) return makeError("Bitte eine gültige E-Mail-Adresse angeben.", 400);
  if (!message || message.length > MAX_MESSAGE_LENGTH) return makeError("Bitte eine Nachricht mit maximal 5.000 Zeichen angeben.", 400);
  if (!/^[a-zA-Z0-9_-]{12,100}$/.test(requestId)) return makeError("Die Anfrage konnte nicht zugeordnet werden. Bitte erneut versuchen.", 400);

  const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length > MAX_FILES) return makeError(`Bitte höchstens ${MAX_FILES} Dateien auswählen.`, 400);

  let totalSize = 0;
  const attachments: Array<{ filename: string; content: string }> = [];
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) return makeError("Eine Datei überschreitet die erlaubten 5 MB.", 400);
    totalSize += file.size;
    if (totalSize > MAX_TOTAL_FILE_SIZE) return makeError("Die Dateien überschreiten zusammen die erlaubten 10 MB.", 400);

    const bytes = new Uint8Array(await file.arrayBuffer());
    const detected = detectFileType(bytes);
    if (!detected || !ACCEPTED_FILE_MIME_TYPES.includes(detected.mime) || (file.type && file.type !== detected.mime)) {
      return makeError(`Die Datei „${file.name || "ohne Namen"}“ hat kein erlaubtes oder erkennbares Format.`, 400);
    }

    attachments.push({
      filename: safeFileName(file.name, detected.extension),
      content: Buffer.from(bytes).toString("base64"),
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const senderAddress = from?.match(/<\s*([^>]+)\s*>/)?.[1]?.trim() ?? from?.trim();
  const to = process.env.RESEND_TO_EMAIL?.trim();
  if (
    !apiKey ||
    !from ||
    !senderAddress ||
    !to ||
    to.toLowerCase() !== "neustand.service@gmail.com" ||
    senderAddress.toLowerCase() === email.toLowerCase()
  ) {
    return makeError("Der Versand ist noch nicht konfiguriert. Bitte kontaktieren Sie NEUSTAND per E-Mail.", 503);
  }

  const subject = `NEUSTAND Anfrage von ${firstName} ${lastName}`.replace(/[\r\n]+/g, " ");
  const plainText = [
    "Neue Anfrage über die NEUSTAND-Website",
    "",
    `Vorname: ${firstName}`,
    `Nachname: ${lastName}`,
    `E-Mail: ${email}`,
    "",
    "Nachricht:",
    message,
  ].join("\n");
  const html = `<h1>Neue Anfrage über die NEUSTAND-Website</h1><p><strong>Vorname:</strong> ${escapeHtml(firstName)}<br><strong>Nachname:</strong> ${escapeHtml(lastName)}<br><strong>E-Mail:</strong> ${escapeHtml(email)}</p><p><strong>Nachricht:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;

  try {
    const resend = new Resend(apiKey);
    // Resend v6 logs full provider error bodies in development, which may contain recipient data.
    // Keep only the sanitized error code logged below.
    Object.defineProperty(resend, "logError", { value: () => undefined });
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      text: plainText,
      html,
      attachments,
    }, {
      idempotencyKey: `neustand-contact-${requestId}`,
    });

    if (error) {
      console.error("[contact] Resend delivery failed", { code: error.name });
      return makeError("Der Versand ist momentan nicht möglich. Bitte später erneut versuchen oder direkt per E-Mail schreiben.", 502);
    }

    if (!data?.id) {
      console.error("[contact] Resend returned no message id", { code: "missing_message_id" });
      return makeError("Der Versand ist momentan nicht möglich. Bitte später erneut versuchen oder direkt per E-Mail schreiben.", 502);
    }
  } catch (error) {
    const code = error instanceof Error ? error.name : "unknown_error";
    console.error("[contact] Resend delivery failed", { code });
    return makeError("Der Versand ist momentan nicht erreichbar. Bitte später erneut versuchen oder direkt per E-Mail schreiben.", 502);
  }

  return Response.json({ ok: true });
}
