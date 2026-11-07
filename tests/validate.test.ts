import { describe, expect, it } from "vitest";
import { cleanText, isEmail, isHttpUrl, safeNextPath, sanitizePayload } from "../lib/validate";

describe("safeNextPath", () => {
  it("allows same-site paths", () => {
    expect(safeNextPath("/inbox")).toBe("/inbox");
    expect(safeNextPath("/spaces/atlas?tab=tasks")).toBe("/spaces/atlas?tab=tasks");
  });
  it("rejects external, protocol-relative and backslash targets", () => {
    expect(safeNextPath("https://evil.example")).toBe("/discover");
    expect(safeNextPath("//evil.example")).toBe("/discover");
    expect(safeNextPath("/" + String.fromCharCode(92) + "evil.example")).toBe("/discover");
    expect(safeNextPath("javascript:alert(1)")).toBe("/discover");
  });
  it("never bounces back to an auth page", () => {
    expect(safeNextPath("/login")).toBe("/discover");
    expect(safeNextPath("/signup?x=1")).toBe("/discover");
  });
  it("falls back when missing", () => {
    expect(safeNextPath(null)).toBe("/discover");
    expect(safeNextPath("")).toBe("/discover");
  });
});

describe("isHttpUrl", () => {
  it("accepts http(s) only", () => {
    expect(isHttpUrl("https://github.com/org/repo")).toBe(true);
    expect(isHttpUrl("http://localhost:3000")).toBe(true);
    expect(isHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isHttpUrl("data:text/html,<script>")).toBe(false);
    expect(isHttpUrl("not a url")).toBe(false);
  });
});

describe("isEmail", () => {
  it("checks basic shape", () => {
    expect(isEmail("a@b.co")).toBe(true);
    expect(isEmail("a b@c.com")).toBe(false);
    expect(isEmail("nope")).toBe(false);
  });
});

describe("cleanText / sanitizePayload", () => {
  it("strips control characters, trims and caps length", () => {
    expect(cleanText("  hi\u0000 there\u0007 ")).toBe("hi there");
    expect(cleanText("abcdef", 3)).toBe("abc");
    expect(cleanText("line1\nline2")).toBe("line1\nline2");
  });
  it("leaves credential-like fields byte-for-byte intact", () => {
    const out = sanitizePayload({ email: "  a@b.co ", password: "  keep me  ", nested: { note: " x\u0000 " }, tags: [" a "] });
    expect(out).toEqual({ email: "a@b.co", password: "  keep me  ", nested: { note: "x" }, tags: ["a"] });
  });
});
