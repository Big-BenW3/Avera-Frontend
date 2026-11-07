"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { AnimateIn } from "@/components/Animations";
import { AveraLogo } from "@/components/AuthCard";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [interests, setInterests] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleNext() {
    setError(null);
    if (step === 1 && !role) {
      setError("Choose the energy you want to bring — you can change it later.");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      void finish();
    }
  }

  async function finish() {
    setSaving(true);
    setError(null);
    try {
      // Persist onboarding: role becomes bio context, interests become skills.
      const me = await api.auth.me().catch(() => null);
      if (me) {
        const skills = interests.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 20);
        await api.auth.updateProfile({
          displayName: me.user.displayName,
          ...(role ? { bio: `Here to ${role}. ${interests.trim()}`.slice(0, 500) } : {}),
          ...(skills.length ? { skills } : {}),
        });
      }
      router.push("/discover");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not save onboarding. You can continue anyway.");
      router.push("/discover");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-art">
        <Link href="/" aria-label="Avera home">
          <AveraLogo />
        </Link>
        <div>
          <div className="eyebrow mb-12">Step {step} of 3</div>
          <h1 className="auth-title">
            {step === 1 ? "What is your primary engineering role?" : step === 2 ? "What technologies & domains do you build in?" : "Developer workspace ready."}
          </h1>
          <p className="auth-subtitle mt-12" style={{ maxWidth: "34ch" }}>
            {step === 1 ? "Select your focus to tailor sprint views, roadmap filters, and team invitations." : step === 2 ? "Add your core stack to highlight relevant Spaces, architecture specs, and open issues." : "Your profile is configured. You can start building immediately."}
          </p>
        </div>
        <div className="steps-bar">
          {[1, 2, 3].map((s) => (
            <div key={s} className={s <= step ? "active" : ""} />
          ))}
        </div>
      </div>
      <div className="auth-right">
        <AnimateIn delay={0.2}>
          {step === 1 && (
            <div className="onboarding-choices">
              {[
                { label: "Technical Founder / Lead", value: "lead" },
                { label: "Backend / Distributed Systems", value: "backend" },
                { label: "Full Stack / Frontend", value: "fullstack" },
                { label: "AI / ML / Data", value: "ai" },
              ].map((option) => (
                <button
                  key={option.value}
                  className={`chip chip-lg${role === option.value ? " active" : ""}`}
                  onClick={() => setRole(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="field">
              <label htmlFor="interests">Core stack & interests (comma separated — saved to profile)</label>
              <textarea
                id="interests"
                className="input input-textarea"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Rust, TypeScript, PostgreSQL, Redis, Kubernetes, Next.js, AI/LLMs..."
              />
            </div>
          )}
          {step === 3 && (
            <div className="onboarding-promise">
              <div className="eyebrow-muted-tight">WORKSPACE READY</div>
              <h2 className="mono-title mt-12 mb-12">Built for high-velocity execution.</h2>
              <p className="muted-body">
                Manage Git integrations, sprint milestones, and LiveKit rooms from your Space dashboard.
              </p>
            </div>
          )}
          {error ? <p role="alert" className="form-error">{error}</p> : null}
          <button
            className="btn btn-primary btn-large onboarding-next"
            onClick={handleNext}
            disabled={saving}
          >
            {step === 3 ? (saving ? "Saving…" : "Enter Avera") : "Continue"} <ArrowRight size={14} />
          </button>
        </AnimateIn>
      </div>
    </div>
  );
}
