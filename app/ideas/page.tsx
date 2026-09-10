"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Bookmark, Heart, MessageCircle, ArrowRight } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { Idea } from "@/lib/models";
import { toIdea } from "@/lib/models";
import { AnimateIn, TiltCard } from "@/components/Animations";
import { ProductNav } from "@/components/ProductNav";
import { SkeletonIdeaCard } from "@/components/Skeleton";

const seedIdeas: Idea[] = [
  { id: "idea-luma", title: "Luma — gentler care after a hard day", summary: "A tiny care circle that helps friends show up with the right kind of support.", category: "Care", author: "Nia I.", interestCount: 42, commentCount: 12, stage: "forming" },
  { id: "idea-field", title: "Field Notes for city-sized curiosity", summary: "A shared way to notice what is changing in the places we call home.", category: "Community", author: "Leo M.", interestCount: 31, commentCount: 8, stage: "spark" },
  { id: "idea-bright", title: "Brightwork — less lonely creative practice", summary: "Small shared rituals for people keeping a creative promise to themselves.", category: "Creativity", author: "Ari S.", interestCount: 57, commentCount: 18, stage: "building" },
  { id: "idea-tide", title: "Tidepool — local climate actions that feel possible", summary: "Turn a neighborhood's good intentions into small, visible actions.", category: "Climate", author: "Min J.", interestCount: 26, commentCount: 7, stage: "forming" },
  { id: "idea-lift", title: "Lift — a better hand-off for new parents", summary: "A thoughtful way to coordinate meals, help, and care during the first months.", category: "Care", author: "Sana K.", interestCount: 64, commentCount: 21, stage: "building" },
  { id: "idea-signal", title: "Signalpath — student skills worth seeing", summary: "Help emerging builders make their real abilities legible beyond a résumé.", category: "Learning", author: "Em O.", interestCount: 23, commentCount: 5, stage: "spark" },
];

const categories = ["All", "Care", "Climate", "Community", "Creativity", "Learning"];

