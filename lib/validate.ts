/** Client-side input hygiene. The API stays the source of truth; this keeps junk and unsafe values from leaving the browser. */

// C0 control characters except tab (\t), newline (\n) and carriage return (\r), plus DEL.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Fields whose exact bytes matter: never trim, normalise or truncate them. */
const VERBATIM_KEY = /pass(word)?|ticket|code|token|secret/i;

const MAX_STRING = 20_000;

export function cleanText(value: string, max = MAX_STRING): string {
  return value.normalize("NFC").replace(CONTROL, "").trim().slice(0, max);
}

export function isEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/** Only http(s) links are ever stored or rendered; blocks javascript:, data:, file: and friends. */
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Returns a same-origin path, or the fallback. Guards `?next=` against open redirects. */
export function safeNextPath(raw: string | null | undefined, fallback = "/discover"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return fallback;
  try {
    const url = new URL(raw, "http://avera.invalid");
    if (url.origin !== "http://avera.invalid") return fallback;
    if (/^\/(login|signup|forgot-password)(\/|$)/.test(url.pathname)) return fallback;
  } catch {
    return fallback;
  }
  return raw;
}

/** Deeply cleans every string in an outgoing JSON payload, except credential-like fields. */
export function sanitizePayload(value: unknown, key = ""): unknown {
  if (typeof value === "string") return VERBATIM_KEY.test(key) ? value : cleanText(value);
  if (Array.isArray(value)) return value.map((item) => sanitizePayload(item, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, sanitizePayload(v, k)]),
    );
  }
  return value;
}
