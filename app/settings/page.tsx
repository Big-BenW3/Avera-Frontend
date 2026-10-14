"use client";
import { useEffect, useState } from "react";
import { Bell, Bot, ShieldCheck } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { AnimateIn } from "@/components/Animations";
import { ProductNav } from "@/components/ProductNav";
import { FieldError } from "@/components/Modal";

export default function SettingsPage() {
  const [states, setStates] = useState(() => {
    try {
      const raw = localStorage.getItem("avera-settings");
      if (raw) return { weekly: true, mentions: true, ai: true, memory: false, ...JSON.parse(raw) };
    } catch {}
    return {
      weekly: true,
      mentions: true,
      ai: true,
      memory: false,
    };
  });
  const [notifications, setNotifications] = useState<Array<{ id: string; kind: string; readAt?: string | null }>>([]);
  const [mfaUrl, setMfaUrl] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaMessage, setMfaMessage] = useState<string | null>(null);
  const [blockId, setBlockId] = useState("");
  const [blockMessage, setBlockMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const flip = (key: keyof typeof states) => {
    const next = { ...states, [key]: !states[key] };
    setStates(next);
    try {
      localStorage.setItem("avera-settings", JSON.stringify(next));
    } catch {}
  };

  useEffect(() => {
    api.notifications.list().then(({ items }) => setNotifications(items)).catch(() => {});
  }, []);

  async function markAll() {
    try {
      await api.notifications.markAll();
      setNotifications(notifications.map((n) => ({ ...n, readAt: new Date().toISOString() })));
    } catch {}
  }

  async function enrollMfa() {
    setError(null);
    setMfaMessage(null);
    try {
      const { otpauthUrl } = await api.auth.mfaEnroll();
      setMfaUrl(otpauthUrl);
      setMfaMessage("Scan the otpauth URL in your authenticator, then confirm below.");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not start MFA enrollment.");
    }
  }

  async function confirmMfa() {
    setError(null);
    try {
      await api.auth.mfaConfirm(mfaCode.replace(/\s/g, ""));
      setMfaMessage("Two-factor authentication is enabled.");
      setMfaUrl(null);
      setMfaCode("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "That code did not work.");
    }
  }

  async function block() {
    if (!blockId.trim()) return;
    setBlockMessage(null);
    try {
      await api.users.block(blockId.trim());
      setBlockMessage(`Blocked ${blockId.trim()}.`);
      setBlockId("");
    } catch (e) {
      setBlockMessage(e instanceof ApiError ? e.message : "Could not block this user.");
    }
  }

  return (
    <>
      <ProductNav />

      <div className="settings-layout">
        <AnimateIn>
          <div className="settings-header">
            <div className="eyebrow">Make Avera feel like yours</div>
            <h1 className="mono-display mb-8">Settings with a little care.</h1>
            <p className="muted-md">Control your focus, privacy, and the kind of help you want to invite in.</p>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="settings-section">
            <div className="settings-title">
              <Bell size={16} /> Notification rhythm
            </div>
            <div className="setting-item">
              <div>
                <div className="setting-label">Weekly pulse</div>
                <div className="setting-desc">A single note about the people and Spaces you care about.</div>
              </div>
              <button
                className={`toggle ${states.weekly ? "on" : ""}`}
                onClick={() => flip("weekly")}
                aria-pressed={states.weekly}
                aria-label="Toggle weekly pulse"
              />
            </div>
            <div className="setting-item">
              <div>
                <div className="setting-label">Mentions and invites</div>
                <div className="setting-desc">Stay close when someone is waiting for your voice.</div>
              </div>
              <button
                className={`toggle ${states.mentions ? "on" : ""}`}
                onClick={() => flip("mentions")}
                aria-pressed={states.mentions}
                aria-label="Toggle mentions and invites"
              />
            </div>
            <div className="setting-item">
              <div>
                <div className="setting-label">Inbox ({notifications.filter((n) => !n.readAt).length} unread)</div>
                <div className="setting-desc">Latest server notifications.</div>
              </div>
              <button className="btn btn-sm" onClick={markAll}>Mark all read</button>
            </div>
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="setting-item">
                <div className="setting-desc">{n.kind} {n.readAt ? "· read" : "· unread"}</div>
                {!n.readAt ? <button className="btn btn-sm" onClick={() => api.notifications.markRead(n.id).catch(() => {})}>Mark read</button> : null}
              </div>
            ))}
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="settings-section">
            <div className="settings-title">
              <Bot size={16} /> How Avera helps
            </div>
            <div className="setting-item">
              <div>
                <div className="setting-label">Avera assist</div>
                <div className="setting-desc">Allow AI to suggest a small next step from Space context.</div>
              </div>
              <button
                className={`toggle ${states.ai ? "on" : ""}`}
                onClick={() => flip("ai")}
                aria-pressed={states.ai}
                aria-label="Toggle Avera assist"
              />
            </div>
            <div className="setting-item">
              <div>
                <div className="setting-label">Project Memory</div>
                <div className="setting-desc">Let a Space remember planning notes and decisions; chat and DMs stay out.</div>
              </div>
              <button
                className={`toggle ${states.memory ? "on" : ""}`}
                onClick={() => flip("memory")}
                aria-pressed={states.memory}
                aria-label="Toggle project memory"
              />
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.3}>
          <div className="settings-section">
            <div className="settings-title">
              <ShieldCheck size={16} /> Safety and boundaries
            </div>
            <FieldError message={error} />
            {mfaMessage ? <p style={{ fontSize: 13 }}>{mfaMessage}</p> : null}
            {mfaUrl ? (
              <>
                <p className="setting-desc" style={{ wordBreak: "break-all" }}>{mfaUrl}</p>
                <div className="row-8">
                  <input className="input" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} placeholder="6-digit code" aria-label="MFA code" />
                  <button className="btn btn-primary" onClick={confirmMfa}>Confirm</button>
                </div>
              </>
            ) : (
              <button className="btn btn-block" onClick={enrollMfa}>Enable two-factor (TOTP)</button>
            )}
            <div className="row-8" style={{ marginTop: 12 }}>
              <input className="input" style={{ flex: 1 }} value={blockId} onChange={(e) => setBlockId(e.target.value)} placeholder="User UUID to block…" aria-label="User id to block" />
              <button className="btn" onClick={block}>Block</button>
            </div>
            {blockMessage ? <p style={{ fontSize: 13 }}>{blockMessage}</p> : null}
          </div>
        </AnimateIn>

        <AnimateIn delay={0.4}>
          <div className="panel settings-privacy">
            <div className="eyebrow-muted-tight mb-12">Your data, held with intention</div>
            <h2 className="mono-xl mb-12">Privacy should feel clear.</h2>
            <p className="muted-body">
              Avera keeps account controls straightforward. Your sensitive provider keys never live in the browser, and session cookies are scoped as tightly as possible.
            </p>
          </div>
        </AnimateIn>
      </div>
    </>
  );
}
