"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Phone, Bot, ArrowRight } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { toChatMessage, type ChatMessage } from "@/lib/models";
import { AnimateIn } from "@/components/Animations";
import { ProductNav } from "@/components/ProductNav";
import { EmptyState, FieldError } from "@/components/Modal";

const AI_KINDS = ["planning_interview", "proposal", "summary", "task_breakdown", "memory_question"] as const;

export default function InboxPage() {
  return (
    <Suspense fallback={<p style={{ padding: 24 }}>Loading inbox…</p>}>
      <InboxInner />
    </Suspense>
  );
}

function InboxInner() {
  const search = useSearchParams();
  const [slug, setSlug] = useState(search.get("space") ?? "");
  const [rooms, setRooms] = useState<Array<{ slug: string; name: string }>>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiKind, setAiKind] = useState<(typeof AI_KINDS)[number]>("summary");
  const [aiReply, setAiReply] = useState("I'm here to help the team make the next useful thing easier to see.");
  const [calls, setCalls] = useState<Array<{ id: string; title: string; status: string }>>([]);
  const [callTitle, setCallTitle] = useState("");
  const [dmRequests, setDmRequests] = useState<Array<{ id: string; senderUserId: string; body: string; status: string }>>([]);

  useEffect(() => {
    if (!slug) return;
    api.chat.history(slug).then(({ items }) => setMessages(items.map((m) => toChatMessage(m)))).catch(() => {});
    api.calls.list(slug).then(({ items }) => setCalls(items)).catch(() => {});
  }, [slug]);

  useEffect(() => {
    api.chat.dmRequests().then(({ items }) => setDmRequests(items)).catch(() => {});
    // Space picker: following first, then discover, deduped by slug.
    Promise.allSettled([api.discover.following(), api.discover.spaces()]).then(([f, s]) => {
      const seen = new Set<string>();
      const list: Array<{ slug: string; name: string }> = [];
      const push = (items: Array<{ slug: string; name: string }>) => {
        for (const sp of items ?? []) {
          if (sp?.slug && !seen.has(sp.slug)) {
            seen.add(sp.slug);
            list.push({ slug: sp.slug, name: sp.name });
          }
        }
      };
      if (f.status === "fulfilled") push(f.value.items as Array<{ slug: string; name: string }>);
      if (s.status === "fulfilled") push(s.value.items as Array<{ slug: string; name: string }>);
      setRooms(list);
      if (!search.get("space") && list.length > 0) setSlug(list[0].slug);
    });
  }, []);

  async function send() {
    if (!draft.trim() || !slug) return;
    setChatError(null);
    try {
      const { message } = await api.chat.send(slug, draft.trim());
      setMessages([...messages, toChatMessage(message)]);
      setDraft("");
    } catch (e) {
      setChatError(e instanceof ApiError ? e.message : "Could not send this message.");
    }
  }

  async function askAi() {
    if (!aiPrompt.trim() || !slug) return;
    setAiReply("Thinking with the team...");
    try {
      const { run } = await api.ai.run(slug, { kind: aiKind, prompt: aiPrompt.trim() });
      setAiReply(`Run queued (${run.status}). Refresh the Space AI history for the result.`);
    } catch (e) {
      setAiReply(e instanceof ApiError ? e.message : "A gentle next step: turn the conversation into one testable question.");
    }
    setAiPrompt("");
  }

  async function scheduleCall() {
    if (!callTitle.trim() || !slug) return;
    try {
      const { call } = await api.calls.create(slug, { title: callTitle.trim() });
      setCalls([...calls, call]);
      setCallTitle("");
    } catch {}
  }

  async function joinCall(callId: string) {
    try {
      const { serverUrl, token } = await api.calls.join(callId);
      setAiReply(`Join token issued for ${serverUrl}. Paste it into your LiveKit client. Token: ${token.slice(0, 12)}…`);
    } catch {}
  }

  return (
    <>
      <ProductNav />

      <div className="dashboard">
        <AnimateIn>
          <div className="dashboard-header dashboard-header-row">
            <div>
              <div className="eyebrow">Collaboration, kept close</div>
              <h1 className="dashboard-title">People, not pings.</h1>
              <p className="dashboard-subtitle">Conversations and calls stay connected to the purpose of the work.</p>
            </div>
            <label style={{ fontSize: 13 }}>Space room
              <select value={slug} onChange={(e) => setSlug(e.target.value)} style={{ display: "block", marginTop: 4, minWidth: 200 }} aria-label="Choose a Space room">
                <option value="">Choose a room…</option>
                {rooms.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
              </select>
            </label>
          </div>
        </AnimateIn>

        <div className="inbox-grid">
          <div>
            <AnimateIn delay={0.1}>
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <div className="panel-title">{slug ? `${slug} — shared room` : "Shared room"}</div>
                    <div className="mono-xs mt-8">Space chat + DMs</div>
                  </div>
                </div>

                {!slug ? (
                  <EmptyState title="Pick a room to start" hint="Choose one of your Spaces above — chat, calls, and assist load together." />
                ) : (
                  <>
                    <div className="scroll-area mb-16">
                      {messages.map((msg) => (
                        <div key={msg.id} className="comment">
                          <div className="avatar avatar-sm">
                            {msg.sender.slice(0, 2).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="comment-meta">
                              <strong className="mono-md">{msg.sender}</strong>
                              <time className="muted-xs">{msg.time}</time>
                            </div>
                            <p className="comment-body">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      {messages.length === 0 ? <p className="muted-md">No messages yet.</p> : null}
                    </div>
                    <FieldError message={chatError} />
                    <div className="row-8">
                      <input
                        className="input"
                        style={{ flex: 1 }}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && send()}
                        placeholder="Say what is useful to say..."
                        aria-label="Send a message"
                      />
                      <button className="btn btn-primary" onClick={send} aria-label="Send">
                        <Send size={14} />
                      </button>
                    </div>
                  </>
                )}

                <div style={{ marginTop: 24 }}>
                  <div className="eyebrow-muted-tight mb-12">Message requests</div>
                  {dmRequests.map((r) => (
                    <div key={r.id} className="row-8" style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 13, flex: 1 }}>{r.body} ({r.status})</span>
                      {r.status === "pending" ? (
                        <>
                          <button className="btn btn-sm" onClick={() => api.chat.reviewDm(r.id, "accepted").catch(() => {})}>Accept</button>
                          <button className="btn btn-sm" onClick={() => api.chat.reviewDm(r.id, "declined").catch(() => {})}>Decline</button>
                        </>
                      ) : null}
                    </div>
                  ))}
                  {dmRequests.length === 0 ? <p className="muted-md">No requests.</p> : null}
                </div>
              </div>
            </AnimateIn>
          </div>

          <div>
            <AnimateIn delay={0.2}>
              <div className="panel panel-spaced-sm">
                <div className="eyebrow-muted-tight center mb-12">Calls</div>
                {calls.map((c) => (
                  <div key={c.id} className="row-8" style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 13, flex: 1 }}>{c.title} · {c.status}</span>
                    <button className="btn btn-sm" onClick={() => joinCall(c.id)}>Join</button>
                  </div>
                ))}
                {calls.length === 0 ? <p className="muted-sm center mb-16">No calls yet.</p> : null}
                <div className="row-8">
                  <input className="input" style={{ flex: 1 }} value={callTitle} onChange={(e) => setCallTitle(e.target.value)} placeholder="Call title…" aria-label="Call title" />
                  <button className="btn btn-primary btn-block" onClick={scheduleCall} style={{ width: "auto" }}>
                    Schedule <Phone size={14} />
                  </button>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.3}>
              <div className="panel">
                <div className="row-12 mb-16">
                  <div className="icon-circle">
                    <Bot size={16} />
                  </div>
                  <div>
                    <div className="mono-lg">Avera assist</div>
                    <div className="muted-xs">Gentle clarity, when you need it.</div>
                  </div>
                </div>
                <p className="muted-md mb-12">{aiReply}</p>
                <select value={aiKind} onChange={(e) => setAiKind(e.target.value as typeof aiKind)} style={{ width: "100%", marginBottom: 8 }}>
                  {AI_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                <div className="row-8">
                  <input
                    className="input"
                    style={{ flex: 1, fontSize: 12, padding: "8px 12px" }}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && askAi()}
                    placeholder="Ask for a next step..."
                    aria-label="Ask Avera assist"
                  />
                  <button className="btn" onClick={askAi} aria-label="Ask">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </>
  );
}
