"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

export function AveraLogo({ center = false }: { center?: boolean }) {
  return (
    <div className={`avera-logo${center ? " avera-logo-center" : ""}`}>
      <span className="avera-mark" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 4L20 19H4L12 4Z" fill="#fff" opacity="0.95" />
          <circle cx="12" cy="14.5" r="2.4" fill="#FF6B00" />
        </svg>
      </span>
      <span className="avera-word">
        Avera<span className="avera-dot">.</span>
      </span>
    </div>
  );
}

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="auth-centered">
      <div className="auth-card-rise">
        <AveraLogo center />
        <h1 className="auth-card-title">{title}</h1>
        <p className="auth-card-subtitle">{subtitle}</p>
        {children}
        {footer}
      </div>
      <div className="auth-trust">
        <span><Lock size={13} /> SOC2 Type II Certified</span>
        <span><ShieldCheck size={13} /> End-to-end Encrypted</span>
      </div>
    </div>
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
          className="input input-pill"
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

export function OAuthRow() {
  return (
    <>
      <div className="oauth-divider"><span>OR CONTINUE WITH</span></div>
      <div className="oauth-row" aria-disabled="true" title="OAuth connects in a later release">
        <button type="button" className="btn oauth-btn" disabled>
          <GoogleGlyph /> Google
        </button>
        <button type="button" className="btn oauth-btn" disabled>
          <GithubGlyph /> GitHub
        </button>
        <button type="button" className="btn oauth-btn" disabled>
          <FigmaGlyph /> Figma
        </button>
      </div>
      <p className="muted-xs oauth-note">Social sign-in arrives in a later release.</p>
    </>
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

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

function GithubGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0B1C30" aria-hidden="true">
      <path d="M12 1C5.92 1 1 5.92 1 12c0 4.86 3.15 8.98 7.52 10.44.55.1.75-.24.75-.53v-2.1c-3.06.67-3.71-1.31-3.71-1.31-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.66.08-.66 1.1.08 1.68 1.13 1.68 1.13.97 1.67 2.55 1.19 3.17.91.1-.71.38-1.19.69-1.46-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.91 0 0 .93-.3 3.04 1.13a10.6 10.6 0 0 1 5.54 0c2.11-1.43 3.04-1.13 3.04-1.13.6 1.51.22 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.44.39.34.74 1 .74 2.02v3c0 .29.2.64.76.53A11.01 11.01 0 0 0 23 12c0-6.08-4.92-11-11-11z" />
    </svg>
  );
}

function FigmaGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 38 57" aria-hidden="true">
      <path d="M19 28.5C19 23.25 23.25 19 28.5 19C33.75 19 38 23.25 38 28.5C38 33.75 33.75 38 28.5 38C23.25 38 19 33.75 19 28.5Z" fill="#1ABCFE" />
      <path d="M0 47.5C0 42.25 4.25 38 9.5 38H19V47.5C19 52.75 14.75 57 9.5 57C4.25 57 0 52.75 0 47.5Z" fill="#0ACF83" />
      <path d="M19 0V19H28.5C33.75 19 38 14.75 38 9.5C38 4.25 33.75 0 28.5 0H19Z" fill="#FF7262" />
      <path d="M0 9.5C0 14.75 4.25 19 9.5 19H19V0H9.5C4.25 0 0 4.25 0 9.5Z" fill="#F24E1E" />
      <path d="M0 28.5C0 33.75 4.25 38 9.5 38H19V19H9.5C4.25 19 0 23.25 0 28.5Z" fill="#A259FF" />
    </svg>
  );
}
