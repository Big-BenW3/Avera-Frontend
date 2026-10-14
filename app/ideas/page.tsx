"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Search, Plus, Sparkles, MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toIdea, type Idea } from "@/lib/models";
import { AnimateIn } from "@/components/Animations";
import { ProductNav } from "@/components/ProductNav";
import { SkeletonIdeaCard } from "@/components/Skeleton";
import { Modal, EmptyState, FieldError } from "@/components/Modal";
import { toast } from "@/components/Toast";

const CATEGORIES = ["All", "Health", "Climate", "Education", "Fintech", "Developer tools", "Social", "Other"];

export default function IdeasPage() {
  return (
    <Suspense fallback={<IdeasFallback />}>
      <IdeasInner />
    </Suspense>
  );
}

function IdeasFallback() {
  return (
    <>
      <ProductNav />
      <div className="dashboard">
        <p style={{ padding: 24 }}>Loading the board…</p>
      </div>
    </>
  );
}

function IdeasInner() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [composing, setComposing] = useState(false);

  async function load(cat: string) {
    setLoading(true);
    try {
      const res = await api.discover.ideas(cat === "All" ? undefined : cat);
      setIdeas(res.items.map((i) => toIdea(i)));
    } catch {
      toast("Could not load ideas — is the API running?", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);


  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return ideas;
    return ideas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(term) ||
        idea.summary.toLowerCase().includes(term) ||
        idea.category.toLowerCase().includes(term),
    );
  }, [ideas, query]);

  async function handleCreate(input: { title: string; body: string; category: string; lookingFor?: string }) {
    try {
      await api.ideas.create(input);
      toast("Idea shared. Nice.");
      setComposing(false);
      load(category);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not post that idea.", "error");
    }
  }

  return (
    <>
      <ProductNav />

      <div className="dashboard">
        <AnimateIn>
          <div className="dashboard-header dashboard-header-row">
            <div>
              <div className="eyebrow">Ideas</div>
              <h1 className="dashboard-title">Every idea deserves a team.</h1>
              <p className="dashboard-subtitle">
                Sketch it, share it, and let the right people find you.
              </p>
            </div>
            <button className="btn" onClick={() => setComposing(true)}>
              <Plus size={16} /> Share an idea
            </button>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <div className="filter-row-wide">
            <label className="filter-search">
              <Search size={15} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ideas…"
                aria-label="Search ideas"
              />
            </label>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.08}>
          <div className="filter-row" style={{ marginBottom: 20 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`chip${category === cat ? " active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimateIn>

        <div className="ideas-grid">
          {loading ? (
            <>
              <SkeletonIdeaCard />
              <SkeletonIdeaCard />
              <SkeletonIdeaCard />
              <SkeletonIdeaCard />
            </>
          ) : filtered.length === 0 ? (
            <EmptyState
              title={query ? `No ideas match “${query}”` : "No ideas here yet"}
              hint="Try another search, or be the first to share one."
            />
          ) : (
            filtered.map((idea, i) => (
              <AnimateIn key={idea.id} delay={0.05 * Math.min(i, 8)}>
                <article className="idea-card">
                  <div className="idea-card-spaced status-chips">
                    <span className="idea-card-tag">{idea.category}</span>
                    <span className={idea.stage === "building" ? "status-chip status-chip-green" : "status-chip status-chip-orange"}>
                      {idea.stage}
                    </span>
                  </div>
                  <h3 className="idea-card-title">{idea.title}</h3>
                  <p className="idea-card-desc">{idea.summary}</p>
                  <div className="idea-card-meta">
                    <span>
                      <Sparkles size={13} /> {idea.interestCount} interested
                    </span>
                    <span>
                      <MessageCircle size={13} /> {idea.commentCount}
                    </span>
                  </div>
                </article>
              </AnimateIn>
            ))
          )}
        </div>
      </div>

      {composing && (
        <ComposeIdea
          onClose={() => setComposing(false)}
          onSubmit={handleCreate}
        />
      )}
    </>
  );
}

function ComposeIdea({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (input: { title: string; body: string; category: string; lookingFor?: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(CATEGORIES[1] ?? "Other");
  const [lookingFor, setLookingFor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 4) return setError("Give your idea a short, clear title.");
    if (body.trim().length < 12) return setError("Add a little more detail so people get it.");
    setError(null);
    setBusy(true);
    onSubmit({
      title: title.trim(),
      body: body.trim(),
      category,
      lookingFor: lookingFor.trim() || undefined,
    });
  }

  return (
    <Modal title="Share an idea" onClose={onClose}>
      <form className="compose-panel" onSubmit={submit}>
        <div className="field">
          <label className="compose-label" htmlFor="idea-title">
            Title
          </label>
          <input
            id="idea-title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="One line that makes people lean in"
            maxLength={80}
          />
        </div>

        <div className="field">
          <label className="compose-label" htmlFor="idea-body">
            The idea
          </label>
          <textarea
            id="idea-body"
            className="input compose-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What is it, who is it for, and why now?"
          />
        </div>

        <div className="field">
          <label className="compose-label" htmlFor="idea-category">
            Category
          </label>
          <select
            id="idea-category"
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.filter((c) => c !== "All").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="compose-label" htmlFor="idea-looking">
            Looking for <span style={{ color: "var(--dust-light)", fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            id="idea-looking"
            className="input"
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            placeholder="e.g. a designer who cares about accessibility"
          />
        </div>

        <FieldError message={error} />

        <div className="row-12" style={{ justifyContent: "flex-end", marginTop: 4 }}>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={busy}>
            {busy ? "Sharing…" : "Share idea"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
