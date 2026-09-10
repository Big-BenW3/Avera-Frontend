"use client";
import { useState, type FormEvent } from "react";
import { AtSign, Eye, EyeOff, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { AuthShell, AuthSwap, OAuthRow, PasswordField, SubmitButton } from "@/components/AuthCard";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.auth.signUp({ email: email.trim(), password, displayName: name.trim(), handle });
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start collaborating with your team on Avera today."
      footer={
        <>
          <AuthSwap prompt="Already have an account?" link="/login" label="Sign in" />
          <p className="auth-terms">
            By signing up, you agree to Avera&apos;s <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Full Name</label>
          <div className="input-adorn">
            <input
              id="name"
              type="text"
              className="input input-pill"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Alex Morgan"
              autoComplete="name"
              autoFocus
            />
            <span className="adorn-static" aria-hidden="true"><User size={17} /></span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="handle">Handle</label>
          <div className="input-adorn">
            <input
              id="handle"
              type="text"
              className="input input-pill"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              required
              pattern="[a-z0-9][a-z0-9-]{2,39}"
              placeholder="alex-builds"
              autoComplete="username"
            />
            <span className="adorn-static" aria-hidden="true"><AtSign size={17} /></span>
          </div>
        </div>
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
        <PasswordField id="password" label="Password" value={password} onChange={setPassword} autoComplete="new-password" />
        <div className="field">
          <label htmlFor="confirm">Confirm Password</label>
          <div className="input-adorn">
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              className="input input-pill"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={12}
              placeholder="Repeat your password"
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
        {error && <div className="form-error">{error}</div>}
        <SubmitButton loading={loading} idle="Create Free Account" pending="Creating account..." />
        <OAuthRow />
      </form>
    </AuthShell>
  );
}