export default function IdeasPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>(seedIdeas);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [showCompose, setShowCompose] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [composeError, setComposeError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverResults, setServerResults] = useState<Array<{ kind: string; id: string; name: string; detail?: string }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.discover
      .ideas()
      .then(({ items, bookmarkedIdeaIds }) => {
        if (cancelled) return;
        if (items.length) setIdeas(items.map(toIdea));
        if (bookmarkedIdeaIds?.length) setSaved(new Set(bookmarkedIdeaIds));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setServerResults(null);
      return;
    }
    const t = setTimeout(() => {
      api.discover.search(term).then(({ items }) => setServerResults(items ?? [])).catch(() => setServerResults([]));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = ideas.filter((idea) => {
    const matchesCategory = category === "All" || idea.category === category;
    const matchesQuery = `${idea.title} ${idea.summary}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  function toggleSaved(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        api.ideas.unbookmark(id).catch(() => {});
      } else {
        next.add(id);
        api.ideas.bookmark(id).catch(() => {});
      }
      return next;
    });
  }

  async function createIdea() {
    if (newTitle.trim().length < 4 || newSummary.trim().length < 20) {
      setComposeError("Title needs 4+ characters and details need 20+ characters.");
      return;
    }
    setComposeError(null);
    const resolvedCategory = category === "All" ? "Community" : category;
    try {
      const { idea } = await api.ideas.create({
        title: newTitle.trim(),
        body: newSummary.trim(),
        category: resolvedCategory,
        ...(lookingFor.trim() ? { lookingFor: lookingFor.trim() } : {}),
      });
      setIdeas([toIdea(idea), ...ideas]);
      setNewTitle("");
      setNewSummary("");
      setLookingFor("");
      setShowCompose(false);
      router.push(`/ideas/${idea.id}`);
    } catch (e) {
      setComposeError(e instanceof ApiError ? e.message : "Could not share this idea.");
    }
  }

  return (
    <>
      <ProductNav />

      <div className="dashboard">
        <AnimateIn>
          <div className="dashboard-header dashboard-header-row">
            <div>
              <div className="eyebrow">Ideas worth staying with</div>
              <h1 className="dashboard-title">Find a spark to carry forward.</h1>
              <p className="dashboard-subtitle">Offer context, curiosity, or your hands. Every contribution changes the shape of a possibility.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCompose(!showCompose)}>
              {showCompose ? "Close" : "Share an idea"} <Plus size={14} />
            </button>
          </div>
        </AnimateIn>

        {showCompose && (
          <AnimateIn delay={0.1}>
            <div className="panel compose-panel">
              <div className="eyebrow-muted-tight compose-label">Make the invitation</div>
              <div className="field mb-16">
                <label htmlFor="idea-title">Give it a clear, human name</label>
                <input
                  id="idea-title"
                  className="input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="A small thing that could make life easier..."
                />
              </div>
              <div className="field mb-16">
                <label htmlFor="idea-summary">What do you notice? (20+ characters)</label>
                <textarea
                  id="idea-summary"
                  className="input input-textarea compose-textarea"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Describe the need, the feeling, or the beginning of a solution."
                />
              </div>
              <div className="field mb-16">
                <label htmlFor="idea-looking">Who are you looking for? (optional)</label>
                <input
                  id="idea-looking"
                  className="input"
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  placeholder="e.g. a designer, a storyteller…"
                />
              </div>
              {composeError ? <p role="alert" style={{ color: "#b42318", fontSize: 13 }}>{composeError}</p> : null}
              <button className="btn btn-primary" onClick={createIdea}>
                Share this spark <ArrowRight size={14} />
              </button>
            </div>
          </AnimateIn>
        )}

        <AnimateIn delay={0.2}>
          <div className="filter-row filter-row-wide">
            <div className="input-search-wrap">
              <Search size={14} />
              <input
                className="input input-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ideas..."
                aria-label="Search ideas"
              />
            </div>
            <div className="row-8" style={{ flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip${category === cat ? " active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </AnimateIn>

        <div className="ideas-grid">
          {loading ? (
            <>
              <SkeletonIdeaCard />
              <SkeletonIdeaCard />
              <SkeletonIdeaCard />
              <SkeletonIdeaCard />
              <SkeletonIdeaCard />
              <SkeletonIdeaCard />
            </>
          ) : serverResults !== null ? (
            serverResults.length === 0 ? (
              <p className="muted-md">No matches on the server — try a shorter term.</p>
            ) : (
              serverResults.filter((r) => r.kind !== "Space").map((r, i) => (
                <AnimateIn key={r.id} delay={0.05 + i * 0.03}>
                  <TiltCard className="idea-card" onClick={() => router.push(`/ideas/${r.id}`)}>
                    <div className="idea-card-tag">{r.detail ?? "Idea"}</div>
                    <div className="idea-card-title">{r.name}</div>
                  </TiltCard>
                </AnimateIn>
              ))
            )
          ) : (
            filtered.map((idea, i) => (
              <AnimateIn key={idea.id} delay={0.1 + i * 0.05}>
                <TiltCard className="idea-card" onClick={() => router.push(`/ideas/${idea.id}`)}>
                  <div className="idea-card-tag">{idea.category}</div>
                  <div className="idea-card-title">{idea.title}</div>
                  <div className="idea-card-desc">{idea.summary}</div>
                  <div className="idea-card-meta">
                    <span><Heart size={11} /> {idea.interestCount}</span>
                    <span><MessageCircle size={11} /> {idea.commentCount}</span>
                    <button
                      className="btn btn-ghost btn-sm spacer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaved(idea.id);
                      }}
                      aria-label={saved.has(idea.id) ? "Unsave idea" : "Save idea"}
                    >
                      <Bookmark size={12} fill={saved.has(idea.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </TiltCard>
              </AnimateIn>
            ))
          )}
        </div>
      </div>
    </>
  );
}
