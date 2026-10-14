"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Flame, ArrowUpRight, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { toIdea, toSpace, type Idea, type Space } from "@/lib/models";
import { AnimateIn } from "@/components/Animations";
import { ProductNav } from "@/components/ProductNav";
import { SkeletonIdeaCard, SkeletonSpaceCard } from "@/components/Skeleton";
import { EmptyState } from "@/components/Modal";

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DiscoverFallback />}>
      <DiscoverInner />
    </Suspense>
  );
}

function DiscoverFallback() {
  return (
    <>
      <ProductNav />
      <div className="dashboard">
        <p style={{ padding: 24 }}>Warming up the studio…</p>
      </div>
    </>
  );
}

function DiscoverInner() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.allSettled([api.discover.ideas(), api.discover.spaces()]).then(([ideasRes, spacesRes]) => {
      if (!alive) return;
      if (ideasRes.status === "fulfilled") setIdeas(ideasRes.value.items.map((i) => toIdea(i)));
      if (spacesRes.status === "fulfilled") setSpaces(spacesRes.value.items.map((s) => toSpace(s)));
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const trending = [...ideas].sort((a, b) => b.interestCount - a.interestCount).slice(0, 3);
  const totalInterest = ideas.reduce((sum, idea) => sum + idea.interestCount, 0);

  return (
    <>
      <ProductNav />

      <div className="dashboard">
        <AnimateIn>
          <div className="dashboard-header dashboard-header-row">
            <div>
              <div className="eyebrow">Discover</div>
              <h1 className="dashboard-title">Ideas worth your attention.</h1>
              <p className="dashboard-subtitle">
                A gentle feed of what people are building — and the Spaces looking for someone like you.
              </p>
            </div>
            <Link href="/ideas" className="btn">
              <Compass size={16} /> Browse all ideas
            </Link>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <div className="filter-row" style={{ marginBottom: 24 }}>
            <div className="metrics-tile" style={{ minWidth: 160 }}>
              <div className="metrics-tile-label">Live ideas</div>
              <div className="metrics-tile-value">{loading ? "—" : ideas.length}</div>
            </div>
            <div className="metrics-tile" style={{ minWidth: 160 }}>
              <div className="metrics-tile-label">Open Spaces</div>
              <div className="metrics-tile-value">{loading ? "—" : spaces.length}</div>
            </div>
            <div className="metrics-tile" style={{ minWidth: 180 }}>
              <div className="metrics-tile-label">People interested</div>
              <div className="metrics-tile-value">{loading ? "—" : totalInterest}</div>
            </div>
          </div>
        </AnimateIn>

        <div className="dashboard-grid">
          <div>
            <AnimateIn delay={0.1}>
              <div className="row-between" style={{ marginBottom: 16 }}>
                <h2 className="panel-title row-8">
                  <Flame size={18} style={{ color: "var(--terracotta)" }} /> Trending now
                </h2>
                <Link href="/ideas" className="btn btn-ghost btn-sm">
                  See all <ArrowUpRight size={14} />
                </Link>
              </div>
            </AnimateIn>

            <div className="ideas-grid">
              {loading ? (
                <>
                  <SkeletonIdeaCard />
                  <SkeletonIdeaCard />
                  <SkeletonIdeaCard />
                </>
              ) : trending.length === 0 ? (
                <EmptyState title="Nothing trending yet" hint="Be the first to share an idea on the Ideas board." />
              ) : (
                trending.map((idea, i) => (
                  <AnimateIn key={idea.id} delay={0.12 + i * 0.05}>
                    <Link href="/ideas" className="idea-card" style={{ height: "100%" }}>
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
                        <span>by {idea.author}</span>
                      </div>
                    </Link>
                  </AnimateIn>
                ))
              )}
            </div>
          </div>

          <aside>
            <AnimateIn delay={0.15}>
              <div className="panel panel-spaced">
                <div className="panel-header" style={{ marginBottom: 12 }}>
                  <div>
                    <div className="panel-title">Spaces hiring</div>
                    <div className="mono-xs mt-8">Find your people</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {loading ? (
                    <>
                      <SkeletonSpaceCard />
                      <SkeletonSpaceCard />
                    </>
                  ) : spaces.length === 0 ? (
                    <EmptyState title="No open Spaces yet" hint="Check back soon." />
                  ) : (
                    spaces.slice(0, 4).map((space) => (
                      <Link key={space.id} href={`/spaces/${space.slug}`} className="panel" style={{ padding: 14, display: "block" }}>
                        <div className="row-between">
                          <span className="compose-label">{space.name}</span>
                          <ArrowUpRight size={14} style={{ color: "var(--dust)" }} />
                        </div>
                        <p className="mono-xs mt-8" style={{ color: "var(--dust)" }}>
                          {space.category} · {space.memberCount || "a few"} members
                        </p>
                      </Link>
                    ))
                  )}
                </div>
                <hr className="row-divider" />
                <Link href="/spaces/create" className="btn btn-ghost btn-sm" style={{ width: "100%" }}>
                  Start a Space
                </Link>
              </div>
            </AnimateIn>
          </aside>
        </div>
      </div>
    </>
  );
}
