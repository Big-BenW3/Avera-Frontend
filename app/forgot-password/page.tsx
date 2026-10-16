"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Mail } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { AuthShell, AuthSplit, AuthSwap, PasswordField, SubmitButton } from "@/components/AuthCard";

/**
 * Two-stage password reset.
 *
 * Stage 1 requests a ticket. The API deliberately answers identically whether or
 * not the account exists so emails cannot be enumerated.
 *
 * Stage 2 consumes the ticket. The API currently returns the ticket in the
 * response body because no transactional email provider is wired yet — so we
 * hand it to the user directly instead of pretending an inbox exists. Once email
 * is connected, delete the ticket notice below and deep-link the emailed URL to
 * /forgot-password?ticket=...
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [ticket, setTicket] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequest(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const res = await api.auth.forgotPassword(email.trim());
      setNotice(
        "If an account exists for that address, a reset link is on its way. " +
          "Check your inbox and follow it to choose a new password.",
      );
      // No mail provider yet, so the API hands the ticket back to us directly.
      if (res.resetTicket) setTicket(res.resetTicket);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That request could not be sent.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.auth.resetPassword({ ticket, password });
      router.push("/login?reset=1");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "That reset link is invalid or has expired. Request a new one.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (stage === "reset") {
    return (
      <AuthSplit
        eyebrow="Almost there"
        headline="Choose something you'll remember."
        blurb="This replaces your old password and signs out every other device."
      >
        <AuthShell
          title="Set a new password"
          subtitle="Your other sessions will be signed out."
          footer={<AuthSwap prompt="Changed your mind?" link="/login" label="Back to sign in" />}
        >
          <form className="auth-form" onSubmit={handleReset}>
            <div className="field">
              <label htmlFor="reset-ticket">Reset ticket</label>
              <input
                id="reset-ticket"
                className="input"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            <PasswordField
              id="new-password"
              label="New password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
            {error && <div className="form-error">{error}</div>}
            <SubmitButton loading={loading} idle="Save new password" pending="Saving..." />
          </form>
        </AuthShell>
      </AuthSplit>
    );
  }

  return (
    <AuthSplit
      eyebrow="Password"
      headline="It happens. Let's get you back in."
      blurb="Give us the email on your account and we'll send a way to reset it."
    >
      <AuthShell
        title="Reset your password"
        subtitle="We'll send a reset link to your inbox."
        footer={<AuthSwap prompt="Remembered it?" link="/login" label="Back to sign in" />}
      >
        <form className="auth-form" onSubmit={handleRequest}>
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
          {error && <div className="form-error">{error}</div>}
          {notice && (
            <div className="form-notice" role="status">
              {notice}
            </div>
          )}
          <SubmitButton loading={loading} idle="Send reset link" pending="Sending..." />

          {/* Temporary: no transactional email provider is configured yet, so the
              API returns the ticket in the response. Remove once email is wired. */}
          {ticket ? (
            <button
              type="button"
              className="auth-link-button"
              onClick={() => setStage("reset")}
            >
              <KeyRound size={14} /> Open the reset link
            </button>
          ) : null}
        </form>
      </AuthShell>
    </AuthSplit>
  );
}