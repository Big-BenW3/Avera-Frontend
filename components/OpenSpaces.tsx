"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import type { ApiSpace } from "@/lib/models";

const TYPE_LABEL: Record<ApiSpace["type"], string> = {
  startup: "Startup",
  hackathon: "Hackathon",
  open_source: "Open source",
  client_project: "Client project",
  personal: "Personal",
  experiment: "Experiment",
};

/**
 * Real public Spaces straight from the API.
 *
 * This replaces a hardcoded array of three invented testimonials — fabricated
 * quotes attributed to invented people, which is the single most common tell of
 * an AI-built landing page. Real Spaces are better marketing anyway: they are
 * proof by artifact, and they update themselves.
 *
 * Renders nothing at all when there are no public Spaces yet, rather than
 * padding the section with placeholders.
 */
export default function OpenSpaces() {
  const { data, isLoading } = useQuery({
    queryKey: ["discover", "spaces"],
    queryFn: () => api.discover.spaces(),
    staleTime: 60_000,
    retry: 1,
  });

  const spaces = (data?.items ?? []).filter((s) => s.visibility === "public").slice(0, 3);

  if (isLoading) {
    return (
      <section className="section" id="spaces">
        <div className="container">
          <div className="open-spaces-grid">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton open-space-card" style={{ height: 168 }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Nothing public yet — show the section heading and nothing else. No fake cards.
  if (spaces.length === 0) return null;

  return (
    <section className="section" id="spaces">
      <div className="container">
        <div className="open-spaces-head">
          <div>
            <div className="section-kicker mb-8">Open Spaces</div>
            <h2 className="section-title">Real rooms, right now.</h2>
          </div>
          <Link href="/discover" className="open-spaces-more">
            Browse all <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="open-spaces-grid">
          {spaces.map((space, i) => (
            <Link
              key={space.id}
              href={`/spaces/${space.slug}`}
              className="open-space-card"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="open-space-meta">
                <span className="open-space-type">{TYPE_LABEL[space.type] ?? space.type}</span>
                {space.recruiting ? <span className="open-space-open">Open to join</span> : null}
              </div>
              <h3 className="open-space-name">{space.name}</h3>
              <p className="open-space-summary">{space.summary}</p>
              <div className="open-space-foot">
                {space.category ? <span>{space.category}</span> : null}
                <ArrowUpRight size={15} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}