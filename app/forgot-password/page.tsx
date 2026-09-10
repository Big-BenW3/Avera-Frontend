"use client";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { AuthShell, AuthSwap, PasswordField, SubmitButton } from "@/components/AuthCard";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [ticket, setTicket] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.forgotPassword(email.trim());
      if (res.resetTicket) setTicket(res.resetTicket);
      setStep("reset");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start the reset.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.auth.resetPassword({ ticket: ticket.trim(), password });
      setStep("done");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That reset link did not work.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={step === "email" ? "Reset your password" : step === "reset" ? "Choose a new password" : "Password updated"}
      subtitle={
        step === "email"
          ? "Enter your email and we will start a secure reset."
          : step === "reset"
            ? "Your new password signs out every other session."
            : "All other sessions were signed out. Taking you back to sign in."
      }
      footer={<AuthSwap prompt="Remembered it?" link="/login" label="Back to sign in" />}
    >
      {step === "email" ? (
        <form className="auth-form" onSubmit={handleEmail}>
          <div className="field">
            <label htmlFor="email">Work Email</label>
            <div className="input-adorn">
              <input
                id="email"
                type="email"
                className="input input-pill"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                autoComplete="email"
              />
              <span className="adorn-static" aria-hidden="true"><Mail size={17} /></span>
            </div>
          </div>
          {error ? <div className="form-error">{error}</div> : null}
          <SubmitButton loading={loading} idle="Send reset link" pending="Sending..." />
        </form>
      ) : step === "reset" ? (
        <form className="auth-form" onSubmit={handleReset}>
          <div className="field">
            <label htmlFor="ticket">Reset ticket</label>
            <input
              id="ticket"
              className="input input-pill"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              required
              placeholder="Paste the ticket from your email"
            />
          </div>
          <PasswordField id="password" label="New Password" value={password} onChange={setPassword} autoComplete="new-password" />
          <div className="field">
            <label htmlFor="confirm">Confirm New Password</label>
            <div className="input-adorn">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                className="input input-pill"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={12}
                placeholder="Repeat your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="adorn-btn"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                aria-pressed={showConfirm}
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {confirm && password !== confirm ? <p className="form-error">Passwords do not match.</p> : null}
          </div>
          {error ? <div className="form-error">{error}</div> : null}
          <SubmitButton loading={loading} idle="Reset password" pending="Resetting..." />
        </form>
      ) : (
        <div className="sent-card">
          <div className="eyebrow">Done</div>
          <h2 className="mono-title mb-16">Password updated. All other sessions were signed out.</h2>
        </div>
      )}
    </AuthShell>
  );
}
