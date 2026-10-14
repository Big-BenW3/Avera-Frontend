import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { AnimateIn } from "@/components/Animations";
import Link from "next/link";
import WorkspacePreview, { HouseMark } from "@/components/WorkspacePreview";
import ThemeToggle from "@/components/ThemeToggle";

const PHOTOS = {
  hands:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  studio:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  faces: [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  ],
};

const FOR_WHO = [
  {
    key: "a",
    role: "The one with the idea",
    name: "Maya keeps a note called “someday”.",
    copy: "It will not leave her alone. She needs a room for it — not another doc, a home with people in it.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "b",
    role: "The one who designs",
    name: "Tomas cares what it is for.",
    copy: "He wants to build with intention, not just aesthetics. A roadmap people actually read.",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    key: "c",
    role: "The one who gathers",
    name: "Priya holds the room together.",
    copy: "She organises neighbours, not tickets. Conversation stays beside the work it is about.",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
  },
];

const CRAFT = [
  { n: "01", title: "One Space per meaningful thing", body: "Purpose, people, tasks, roadmap, and conversation live together instead of across six tabs." },
  { n: "02", title: "Ideas that can actually ship", body: "An idea becomes a Space the moment there is someone to build it with. No graveyard of notes." },
  { n: "03", title: "Conversation in context", body: "Chat, files, and calls sit beside the work they are about — nobody reconstructs the thread." },
  { n: "04", title: "Invite deliberately", body: "Private or public, with join requests and roles you control. Contribution has room to breathe." },
  { n: "05", title: "Roadmaps people read", body: "Now, next, and later — tasks roll up to a horizon anyone can read at a glance." },
  { n: "06", title: "A calm record", body: "Planning notes and activity keep the reasoning close, long after the meeting is forgotten." },
];

const TESTIMONIALS = [
  {
    quote:
      "I had four half-built side projects scattered across three apps. Tidepool is the first one that survived past the first weekend.",
    name: "Maya Chen",
    role: "Product designer, working solo",
    img: PHOTOS.faces[0],
  },
  {
    quote:
      "The roadmap is the first thing I've used that people actually read. It says now, next, later, and everyone stops asking what's next.",
    name: "Tomas Berg",
    role: "Engineer at a small studio",
    img: PHOTOS.faces[1],
  },
  {
    quote:
      "I joined for the task list and stayed for the people. Being in the same room as someone who cares about the same problem changes the work.",
    name: "Priya Raman",
    role: "Community organiser",
    img: PHOTOS.faces[2],
  },
];

