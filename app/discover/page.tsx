"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, Bookmark, Heart, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Idea, Space } from "@/lib/models";
import { toIdea, toSpace } from "@/lib/models";
import { AnimateIn, TiltCard } from "@/components/Animations";
import { ProductNav } from "@/components/ProductNav";
import { SkeletonPanel, SkeletonSpaceCard } from "@/components/Skeleton";

const seedIdeas: Idea[] = [
  { id: "idea-luma", title: "Luma — gentler care after a hard day", summary: "A tiny care circle that helps friends show up with the right kind of support.", category: "Care", author: "Nia I.", interestCount: 42, commentCount: 12, stage: "forming" },
  { id: "idea-field", title: "Field Notes for city-sized curiosity", summary: "A shared way to notice what is changing in the places we call home.", category: "Community", author: "Leo M.", interestCount: 31, commentCount: 8, stage: "spark" },
  { id: "idea-bright", title: "Brightwork — less lonely creative practice", summary: "Small shared rituals for people keeping a creative promise to themselves.", category: "Creativity", author: "Ari S.", interestCount: 57, commentCount: 18, stage: "building" },
  { id: "idea-tide", title: "Tidepool — local climate actions that feel possible", summary: "Turn a neighborhood's good intentions into small, visible actions.", category: "Climate", author: "Min J.", interestCount: 26, commentCount: 7, stage: "forming" },
  { id: "idea-lift", title: "Lift — a better hand-off for new parents", summary: "A thoughtful way to coordinate meals, help, and care during the first months.", category: "Care", author: "Sana K.", interestCount: 64, commentCount: 21, stage: "building" },
  { id: "idea-signal", title: "Signalpath — student skills worth seeing", summary: "Help emerging builders make their real abilities legible beyond a résumé.", category: "Learning", author: "Em O.", interestCount: 23, commentCount: 5, stage: "spark" },
];

