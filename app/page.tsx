import {
  ArrowRight,
  ArrowUpRight,
  Lightbulb,
  Users,
  Target,
  Sparkles,
  Layers,
  Lock,
  ChevronRight,
  Check,
  Puzzle,
  Workflow,
  Bot,
} from "lucide-react";
import { TiltCard, AnimateIn } from "@/components/Animations";
import Link from "next/link";
import WorkspacePreview from "@/components/WorkspacePreview";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-dot" />
          avera
        </Link>
        <div className="nav-links">
          <Link href="#problem">Problem</Link>
          <Link href="#how">How it works</Link>
          <Link href="#features">Features</Link>
          <Link href="#collab">Collaborate</Link>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/login" className="btn btn-ghost">
            Sign in
          </Link>
          <Link href="/signup" className="btn btn-primary">
            Get started
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <AnimateIn delay={0}>
            <Link href="#execution-gap" className="hero-release-pill">
              <span className="hero-release-dot" />
              <strong>NEW RELEASE</strong>
              <span className="hero-release-text">Autonomous AI Roadmaps</span>
              <ChevronRight size={12} className="hero-release-chevron" />
            </Link>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h1>
              Turn Ideas Into Impact,
              <br />
              Scale Limitlessly
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p>
              Avera is the collaborative intelligence platform where fast-moving teams turn raw ideas into shipped products. Centralized Spaces, live roadmaps, and autonomous guidance.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3}>
            <div className="hero-actions">
              <Link href="/signup" className="btn btn-primary btn-large">
                Get Started Free <ArrowRight size={14} />
              </Link>
              <Link href="/discover" className="btn btn-secondary btn-large">
                Explore Live Ideas <ArrowUpRight size={14} />
              </Link>
            </div>
          </AnimateIn>
          <AnimateIn delay={0.35}>
            <div className="hero-proof">
              <div className="proof-avatars">
                <span className="proof-avatar" style={{ background: "#ffb693" }}>DK</span>
                <span className="proof-avatar" style={{ background: "#85c6ff" }}>MK</span>
                <span className="proof-avatar" style={{ background: "#7fe3b0" }}>HP</span>
                <span className="proof-avatar" style={{ background: "#d3e4fe" }}>AT</span>
              </div>
              <span>Loved by 12,000+ engineers, founders &amp; product leaders</span>
            </div>
          </AnimateIn>
          <div className="hero-workspace">
            <AnimateIn delay={0.4}>
              <WorkspacePreview />
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="section gap-section" id="execution-gap">
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <AnimateIn>
            <span className="gap-pill">The Execution Gap</span>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="gap-title">
              Stop losing breakthrough ideas in fragmented tools
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="gap-desc">
              Conventional team wikis are graveyards for product thinking. Avera connects the idea immediately to the Space where it ships.
            </p>
          </AnimateIn>
          <div className="gap-grid">
            <AnimateIn delay={0.1}>
              <TiltCard className="gap-card">
                <div className="gap-icon gap-icon--orange">
                  <Puzzle size={20} />
                </div>
                <span className="gap-cat">Zero Fragmentation</span>
                <h3>No More Scattered Ideas</h3>
                <p>
                  Ditch messy note pages, unorganized Figma artboards, and ephemeral chat threads. Convert your mountain of chaotic projects into a categorized knowledge matrix.
                </p>
                <div className="gap-widget">
                  <span className="gap-widget-muted">Unorganized ideas</span>
                  <ArrowRight size={12} />
                  <span className="gap-widget-strong">Avera Spaces</span>
                  <span className="gap-widget-badge">96% Sorted</span>
                </div>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <TiltCard className="gap-card">
                <div className="gap-icon gap-icon--green">
                  <Workflow size={20} />
                </div>
                <span className="gap-cat">Core Ideas Flow</span>
                <h3>Structured Roadmaps</h3>
                <p>
                  Transform ideas into actionable milestones automatically. Handle kanban, timeline points, and team syncs without writing a line of glue code.
                </p>
                <div className="gap-widget gap-widget--stack">
                  <span className="gap-widget-label">
                    <span className="gap-widget-pulse" />
                    Automated Milestone Sync
                  </span>
                  <div className="gap-widget-bar">
                    <span style={{ width: "78%" }} />
                  </div>
                  <span className="gap-widget-meter">
                    <strong>78%</strong> Sprint Confidence
                  </span>
                </div>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <TiltCard className="gap-card">
                <div className="gap-icon gap-icon--purple">
                  <Bot size={20} />
                </div>
                <span className="gap-cat">Collaborative AI</span>
                <h3>Autonomous Guidance</h3>
                <p>
                  AI doesn&rsquo;t just autocomplete text. It identifies risks, bridges product thinking and technical scope, and flags missing specs in real-time.
                </p>
                <div className="gap-widget gap-widget--toast">
                  <span className="gap-toast-icon">
                    <Bot size={12} />
                  </span>
                  <div>
                    <span className="gap-toast-title">AI Spec Suggestion</span>
                    <span className="gap-toast-body">
                      Draft missing API specs based on audit tokens workaround
                    </span>
                  </div>
                </div>
              </TiltCard>
            </AnimateIn>
          </div>
        </div>
      </section>

      <div className="stat-bar">
        <div className="stat-bar-item">
          <strong>01</strong>
          <span>Begin with need</span>
        </div>
        <div className="stat-bar-item">
          <strong>02</strong>
          <span>Build with people</span>
        </div>
        <div className="stat-bar-item">
          <strong>03</strong>
          <span>Make it visible</span>
        </div>
        <div className="stat-bar-item">
          <strong>04</strong>
          <span>Ship on purpose</span>
        </div>
      </div>

      <section className="section" id="problem">
        <div className="container">
          <AnimateIn>
            <div className="section-label">02 — The problem</div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="section-title">
              Good ideas die in isolation. Tools scatter the work. Collaboration becomes noise.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="section-desc">
              Most people with ideas that matter have no clear place to put them. The tools that exist pull attention in every direction except forward.
            </p>
          </AnimateIn>
          <div className="problem-grid">
            <AnimateIn delay={0.1}>
              <TiltCard className="problem-card">
                <span className="problem-card-num">P.01</span>
                <div>
                  <h3>Ideas have no home</h3>
                  <p>A thought arrives. You jot it in notes, forget about it, and it disappears. There is no place designed to hold a beginning.</p>
                </div>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <TiltCard className="problem-card">
                <span className="problem-card-num">P.02</span>
                <div>
                  <h3>Tools create distance</h3>
                  <p>Slack for talk. Notion for docs. Linear for tasks. Figma for design. Context is rebuilt every single day across five different apps.</p>
                </div>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <TiltCard className="problem-card">
                <span className="problem-card-num">P.03</span>
                <div>
                  <h3>Collaboration is fragmented</h3>
                  <p>Finding people who care about the same problem is luck, not design. And once you find them, there is no shared room to build in.</p>
                </div>
              </TiltCard>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <AnimateIn>
            <div className="section-label">03 — How it works</div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="section-title">
              From idea to launch in three movements.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="section-desc">
              Avera structures the journey so nothing falls through the cracks. Each step leads naturally to the next.
            </p>
          </AnimateIn>
          <div className="steps">
            <AnimateIn delay={0.1}>
              <TiltCard className="step">
                <div className="step-num">01</div>
                <h3>Post an idea</h3>
                <p>Name the problem or possibility. Give it a clear sentence. Let it sit as an open invitation for the right people to notice.</p>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <TiltCard className="step">
                <div className="step-num">02</div>
                <h3>Gather your people</h3>
                <p>Find collaborators who bring the skills, curiosity, and care your idea needs. Open a shared Space and start building together.</p>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <TiltCard className="step">
                <div className="step-num">03</div>
                <h3>Ship the thing</h3>
                <p>Turn conversations into tasks, decisions into progress, and progress into a launch. Everything stays in one place.</p>
              </TiltCard>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <AnimateIn>
            <div className="section-label">04 — Features</div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="section-title">
              Built for the work before it has a name.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="section-desc">
              Every feature exists to reduce the distance between an idea and the people who can make it real.
            </p>
          </AnimateIn>
          <div className="features-grid">
            <AnimateIn delay={0.1}>
              <TiltCard className="feature-card">
                <div className="feature-icon">
                  <Lightbulb size={18} />
                </div>
                <h3>Idea board</h3>
                <p>Post ideas, questions, and early-stage thinking. Categorize by theme, track interest, and let the right people find you.</p>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <TiltCard className="feature-card">
                <div className="feature-icon">
                  <Users size={18} />
                </div>
                <h3>Shared Spaces</h3>
                <p>Every project gets a dedicated room with its own purpose, tasks, roadmap, and conversation. Context never needs rebuilding.</p>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <TiltCard className="feature-card">
                <div className="feature-icon">
                  <Target size={18} />
                </div>
                <h3>Purpose-first design</h3>
                <p>Every Space starts with a one-sentence purpose. It stays visible so every task and decision has a reason for existing.</p>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.4}>
              <TiltCard className="feature-card">
                <div className="feature-icon">
                  <Sparkles size={18} />
                </div>
                <h3>AI assist</h3>
                <p>Turn loose discussions into next steps. Avera AI suggests actions, summarizes decisions, and surfaces what matters.</p>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.5}>
              <TiltCard className="feature-card">
                <div className="feature-icon">
                  <Layers size={18} />
                </div>
                <h3>Roadmap & tasks</h3>
                <p>Plan in milestones, execute in tasks. Three columns — to hold, in the room, made real. Simple enough to actually use.</p>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.6}>
              <TiltCard className="feature-card">
                <div className="feature-icon">
                  <Lock size={18} />
                </div>
                <h3>Controlled access</h3>
                <p>Invite deliberately. Control who sees what. Build a culture where contribution has room and people feel safe showing up.</p>
              </TiltCard>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="section" id="collab">
        <div className="container">
          <AnimateIn>
            <div className="section-label">05 — Collaborate</div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="section-title">
              Build with your people. Not around them.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <div className="collab-block">
              <TiltCard className="collab-visual" intensity={6}>
                <div className="collab-cell">MC</div>
                <div className="collab-cell active">NI</div>
                <div className="collab-cell">AS</div>
                <div className="collab-cell active">LO</div>
                <div className="collab-cell">EM</div>
                <div className="collab-cell active">SK</div>
                <div className="collab-cell">JR</div>
                <div className="collab-cell active">TW</div>
                <div className="collab-cell">PK</div>
              </TiltCard>
              <div className="collab-text">
                <h3>
                  A shared room for ideas, talk, decisions, and shipping.
                </h3>
                <p>
                  Messages, calls, tasks, and files live inside the same Space as the work. No switching between five apps to find one conversation. Collaborate with friends or strangers who care about the same problem.
                </p>
                <Link href="/signup" className="btn btn-primary">
                  Open a Space <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="section" id="testimonials">
        <div className="container">
          <AnimateIn>
            <div className="section-label">06 — Signal</div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="section-title">
              What early builders are saying.
            </h2>
          </AnimateIn>
          <div className="testimonials-grid">
            <AnimateIn delay={0.1}>
              <TiltCard className="testimonial">
                <blockquote>
                  &ldquo;I posted an idea at midnight. By morning, three people had offered to help build it. That has never happened to me before.&rdquo;
                </blockquote>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">NI</div>
                  <div>
                    <div className="testimonial-name">Nia Imani</div>
                    <div className="testimonial-role">Product designer</div>
                  </div>
                </div>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <TiltCard className="testimonial">
                <blockquote>
                  &ldquo;The Space gives my side project the same structure as my day job. Tasks, roadmap, messages — all in one place. It just works.&rdquo;
                </blockquote>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">AS</div>
                  <div>
                    <div className="testimonial-name">Ari Sato</div>
                    <div className="testimonial-role">Engineer, building Luma</div>
                  </div>
                </div>
              </TiltCard>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <TiltCard className="testimonial">
                <blockquote>
                  &ldquo;I was tired of ideas dying in my notes app. Avera gave them a place to breathe and people to grow with. That is the whole thing.&rdquo;
                </blockquote>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">LO</div>
                  <div>
                    <div className="testimonial-name">Leo Okafor</div>
                    <div className="testimonial-role">Community researcher</div>
                  </div>
                </div>
              </TiltCard>
            </AnimateIn>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <AnimateIn>
            <div className="cta-card">
              <span className="cta-pill">Start in no seconds</span>
              <h2>
                Ready to turn your ideas
                <br />
                into shipped products?
              </h2>
              <p>
                Join thousands of high-velocity teams building with clarity. Free 14-day trial on Pro. No credit card required.
              </p>
              <form className="cta-form" action="/signup" method="get">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your team email"
                  aria-label="Team email"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Claim Space
                </button>
              </form>
              <div className="cta-trust">
                <span>
                  <Check size={12} /> Instant setup
                </span>
                <span>
                  <Check size={12} /> Unlimited team members
                </span>
                <span>
                  <Check size={12} /> Cancel anytime
                </span>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            &copy; 2026 Avera. Ideas deserve company.
          </div>
          <div className="footer-links">
            <Link href="/login">Sign in</Link>
            <Link href="/signup">Sign up</Link>
            <span className="footer-link-disabled" title="Coming soon">Privacy</span>
            <span className="footer-link-disabled" title="Coming soon">Terms</span>
          </div>
        </div>
      </footer>
    </>
  );
}
