import { ArrowRight, Check, Cpu, GitBranch, Layers } from "lucide-react";
import { AnimateIn } from "@/components/Animations";
import Link from "next/link";
import WorkspacePreview from "@/components/WorkspacePreview";
import HeroBackdrop from "@/components/HeroBackdrop";
import HeroTitle from "@/components/HeroTitle";
import OpenSpaces from "@/components/OpenSpaces";
import ThemeToggle from "@/components/ThemeToggle";
import { AveraLogo } from "@/components/AuthCard";
import Faq from "@/components/Faq";

const CAPABILITIES = [
  {
    n: "01",
    title: "Unified Project Spaces",
    body: "Purpose, architecture specs, sprint tasks, roadmap, and conversation live in one context instead of six fragmented tools.",
  },
  {
    n: "02",
    title: "Milestones That Actually Ship",
    body: "Ideas promote into durable Spaces the moment there is a technical plan. Roadmaps roll up into Now, Next, and Later horizons.",
  },
  {
    n: "03",
    title: "In-Context Developer Collaboration",
    body: "Durable chat, files, and LiveKit video rooms sit directly beside the code and tasks they belong to.",
  },
  {
    n: "04",
    title: "Git & Toolchain Integrations",
    body: "Connect GitHub repositories, link Figma design files, and track deployment states within the workspace.",
  },
  {
    n: "05",
    title: "AI Architecture & Task Breakdown",
    body: "Queue technical planning interviews, generate schemas, and break down complex specs into actionable sprint items.",
  },
  {
    n: "06",
    title: "Zero-Compromise Security",
    body: "Self-managed Argon2id hashing, TOTP multi-factor authentication, secure cookie sessions, and strict workspace RBAC.",
  },
];

const PERSONAS = [
  {
    role: "Founders & Tech Leads",
    headline: "System vision meets execution.",
    copy: "Keep technical architecture, roadmap milestones, and team permissions aligned without status meeting overhead.",
    icon: <Cpu size={20} />,
  },
  {
    role: "Core Engineers",
    headline: "High-signal issue tracking.",
    copy: "Sprint tasks, Git repository linkages, and planning notes with zero fluff and full keyboard ergonomics.",
    icon: <GitBranch size={20} />,
  },
  {
    role: "Product & Architecture",
    headline: "Specs that never go stale.",
    copy: "Connect Figma frames, RFC planning notes, and live discussions directly to the tasks implementing them.",
    icon: <Layers size={20} />,
  },
];

export default function LandingPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <AveraLogo size={18} />
        </Link>
        <div className="nav-links">
          <Link href="#capabilities">Capabilities</Link>
          <Link href="#personas">Who it&apos;s for</Link>
          <Link href="#faq">FAQ</Link>
          <Link href="/discover">Discover</Link>
          <Link href="/ideas">Ideas</Link>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Start Building</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero hero--technical hero--stage">
        <HeroBackdrop />
        <div className="container hero-stage">
          <HeroTitle text="Avera" />
          <AnimateIn delay={0.1}>
            <h1 className="hero-tagline">Where technical ideas become shipped products.</h1>
          </AnimateIn>
          <AnimateIn delay={0.18}>
            <p className="hero-subtitle">
              One home for engineering teams and technical founders: live roadmaps, Git-integrated
              tasks, architecture planning, and real-time collaboration.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.26}>
            <div className="hero-actions">
              <Link href="/signup" className="btn btn-primary btn-large">
                Create a Space <ArrowRight size={15} />
              </Link>
              <Link href="/discover" className="btn btn-secondary btn-large">
                Explore Spaces
              </Link>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.34}>
            <ul className="hero-points">
              <li>Free while in beta</li>
              <li>No credit card required</li>
              <li>Self-hostable backend</li>
            </ul>
          </AnimateIn>
          <AnimateIn delay={0.42} className="hero-visual">
            <WorkspacePreview />
          </AnimateIn>
        </div>
      </section>

      {/* CAPABILITIES SECTION */}
      <section className="section craft" id="capabilities">
        <div className="container craft-grid">
          <div className="craft-sticky">
            <AnimateIn>
              <div className="section-kicker mb-12">ENGINEERING CAPABILITIES</div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h2 className="section-title mb-16">
                Purpose-built for speed, clarity, and zero developer bloat.
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <p className="section-desc mb-24">
                Jira is too slow, Slack loses context, and docs rot. Avera organizes technical
                momentum into high-density Spaces where code, specs, and team execution meet.
              </p>
            </AnimateIn>
          </div>
          <div className="craft-rows">
            {CAPABILITIES.map((row, i) => (
              <AnimateIn key={row.n} delay={0.05 * (i + 1)}>
                <div className="craft-row">
                  <span className="craft-num">{row.n}</span>
                  <div>
                    <h3>{row.title}</h3>
                    <p>{row.body}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR (PERSONAS) */}
      <section className="section" id="personas">
        <div className="container">
          <AnimateIn>
            <div className="section-kicker center mb-12">WHO IT&apos;S FOR</div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="section-title center mb-48">Built for technical operators.</h2>
          </AnimateIn>
          <div className="people-grid">
            {PERSONAS.map((card, i) => (
              <AnimateIn key={card.role} delay={0.08 * (i + 1)}>
                <article className="tech-persona-card">
                  <div className="tech-persona-icon">{card.icon}</div>
                  <div className="tech-persona-role">{card.role}</div>
                  <h3 className="tech-persona-title">{card.headline}</h3>
                  <p className="tech-persona-copy">{card.copy}</p>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE SPACES FROM API */}
      <OpenSpaces />

      {/* FAQ */}
      <section className="section faq-section" id="faq">
        <div className="container">
          <AnimateIn>
            <div className="section-kicker center mb-12">FAQ</div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="section-title center mb-48">Questions, answered plainly.</h2>
          </AnimateIn>
          <Faq />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <AnimateIn>
            <div className="cta-tech-card">
              <div className="cta-tech-kicker">START SHIPPING</div>
              <h2>Ready to build what actually matters?</h2>
              <p>Spin up your first engineering Space in seconds. Free during preview.</p>
              <form className="cta-form" action="/signup" method="get">
                <input
                  className="input"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  aria-label="Email address"
                  required
                />
                <button type="submit" className="btn btn-primary">Create a Space</button>
              </form>
              <div className="cta-trust">
                <span><Check size={13} /> Free during beta</span>
                <span><Check size={13} /> No credit card required</span>
                <span><Check size={13} /> Complete data ownership</span>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">&copy; 2026 Avera. Engineered for builders.</div>
          <div className="footer-links">
            <Link href="/discover">Discover</Link>
            <Link href="/ideas">Ideas</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/login">Sign in</Link>
            <Link href="/signup">Sign up</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
