"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { AnimateIn } from "@/components/Animations";

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
          <span className="auth-brand">
            <span className="nav-logo-dot" />
            avera
          </span>
        </Link>
        <div>
          <div className="eyebrow mb-12">Step {step} of 3</div>
          <h1 className="auth-title">
            {step === 1 ? "What brings you here?" : step === 2 ? "What do you want to make room for?" : "You belong in the room."}
          </h1>
          <p className="auth-subtitle mt-12" style={{ maxWidth: "34ch" }}>
            {step === 1 ? "Choose the energy you want to bring into Avera." : step === 2 ? "This helps your Discover feed feel more like an invitation than an algorithm." : "Your profile is ready. The next step can be small."}
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
                { label: "I have an idea", value: "idea" },
                { label: "I want to help build", value: "build" },
                { label: "I'm finding people", value: "find" },
                { label: "I'm exploring", value: "explore" },
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
              <label htmlFor="interests">A few interests (comma separated — saved to your profile)</label>
              <textarea
                id="interests"
                className="input input-textarea"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Care, climate, creative tools, local life..."
              />
            </div>
          )}
          {step === 3 && (
            <div className="onboarding-promise">
              <div className="eyebrow-muted-tight">Your Avera promise</div>
              <h2 className="mono-title mt-12 mb-12">Bring the work and the warmth.</h2>
              <p className="muted-body">
                You can change your profile, notification rhythm, and privacy settings any time.
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
