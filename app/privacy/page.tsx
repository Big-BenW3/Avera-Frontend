import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AveraLogo } from "@/components/AuthCard";
import ThemeToggle from "@/components/ThemeToggle";
import { AnimateIn } from "@/components/Animations";

export const metadata: Metadata = {
  title: "Privacy Policy — Avera",
  description: "What Avera collects, why it is collected, and the controls you have over it.",
};

const LAST_UPDATED = "7 November 2026";
// Set this to a monitored address before launch; the contact section renders only when it is set.
const CONTACT_EMAIL: string | null = null;

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <p>We collect only what the product needs to work.</p>
        <ul>
          <li><strong>Account details:</strong> your name, email address, and a password stored as an Argon2id hash. We never store your password in plain text.</li>
          <li><strong>Security data:</strong> if you enable two-factor authentication, the TOTP secret that backs it, plus the sessions signed in to your account.</li>
          <li><strong>Workspace content:</strong> the Spaces you create or join, including tasks, roadmap items, planning notes, ideas, chat messages, and linked design files or repositories.</li>
          <li><strong>Activity and notifications:</strong> events inside your Spaces (such as task changes and invitations) so teammates can follow progress.</li>
          <li><strong>Invitations:</strong> the email addresses you invite to a Space.</li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    body: (
      <>
        <p>We use your information to run Avera: to sign you in, show you the Spaces you belong to, deliver messages and notifications, keep your account secure, and fix problems.</p>
        <p>We do not sell your personal data, and we do not use your workspace content for advertising.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <>
        <p>Avera uses a secure session cookie to keep you signed in. It is strictly necessary, so the app cannot work without it.</p>
        <p>Your theme choice (light or dark) is saved in your browser&apos;s local storage as <code>avera-theme</code>. It never leaves your device.</p>
        <p>We do not use advertising or cross-site tracking cookies.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who can see your content",
    body: (
      <>
        <p>Members of a Space can see that Space&apos;s content. Public Spaces are visible to anyone, including people who are not signed in. Private Spaces are visible only to invited members. Your profile name may be shown to other members and in Discover.</p>
        <p>Real-time audio and video calls are relayed through LiveKit. If you connect GitHub or Figma, Avera stores the links you add and reads only what those integrations need to display in your Space.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <>
        <p>Passwords are hashed with Argon2id, sessions use secure cookies, access inside a Space is controlled by roles, and two-factor authentication is available in Settings. No system is perfectly secure, so we also encourage a strong, unique password and turning on two-factor authentication.</p>
      </>
    ),
  },
  {
    id: "choices",
    title: "Your choices",
    body: (
      <>
        <p>You can update your details and notification preferences, manage two-factor authentication, and review your sessions in <Link href="/settings">Settings</Link>. You can leave a Space at any time.</p>
        <p>You can ask us to correct, export, or delete your account and the personal data tied to it. We keep your data for as long as your account exists, and remove it when you delete the account, except where we are required to keep it by law.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: <p>Avera is built for engineering teams and is not directed at children under 16. If you believe a child has created an account, tell us and we will remove it.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>If we change this policy in a way that matters, we will update the date at the top and, for significant changes, tell you in the product.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo" aria-label="Avera home">
          <AveraLogo size={18} />
        </Link>
        <div aria-hidden="true" />
        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/" className="btn btn-ghost btn-sm">
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </nav>

      <main className="legal container">
        <AnimateIn>
          <header className="legal-head">
            <div className="section-kicker mb-12">Legal</div>
            <h1>Privacy Policy</h1>
            <p className="legal-meta">Last updated {LAST_UPDATED}</p>
            <p className="legal-lede">
              Avera is a workspace for engineering teams. This page explains what we collect, why, and the
              controls you have, in plain language.
            </p>
          </header>
        </AnimateIn>

        <div className="legal-layout">
          <nav className="legal-toc" aria-label="On this page">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`}>{s.title}</a>
            ))}
            {CONTACT_EMAIL ? <a href="#contact">Contact</a> : null}
          </nav>

          <div className="legal-body">
            {SECTIONS.map((s, i) => (
              <AnimateIn key={s.id} delay={0.03 * Math.min(i, 4)}>
                <section id={s.id} className="legal-section">
                  <h2>{s.title}</h2>
                  {s.body}
                </section>
              </AnimateIn>
            ))}
            {CONTACT_EMAIL ? (
              <section id="contact" className="legal-section">
                <h2>Contact</h2>
                <p>Questions or requests about your data: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
              </section>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">&copy; 2026 Avera. Engineered for builders.</div>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/login">Sign in</Link>
            <Link href="/signup">Sign up</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
