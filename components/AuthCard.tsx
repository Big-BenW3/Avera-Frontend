"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export function AveraLogo({ center = false, size = 18 }: { center?: boolean; size?: number }) {
  return (
    <div className={`avera-logo${center ? " avera-logo-center" : ""}`}>
      <span className="avera-mark" aria-hidden="true">
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="av-g" x1="3" y1="29" x2="29" y2="3" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="0.5" stopColor="#06B6D4" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          {/* Outer A — filled with gradient */}
          <path d="M16 3L3 28H9.8L16 16L22.2 28H29L16 3Z" fill="url(#av-g)" />
          {/* Inner cutout — punches hole for depth */}
          <path d="M16 15L13 22H19L16 15Z" fill="var(--canvas)" />
        </svg>
      </span>
      <span className="avera-word">AVERA</span>
    </div>
  );
}

/**
 * Split auth layout: technical product pane on the left, form on the right.
 */
export function AuthSplit({
  children,
  eyebrow,
  headline,
  blurb,
}: {
  children: ReactNode;
  eyebrow?: string;
  headline?: string;
  blurb?: string;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-art">
        <Link href="/" aria-label="Avera home" className="auth-mural-logo">
          <AveraLogo />
        </Link>
        {headline ? (
          <div className="auth-mural-copy">
            {eyebrow ? <div className="auth-mural-eyebrow">{eyebrow}</div> : null}
            <h2 className="auth-mural-title">{headline}</h2>
            {blurb ? <p className="auth-mural-blurb">{blurb}</p> : null}
          </div>
        ) : null}
        <div className="auth-scene" aria-hidden="true" />
        <p className="auth-mural-foot">Built for engineering teams and technical founders.</p>
        <div className="seam-edge" aria-hidden="true" />
      </div>
      <div className="auth-right">{children}</div>
    </div>
  );
}

/** The right-hand form column of an auth screen. */
export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <>
      <Link href="/" aria-label="Avera home">
        <AveraLogo center />
      </Link>
      <h1 className="auth-card-title">{title}</h1>
      <p className="auth-card-subtitle">{subtitle}</p>
      {children}
      {footer}
      <div className="auth-trust">
        <span>Sessions are protected with httpOnly cookies.</span>{" "}
        <Link href="/privacy">Privacy Policy</Link>
      </div>
    </>
  );
}


export function PasswordField({
  id, label, value, onChange, placeholder = "At least 12 characters", autoComplete,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const score = passwordScore(value);
  return (
    <div className="field">
      <div className="field-row">
        <label htmlFor={id}>{label}</label>
        {value ? <span className={`strength-pill strength-${score.label.toLowerCase()}`}><span className="strength-dot" />{score.label}</span> : null}
      </div>
      <div className="input-adorn">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={12}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="adorn-btn"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {value ? (
        <div className="strength-bars" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={i < score.bars ? "on" : ""} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function passwordScore(value: string): { bars: number; label: string } {
  let points = 0;
  if (value.length >= 12) points += 1;
  if (value.length >= 16) points += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) points += 1;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) points += 1;
  if (points <= 1) return { bars: 1, label: "Weak" };
  if (points === 2) return { bars: 2, label: "Okay" };
  if (points === 3) return { bars: 3, label: "Strong" };
  return { bars: 4, label: "Optimal" };
}

/**
 * Social sign-in is not implemented in the backend yet, so this is an honest
 * disabled state rather than three buttons that do nothing when clicked.
 */
export function OAuthRow() {
  return (
    <p className="muted-xs oauth-note">
      Social sign-in is not available yet. Use your email and password.
    </p>
  );
}

export function AuthSwap({ prompt, link, label }: { prompt: string; link: string; label: string }) {
  return (
    <p className="auth-swap">
      {prompt} <Link href={link}>{label}</Link>
    </p>
  );
}

export function SubmitButton({ loading, idle, pending }: { loading: boolean; idle: ReactNode; pending: string }) {
  return (
    <button type="submit" className="btn btn-primary btn-large btn-cta" disabled={loading}>
      {loading ? pending : idle} <ArrowRight size={15} />
    </button>
  );
}