const seedSpaces: Space[] = [
  { id: "space-luma", slug: "luma", name: "Luma", purpose: "Make support after a hard day feel easier to offer.", category: "Care", memberCount: 5, progress: 64, status: "building", accent: "violet" },
  { id: "space-tidepool", slug: "tidepool", name: "Tidepool", purpose: "Turn local climate care into small, shared momentum.", category: "Climate", memberCount: 4, progress: 38, status: "open", accent: "coral" },
  { id: "space-field", slug: "field-notes", name: "Field Notes", purpose: "Make the shape of a neighborhood easier to notice.", category: "Community", memberCount: 6, progress: 82, status: "building", accent: "sky" },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>(seedIdeas);
  const [spaces, setSpaces] = useState<Space[]>(seedSpaces);
  const [category, setCategory] = useState("All");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Array<{ id: string; title: string; body?: string }>>([]);
  const [bannerHidden, setBannerHidden] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ kind: string; id: string; name: string; detail?: string }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      api.discover.ideas().then(({ items, bookmarkedIdeaIds }) => ({ items, bookmarkedIdeaIds })),
      api.discover.spaces().then(({ items }) => items),
      api.discover.announcements().catch(() => ({ items: [] })),
    ]).then(([i, s]) => {
      if (cancelled) return;
      if (i.status === "fulfilled" && i.value.items.length) {
        setIdeas(i.value.items.map(toIdea));
        if (i.value.bookmarkedIdeaIds?.length) setSaved(new Set(i.value.bookmarkedIdeaIds));
      }
      if (s.status === "fulfilled" && s.value.length) {
        setSpaces(s.value.map((sp) => toSpace(sp, (sp as { memberCount?: number }).memberCount ?? 0)));
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    api.discover.announcements().then(({ items }) => setAnnouncements(items ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults(null);
      return;
    }
    const t = setTimeout(() => {
      api.discover.search(term).then(({ items }) => setResults(items ?? [])).catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const filteredSpaces = category === "All" ? spaces : spaces.filter((s) => s.category === category);
  const filteredIdeas = category === "All" ? ideas : ideas.filter((i) => i.category === category);

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

  return (
    <>
      <ProductNav />

      <div className="dashboard">
        <AnimateIn>
          <div className="dashboard-header">
            <div className="eyebrow">Good to see you, Maya</div>
            <h1 className="dashboard-title">What feels worth showing up for?</h1>
            <p className="dashboard-subtitle">Follow the energy. The next helpful contribution is rarely far away.</p>
            <div className="input-search-wrap" style={{ maxWidth: 420, marginTop: 12 }}>
              <Search size={14} />
              <input
                className="input input-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ideas and spaces..."
                aria-label="Search ideas and spaces"
              />
            </div>
          </div>
        </AnimateIn>

        {!bannerHidden && announcements.length > 0 ? (
          <AnimateIn delay={0.05}>
            <div className="panel panel-spaced-sm" role="status" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div className="eyebrow-muted-tight mb-12">Announcement</div>
                <div className="mono-lg">{announcements[0].title}</div>
                {announcements[0].body ? <p className="muted-md">{announcements[0].body}</p> : null}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setBannerHidden(true)} aria-label="Dismiss announcement">Dismiss</button>
            </div>
          </AnimateIn>
        ) : null}

        {results !== null ? (
          <AnimateIn delay={0.1}>
            <div className="panel panel-spaced">
              <div className="panel-header">
                <div className="panel-title">Results for &ldquo;{query.trim()}&rdquo;</div>
                <button className="btn btn-ghost btn-sm" onClick={() => { setQuery(""); setResults(null); }}>Clear</button>
              </div>
              {results.length === 0 ? (
                <p className="muted-md">Nothing found — try a shorter term.</p>
              ) : (
                results.map((r) => (
                  <button
                    key={`${r.kind}-${r.id}`}
                    className="row-divider"
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
                    onClick={() => {
                      if (r.kind === "Space") {
                        const match = spaces.find((s) => s.id === r.id);
                        if (match) router.push(`/spaces/${match.slug}`);
                      } else {
                        router.push(`/ideas/${r.id}`);
                      }
                    }}
                  >
                    <div className="idea-card-tag">{r.kind}</div>
                    <div style={{ flex: 1 }}>
                      <div className="mono-md">{r.name}</div>
                      {r.detail ? <div className="muted-xs">{r.detail}</div> : null}
                    </div>
                  </button>
                ))
              )}
            </div>
          </AnimateIn>
        ) : null}

        <div className="dashboard-grid">
          <div>
            {loading ? (
              <SkeletonPanel />
            ) : (
              <AnimateIn delay={0.1}>
                <div className="panel panel-spaced">
                  <div className="panel-header">
                    <div className="panel-title">Trending ideas</div>
                    <Link href="/ideas" className="btn btn-ghost btn-sm">
                      See all <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="ideas-grid">
                    {filteredIdeas.slice(0, 3).map((idea, i) => (
                      <AnimateIn key={idea.id} delay={0.1 + i * 0.1}>
                        <TiltCard
                          className="idea-card"
                          onClick={() => router.push(`/ideas/${idea.id}`)}
                        >
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
                    ))}
                  </div>
                </div>
              </AnimateIn>
            )}

            <AnimateIn delay={0.3}>
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Active Spaces</div>
                  <Link href="/spaces/create" className="btn btn-primary btn-sm">
                    <Plus size={12} /> New Space
                  </Link>
                </div>
                <div className="filter-row">
                  {["All", "Care", "Climate", "Community"].map((cat) => (
                    <button
                      key={cat}
                      className={`chip${category === cat ? " active" : ""}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {loading ? (
                  <>
                    <SkeletonSpaceCard />
                    <div style={{ height: 12 }} />
                    <SkeletonSpaceCard />
                  </>
                ) : (
                  filteredSpaces.map((space) => (
                    <TiltCard
                      key={space.id}
                      className="idea-card idea-card-spaced"
                      onClick={() => router.push(`/spaces/${space.slug}`)}
                    >
                      <div className="idea-card-tag">{space.category}</div>
                      <div className="idea-card-title">{space.name}</div>
                      <div className="idea-card-desc">{space.purpose}</div>
                      <div className="idea-card-meta">
                        <span>{space.memberCount} people</span>
                        <span>{space.progress}% progress</span>
                        <span className="spacer">{space.status}</span>
                      </div>
                    </TiltCard>
                  ))
                )}
              </div>
            </AnimateIn>
          </div>

          <div>
            <AnimateIn delay={0.2}>
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Quick actions</div>
                </div>
                <div className="stack stack-8">
                  <Link href="/ideas" className="btn btn-block">
                    Share an idea <Plus size={14} />
                  </Link>
                  <Link href="/spaces/create" className="btn btn-block">
                    Open a Space <ArrowRight size={14} />
                  </Link>
                  <Link href="/profile" className="btn btn-block">
                    View profile
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </>
  );
}
