"use client";
import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { AuthShell, AuthSplit, AuthSwap, OAuthRow, PasswordField, SubmitButton } from "@/components/AuthCard";

/**
 * Reads ?reset=1, which the forgot-password flow sets once the new password is
 * saved. Isolated behind Suspense because useSearchParams opts the page out of
 * static prerendering.
 */
function ResetFlash() {
  const search = useSearchParams();
  if (search.get("reset") !== "1") return null;
  return (
    <div className="form-notice" role="status">
      Password updated. Sign in with your new password.
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mfaTicket, setMfaTicket] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.auth.signIn({ email: email.trim(), password });
      if (res.requiresMfa && res.mfaTicket) {
        setMfaTicket(res.mfaTicket);
      } else {
        router.push("/discover");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMfa(e: FormEvent) {
    e.preventDefault();
    if (!mfaTicket) return;
    setLoading(true);
    setError("");
    try {
      await api.auth.mfaVerify({ ticket: mfaTicket, code: mfaCode.replace(/\s/g, "") });
      router.push("/discover");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That code did not work. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (mfaTicket) {
    return (
      <AuthSplit
        eyebrow="Two-factor"
        headline="One more step before you're in."
        blurb="Six digits from your authenticator, and you're back to the work."
      >
        <AuthShell title="Check your authenticator" subtitle="Enter the six-digit code to finish signing in.">
          <form className="auth-form" onSubmit={handleMfa}>
            <div className="field">
              <label htmlFor="mfa">Six-digit code</label>
              <input
                id="mfa"
                className="input"
                inputMode="numeric"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                required
                placeholder="123456"
              />
            </div>
            {error && <div className="form-error">{error}</div>}
            <SubmitButton loading={loading} idle="Verify" pending="Verifying..." />
          </form>
        </AuthShell>
      </AuthSplit>
    );
  }

  return (
    <AuthSplit
      eyebrow="Welcome back"
      headline="Pick up where your purpose left off."
      blurb="Your Spaces, tasks, and the people in them are right where you left them."
    >
      <AuthShell
        title="Welcome back"
        subtitle="Sign in to continue."
        footer={<AuthSwap prompt="New to Avera?" link="/signup" label="Create an account" />}
      >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Work Email</label>
          <div className="input-adorn">
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
              autoComplete="email"
              autoFocus
            />
            <span className="adorn-static" aria-hidden="true"><Mail size={17} /></span>
          </div>
        </div>
        <PasswordField id="password" label="Password" value={password} onChange={setPassword} autoComplete="current-password" />
        {/* Forgot password sits with the password field, not below the social note —
            it is the same concern, and a centred orphan between two left-aligned
            lines read as a mistake. */}
        <div className="auth-field-foot">
          <Link href="/forgot-password" className="auth-field-link">
            Forgot password?
          </Link>
        </div>
        <Suspense fallback={null}>
          <ResetFlash />
        </Suspense>
        {error && <div className="form-error">{error}</div>}
        <SubmitButton loading={loading} idle="Sign in" pending="Signing in..." />
        <OAuthRow />
      </form>
    </AuthShell>
    </AuthSplit>
  );
}
