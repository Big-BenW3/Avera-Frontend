"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is Avera free to use?",
    a: "Yes, free while in beta. There is no credit card required to create a Space or invite a team.",
  },
  {
    q: "Can I self-host the backend?",
    a: "Yes. Avera's backend is a self-managed Node + PostgreSQL + Redis stack designed to run on your own infrastructure, not a closed SaaS-only service.",
  },
  {
    q: "How is this different from Jira, Linear, or Notion?",
    a: "Those tools solve one slice each — tickets, issues, or docs — and leave the rest scattered. Avera keeps a Space's purpose, roadmap, tasks, Git activity, and conversation in one context, so nothing needs to be cross-referenced by hand.",
  },
  {
    q: "What happens to an Idea once it's promoted?",
    a: "Promoting an Idea creates a Space pre-seeded with that purpose. Nothing is lost — the original Idea stays linked, and the Space starts with a roadmap and task board instead of a blank page.",
  },
  {
    q: "What security does Avera use?",
    a: "Argon2id password hashing, TOTP multi-factor authentication, httpOnly session cookies, and workspace-scoped role permissions — covered in Settings → Security for every account.",
  },
  {
    q: "Does Avera have an API?",
    a: "Yes, Spaces, tasks, and roadmap items run on a documented REST API — the same one the web app calls — so you can automate anything you can do by hand.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className="faq-item" key={item.q} data-open={isOpen}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <Plus size={16} className="faq-chev" aria-hidden="true" />
            </button>
            <div className="faq-a-wrap">
              <div className="faq-a-inner">
                <p className="faq-a">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
