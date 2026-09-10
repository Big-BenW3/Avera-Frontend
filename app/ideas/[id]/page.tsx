"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Bookmark, MessageCircle, Send } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { ApiIdeaComment, Idea } from "@/lib/models";
import { toIdea } from "@/lib/models";
import { AnimateIn, TiltCard } from "@/components/Animations";
import { ProductNav } from "@/components/ProductNav";
import { SkeletonCard, SkeletonIdeaCard } from "@/components/Skeleton";
import { Modal, FieldError } from "@/components/Modal";
import { ReportButton } from "@/components/ReportButton";
import { toast } from "@/components/Toast";

const seedIdeas: Record<string, Idea> = {
  "idea-luma": { id: "idea-luma", title: "Luma — gentler care after a hard day", summary: "A tiny care circle that helps friends show up with the right kind of support.", category: "Care", author: "Nia I.", interestCount: 42, commentCount: 12, stage: "forming" },
  "idea-field": { id: "idea-field", title: "Field Notes for city-sized curiosity", summary: "A shared way to notice what is changing in the places we call home.", category: "Community", author: "Leo M.", interestCount: 31, commentCount: 8, stage: "spark" },
  "idea-bright": { id: "idea-bright", title: "Brightwork — less lonely creative practice", summary: "Small shared rituals for people keeping a creative promise to themselves.", category: "Creativity", author: "Ari S.", interestCount: 57, commentCount: 18, stage: "building" },
};

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [saved, setSaved] = useState(false);
  const [interested, setInterested] = useState(false);
  const [comments, setComments] = useState<ApiIdeaComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerText, setOfferText] = useState("");
  const [offerAvailability, setOfferAvailability] = useState("");
  const [offerError, setOfferError] = useState<string | null>(null);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [promoteName, setPromoteName] = useState("");
  const [promoteSummary, setPromoteSummary] = useState("");
  const [promoteType, setPromoteType] = useState<"startup" | "hackathon" | "open_source" | "client_project" | "personal" | "experiment">("startup");
  const [promoteError, setPromoteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Non-UUID seed ids stay offline; real ids load from the API.
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      if (seedIdeas[id]) setIdea(seedIdeas[id]);
      else setNotFound(true);
      return;
    }
    api.ideas
      .detail(id)
      .then(({ idea: remote, comments: thread }) => {
        if (cancelled) return;
        if (remote) {
          setIdea(toIdea(remote));
          setComments(thread ?? []);
          setPromoteName(remote.title);
          setPromoteSummary(remote.body?.slice(0, 200) ?? "");
          api.auth.me().then(({ user }) => setIsOwner(user.id === remote.authorUserId)).catch(() => {});
        } else if (seedIdeas[id]) setIdea(seedIdeas[id]);
        else setNotFound(true);
      })
      .catch(() => {
        if (cancelled) return;
        if (seedIdeas[id]) setIdea(seedIdeas[id]);
        else setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function toggleSaved() {
    const next = !saved;
    setSaved(next);
    try {
      if (/^[0-9a-f-]{36}$/i.test(id)) {
        if (next) await api.ideas.bookmark(id);
        else await api.ideas.unbookmark(id);
      }
    } catch {
      setSaved(!next);
    }
  }

  async function addComment() {
    if (!newComment.trim()) return;
    setCommentError(null);
    try {
      const { comment } = await api.ideas.comment(id, newComment.trim());
      setComments([...comments, comment]);
      setNewComment("");
      if (idea) setIdea({ ...idea, commentCount: idea.commentCount + 1 });
    } catch (e) {
      setCommentError(e instanceof ApiError ? e.message : "Could not post this comment.");
    }
  }

  async function toggleInterest() {
    try {
      if (interested) {
        await api.ideas.uninterest(id);
        setInterested(false);
        if (idea) setIdea({ ...idea, interestCount: Math.max(0, idea.interestCount - 1) });
      } else {
        await api.ideas.interest(id);
        setInterested(true);
        if (idea) setIdea({ ...idea, interestCount: idea.interestCount + 1 });
      }
    } catch {}
  }

  async function hideComment(commentId: string) {
    try {
      await api.ideas.hideComment(id, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {}
  }

  async function submitOffer() {
    if (offerText.trim().length < 5) {
      setOfferError("Offers need 5+ characters.");
      return;
    }
    setOfferError(null);
    try {
      await api.ideas.offer(id, { offer: offerText.trim(), ...(offerAvailability.trim() ? { availability: offerAvailability.trim() } : {}) });
      setOfferOpen(false);
      setOfferText("");
      setOfferAvailability("");
      toast("Offer sent to the creator.");
    } catch (e) {
      setOfferError(e instanceof ApiError ? e.message : "Could not send this offer.");
    }
  }

  async function submitPromote() {
    if (promoteName.trim().length < 2 || promoteSummary.trim().length < 10) {
      setPromoteError("Name needs 2+ characters and summary needs 10+.");
      return;
    }
    setPromoteError(null);
    try {
      const { space } = await api.ideas.promote(id, { name: promoteName.trim(), summary: promoteSummary.trim(), type: promoteType, visibility: "private" });
      router.push(`/spaces/${space.slug}`);
    } catch (e) {
      setPromoteError(e instanceof ApiError ? e.message : "Could not create this Space.");
    }
  }

  if (notFound) {
    return (
      <>
        <ProductNav />
        <div className="dashboard">
          <AnimateIn>
            <div className="not-found" style={{ minHeight: "60vh" }}>
              <div>
                <div className="not-found-code">404</div>
                <h1 className="not-found-title">This idea has not been posted yet.</h1>
                <p className="not-found-body">The link you followed may be old, or the idea was taken down. Return to the board to find what is live.</p>
                <Link className="btn btn-primary btn-large" href="/ideas">
                  <ArrowLeft size={14} /> Back to ideas
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </>
    );
  }

  if (!idea) {
    return (
      <>
        <ProductNav />
        <div className="dashboard">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
            <SkeletonIdeaCard />
            <div>
              <SkeletonCard />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProductNav />

      <div className="dashboard">
        <AnimateIn>
          <Link href="/ideas" className="btn btn-ghost btn-back">
            <ArrowLeft size={14} /> Back
          </Link>
        </AnimateIn>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          <div>
            <AnimateIn delay={0.1}>
              <TiltCard className="panel">
                <div className="eyebrow-muted-tight mb-16">
                  {idea.category} · {idea.stage}
                </div>
                <h1 className="mono-display mb-16">{idea.title}</h1>
                <p className="muted-intro mb-24">
                  {idea.summary} This is not a polished pitch—it is an open door for people who recognise the problem and want to make a difference together.
                </p>
                <div className="row-12 mb-32">
                  <button className="btn btn-primary" onClick={toggleInterest}>
                    {interested ? "Following ✓" : "I want to help"} <Heart size={14} />
                  </button>
                  <button className="btn" onClick={toggleSaved}>
                    <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                    {saved ? "Saved" : "Save for later"}
                  </button>
                  <ReportButton entityType="idea" entityId={id} />
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
                  <div className="eyebrow-muted-xs mb-16">Conversation</div>
                  {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="avatar avatar-sm">
                        {comment.authorUserId.slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="comment-meta">
                          <strong className="mono-md">{comment.authorUserId.slice(0, 8)}</strong>
                          <span className="muted-xs">{comment.createdAt ?? ""}</span>
                          {isOwner ? (
                            <button className="btn btn-ghost btn-sm" onClick={() => hideComment(comment.id)}>Hide</button>
                          ) : null}
                        </div>
                        <p className="comment-body">{comment.body}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 ? <p className="muted-md">No comments yet — start the conversation.</p> : null}
                  <FieldError message={commentError} />
                  <div className="row-8 mt-16">
                    <input
                      className="input"
                      style={{ flex: 1 }}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addComment()}
                      placeholder="Add a thoughtful note..."
                      aria-label="Add a comment"
                    />
                    <button className="btn btn-primary" onClick={addComment} aria-label="Send comment">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </TiltCard>
            </AnimateIn>
          </div>

          <div>
            <AnimateIn delay={0.2}>
              <div className="panel panel-spaced-sm">
                <div className="eyebrow-muted-tight mb-12">Created by</div>
                <div className="row-12">
                  <div className="avatar avatar-md">
                    {idea.author.split(" ").map((p) => p[0]).join("")}
                  </div>
                  <div>
                    <div className="mono-lg">{idea.author}</div>
                    <div className="muted-xs">Careful product thinker</div>
                  </div>
                </div>
              </div>

              <div className="panel panel-spaced-sm">
                <div className="eyebrow-muted-tight mb-12">Interest</div>
                <div className="mono-display-accent mb-4">{idea.interestCount}</div>
                <div className="muted-sm">people are following this beginning.</div>
              </div>

              <div className="panel">
                <div className="eyebrow-muted-tight mb-12">Next gentle step</div>
                <div className="mono-xl mb-8">Make a first offer</div>
                <p className="muted-md mb-16">
                  Say what you could explore, make, or learn alongside the person who began it.
                </p>
                <button className="btn btn-primary btn-block" onClick={() => setOfferOpen(true)}>
                  Offer to help <MessageCircle size={14} />
                </button>
                {isOwner ? (
                  <button className="btn btn-block" style={{ marginTop: 8 }} onClick={() => setPromoteOpen(true)}>
                    Promote to Space
                  </button>
                ) : (
                  <button className="btn btn-block" style={{ marginTop: 8 }} onClick={() => router.push("/spaces/create")}>
                    Open a Space <MessageCircle size={14} />
                  </button>
                )}
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>

      {offerOpen ? (
        <Modal title="Offer to help" onClose={() => setOfferOpen(false)}>
          <label>What can you offer? (5+ characters)
            <textarea value={offerText} onChange={(e) => setOfferText(e.target.value)} rows={4} maxLength={1000} style={{ display: "block", width: "100%", marginTop: 8 }} />
          </label>
          <label>Availability (optional)
            <input value={offerAvailability} onChange={(e) => setOfferAvailability(e.target.value)} maxLength={80} style={{ display: "block", width: "100%", marginTop: 8 }} />
          </label>
          <FieldError message={offerError} />
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={submitOffer}>Send offer</button>
        </Modal>
      ) : null}

      {promoteOpen ? (
        <Modal title="Promote to Space" onClose={() => setPromoteOpen(false)}>
          <label>Space name
            <input value={promoteName} onChange={(e) => setPromoteName(e.target.value)} maxLength={140} style={{ display: "block", width: "100%", marginTop: 8 }} />
          </label>
          <label>Summary (10+ characters)
            <textarea value={promoteSummary} onChange={(e) => setPromoteSummary(e.target.value)} rows={3} maxLength={500} style={{ display: "block", width: "100%", marginTop: 8 }} />
          </label>
          <label>Type
            <select value={promoteType} onChange={(e) => setPromoteType(e.target.value as typeof promoteType)} style={{ display: "block", marginTop: 8 }}>
              <option value="startup">startup</option>
              <option value="hackathon">hackathon</option>
              <option value="open_source">open_source</option>
              <option value="client_project">client_project</option>
              <option value="personal">personal</option>
              <option value="experiment">experiment</option>
            </select>
          </label>
          <FieldError message={promoteError} />
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={submitPromote}>Create Space</button>
        </Modal>
      ) : null}
    </>
  );
}