export default function LandingPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-dot" />
          avera
        </Link>
        <div className="nav-links">
          <Link href="#for">Who it&apos;s for</Link>
          <Link href="#features">Features</Link>
          <Link href="#collab">Collaborate</Link>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/login" className="btn btn-ghost">Sign in</Link>
          <Link href="/signup" className="btn btn-primary">Get started</Link>
        </div>
      </nav>

      {/* 1 — HERO: offset asymmetric, photo collage right, copy left */}
      <section className="hero hero--editorial">
        <div className="container hero-grid">
          <div className="hero-copy">
            <AnimateIn delay={0.05}>
              <div className="hero-kicker"><HouseMark className="hero-kicker-mark" /> A home for ideas worth finishing</div>
            </AnimateIn>
            <AnimateIn delay={0.12}>
              <h1>Make the thing you keep <em>thinking</em> about.</h1>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <p className="hero-subtitle">
                Avera gives one idea a real home — the people who care, the work in
                progress, and the decisions along the way.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.28}>
              <div className="hero-actions">
                <Link href="/signup" className="btn btn-primary btn-large">
                  Start a Space <ArrowRight size={15} />
                </Link>
                <Link href="/discover" className="btn btn-secondary btn-large">
                  Browse ideas
                </Link>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.36}>
              <div className="hero-proof">
                <div className="hero-proof-faces">
                  {PHOTOS.faces.map((src) => (
                    <Image key={src} src={src} alt="An early Avera member" width={32} height={32} />
                  ))}
                </div>
                <p>Luma, Tidepool and Field Notes already live here.</p>
              </div>
            </AnimateIn>
          </div>
          <AnimateIn delay={0.2} className="hero-visual">
            <WorkspacePreview />
          </AnimateIn>
        </div>
      </section>

      {/* TAPE — a hand-tacked strip between hero and story */}
      <div className="tape" aria-hidden="true">
        <div className="tape-inner">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>Ideas deserve company <HouseMark className="tape-mark" /></span>
          ))}
        </div>
      </div>

      {/* 2 — PROBLEM, story strip with photography */}
      <section className="section story">
        <div className="container story-grid">
          <AnimateIn>
            <div className="story-photo">
              <Image src={PHOTOS.hands} alt="Hands moving sticky notes across a workshop wall" fill sizes="(max-width: 900px) 100vw, 520px" />
              <figcaption>Every tool holds a piece. Nobody holds the whole.</figcaption>
            </div>
          </AnimateIn>
          <div className="story-copy">
          <AnimateIn>
            <div className="section-kicker mb-12">Made for the work that matters</div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="section-title mb-16" style={{ maxWidth: "20ch", marginInline: "auto" }}>
              Not another place to file things away.
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="section-desc" style={{ marginInline: "auto" }}>
              A Space only makes sense if the work actually moves inside it. Avera is
              built around the moment an idea becomes something people are making.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.28}>
            <ul className="story-list">
              <li><Check size={14} /> Six tabs become one room</li>
              <li><Check size={14} /> Threads stay beside the work</li>
              <li><Check size={14} /> Decisions outlive the meeting</li>
            </ul>
          </AnimateIn>
          </div>
        </div>
      </section>

      <section className="section" id="for">
        <div className="container">
          <AnimateIn>
            <div className="section-kicker center mb-12">Who it&apos;s for</div>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="section-title center mb-48">Three kinds of people, one room.</h2>
          </AnimateIn>
          <div className="people-grid">
            {FOR_WHO.map((card, i) => (
              <AnimateIn key={card.key} delay={0.08 * (i + 1)}>
                <article className={`person-card person-card--${card.key}`}>
                  <div className="person-photo">
                    <Image src={card.img} alt={card.name} fill sizes="(max-width: 900px) 100vw, 340px" />
                  </div>
                  <div className="person-body">
                    <div className="person-role">{card.role}</div>
                    <h3>{card.name}</h3>
                    <p>{card.copy}</p>
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section craft" id="features">
        <div className="container craft-grid">
          <div className="craft-sticky">
            <AnimateIn>
              <div className="section-kicker mb-12">What you get</div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h2 className="section-title mb-16">Everything a small project needs, and nothing it does not.</h2>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <div className="craft-photo">
                <Image src={PHOTOS.studio} alt="A sunlit studio where a small team works around one table" fill sizes="(max-width: 900px) 100vw, 420px" />
              </div>
            </AnimateIn>
          </div>
          <div className="craft-rows">
            {CRAFT.map((row, i) => (
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

      <section className="section collab" id="collab">
        <div className="container collab-grid">
          <div className="collab-copy">
            <AnimateIn>
              <div className="section-kicker mb-12">Collaborate</div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h2 className="section-title mb-16">Build with your people, not around them.</h2>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <p className="section-desc mb-24">
                Messages, calls, tasks, and files live inside the same Space as the
                work. No switching between five apps to find one conversation.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.28}>
              <Link href="/signup" className="btn btn-primary">
                Open a Space <ArrowRight size={14} />
              </Link>
            </AnimateIn>
          </div>
          <AnimateIn delay={0.2}>
            <div className="collab-collage">
              <div className="collab-photo collab-photo--a">
                <Image src={PHOTOS.hands} alt="A team planning together around sticky notes" fill sizes="(max-width: 900px) 100vw, 480px" />
              </div>
              <div className="collab-note">
                <HouseMark className="collab-mark" />
                <p>The thread finally lives where the work lives.</p>
                <span>Tidepool, week three</span>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="section" id="testimonials">
        <div className="container">
          <AnimateIn>
            <div className="section-kicker mb-12">From early Spaces</div>
          </AnimateIn>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <AnimateIn key={t.name} delay={0.1 * (i + 1)}>
                <div className="testimonial">
                  <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="testimonial-author">
                    <Image className="testimonial-photo" src={t.img} alt={t.name} width={40} height={40} />
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <AnimateIn>
            <div className="cta-photo-card">
              <Image src={PHOTOS.studio} alt="A warm studio table ready for the next idea" fill sizes="(max-width: 900px) 100vw, 1100px" />
              <div className="cta-photo-veil" aria-hidden="true" />
              <div className="cta-photo-copy">
                <div className="cta-photo-kicker">Start small</div>
                <h2>Bring the one idea you have been circling.</h2>
                <p>A Space can start with just you. Invite people when it has something worth showing them.</p>
              <form className="cta-form" action="/signup" method="get">
                <input className="input" type="email" name="email"
                  placeholder="you@example.com" aria-label="Email address" required />
                <button type="submit" className="btn btn-primary">Create a Space</button>
              </form>
              <div className="cta-trust">
                <span><Check size={13} /> Free to start</span>
                <span><Check size={13} /> No credit card</span>
                <span><Check size={13} /> Invite people when you are ready</span>
              </div>
              </div>
              </div>
          </AnimateIn>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">&copy; 2026 Avera. Ideas deserve company.</div>
          <div className="footer-links">
            <Link href="/login">Sign in</Link>
            <Link href="/signup">Sign up</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
