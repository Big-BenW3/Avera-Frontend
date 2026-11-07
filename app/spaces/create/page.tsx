"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { AnimateIn } from "@/components/Animations";
import { ProductNav } from "@/components/ProductNav";
import { isEmail } from "@/lib/validate";

const TYPES = ["startup", "open_source", "hackathon", "client_project", "experiment", "personal"] as const;
const CATEGORIES = ["Developer Tools", "AI & Machine Learning", "Infrastructure", "Fintech & Web3", "Open Source", "Security", "SaaS"];

export default function CreateSpacePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [category, setCategory] = useState("Developer Tools");
  const [type, setType] = useState<(typeof TYPES)[number]>("startup");
  const [visibility, setVisibility] = useState<"public" | "private">("private");
  const [inviteEmail, setInviteEmail] = useState("");
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function next() {
    if (step === 1 && name.trim().length < 2) {
      setError("Give your Space a name of at least 2 characters.");
      return;
    }
    if (step === 2 && purpose.trim().length < 10) {
      setError("Describe the purpose in at least 10 characters.");
      return;
    }
    setError(null);
    setStep(step + 1);
  }

  async function finish() {
    if (name.trim().length < 2 || purpose.trim().length < 10) {
      setError("Name needs 2+ characters and purpose needs 10+.");
      return;
    }
    if (inviteEmail.trim() && !isEmail(inviteEmail.trim())) {
      setError("That invite address doesn't look right. Fix it or leave it blank.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { space } = await api.spaces.create({
        name: name.trim(),
        summary: purpose.trim(),
        category,
        type,
        visibility,
      });
      setCreatedSlug(space.slug);
      if (inviteEmail.trim()) {
        try {
          await api.spaces.invite(space.slug, { email: inviteEmail.trim() });
        } catch {
          setError("Space created, but the invite email failed — resend it from the Team tab.");
        }
      }
      router.push(`/spaces/${space.slug}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not create this Space.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ProductNav />

      <div className="dashboard">
        <AnimateIn>
          <button className="btn btn-ghost btn-back" onClick={() => router.back()}>
            <ArrowLeft size={14} /> Back
          </button>
        </AnimateIn>

        <div className="workspace-build-grid">
          <div>
            <AnimateIn delay={0.1}>
              <div className="panel">
                <div className="eyebrow-muted-tight mb-16">Create Space · Step {step} of 3</div>
                <h1 className="mono-title mb-12">
                  {step === 1
                    ? "Initialize a new project Space."
                    : step === 2
                    ? "Define project scope and roadmap goals."
                    : "Invite core contributors."}
                </h1>
                <p className="muted-body mb-24">
                  {step === 1
                    ? "A Space unifies architecture specs, sprint tasks, Git repositories, and real-time team collaboration."
                    : step === 2
                    ? "A concise mission statement helps contributors understand technical priorities and deliverable targets."
                    : "Add initial team members now or share an invite link later from the Space dashboard."}
                </p>

                {step === 1 && (
                  <div className="stack stack-16">
                    <div className="field">
                      <label htmlFor="space-name">Project / Space name</label>
                      <input
                        className="input"
                        id="space-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. hyperdrive-engine"
                        maxLength={80}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="space-category">Engineering Domain</label>
                      <select
                        id="space-category"
                        className="select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="space-type">Project Type</label>
                      <select
                        id="space-type"
                        className="select"
                        value={type}
                        onChange={(e) => setType(e.target.value as typeof type)}
                      >
                        {TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ").replace(/^./, (c) => c.toUpperCase())}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="stack stack-16">
                    <div className="field">
                      <label htmlFor="space-purpose">A one-sentence purpose (10+ characters)</label>
                      <textarea
                        id="space-purpose"
                        className="input input-textarea"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="We are here to make..."
                        maxLength={280}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="space-visibility">Who should see this?</label>
                      <select
                        id="space-visibility"
                        className="select"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value as "public" | "private")}
                      >
                        <option value="private">Private — invite people with intention</option>
                        <option value="public">Public — open to thoughtful collaborators</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="stack stack-16">
                    <div className="field">
                      <label htmlFor="space-invite">Invite by email (optional)</label>
                      <input
                        className="input"
                        id="space-invite"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="teammate@example.com"
                      />
                    </div>
                    <div className="onboarding-promise" style={{ border: "1px solid var(--border)", padding: "24px" }}>
                      <div className="eyebrow-muted-tight mb-12">First invitation</div>
                      <h2 className="mono-xl mb-8">Begin by yourself if you need to.</h2>
                      <p className="muted-md">
                        You can send invites later. The Space is ready to hold your first thought.
                      </p>
                    </div>
                  </div>
                )}

                {error ? <p role="alert" className="form-error">{error}</p> : null}
                {createdSlug ? <p style={{ fontSize: 13 }}>Created — opening /spaces/{createdSlug}…</p> : null}

                <div className="row-12 mt-24">
                  {step > 1 && (
                    <button className="btn" onClick={() => { setError(null); setStep(step - 1); }}>
                      <ArrowLeft size={14} /> Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button className="btn btn-primary" onClick={next}>
                      Continue <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={finish} disabled={loading}>
                      {loading ? "Creating..." : "Create Space"} <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                <div className="steps-bar">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={s <= step ? "active" : ""} />
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>

          <div>
            <AnimateIn delay={0.2}>
              <div className="panel">
                <div className="eyebrow-muted-tight mb-16">What is a Space?</div>
                <p className="muted-body mb-16">
                  A Space is a dedicated room for one meaningful project. It holds the purpose, the people, the tasks, the conversation, and the progress — all in one place.
                </p>
                <p className="muted-body">
                  Think of it as a shared home for your idea. No context-switching. No scattered tools. Just the work and the people who care about it.
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </>
  );
}
