"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LayoutDashboard, Layers, ClipboardList, Braces, Palette, MessageCircle, Users, Activity,
  Plus, Check, Code2, StickyNote,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { ApiRoadmapItem, ApiSpaceMember, Space, Task } from "@/lib/models";
import { toSpace, toTask } from "@/lib/models";
import { AnimateIn, TiltCard } from "@/components/Animations";
import { ProductNav } from "@/components/ProductNav";
import { EmptyState, FieldError, Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";

const navItems = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={14} /> },
  { id: "roadmap", label: "Roadmap", icon: <Layers size={14} /> },
  { id: "tasks", label: "Tasks", icon: <ClipboardList size={14} /> },
  { id: "planning", label: "Planning", icon: <StickyNote size={14} /> },
  { id: "build", label: "Build", icon: <Braces size={14} /> },
  { id: "design", label: "Design", icon: <Palette size={14} /> },
  { id: "collaborate", label: "Collaborate", icon: <MessageCircle size={14} /> },
  { id: "team", label: "Team", icon: <Users size={14} /> },
  { id: "activity", label: "Activity", icon: <Activity size={14} /> },
];

export default function SpaceWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [space, setSpace] = useState<Space | null>(null);
  const [members, setMembers] = useState<ApiSpaceMember[]>([]);
  const [section, setSection] = useState("overview");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.allSettled([
      api.spaces.detail(slug),
      api.tasks.list(slug).catch(() => ({ items: [] })),
    ]).then(([d, t]) => {
      if (cancelled) return;
      if (d.status === "fulfilled") {
        setSpace(toSpace(d.value.space, d.value.members?.length ?? 0));
        setMembers(d.value.members ?? []);
      } else {
        const status = d.reason instanceof ApiError ? d.reason.status : 0;
        if (status === 403) setDenied(true);
        else setNotFound(true);
      }
      if (t.status === "fulfilled") setTasks((t.value.items ?? []).map(toTask));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function addTask(title = "A new useful step") {
    try {
      const { task } = await api.tasks.create(slug, { title, area: "Product", priority: "medium" });
      setTasks([toTask(task), ...tasks]);
    } catch {}
  }

  async function moveTask(task: Task, status: Task["status"]) {
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status } : t)));
    try {
      const serverStatus = status === "doing" ? "in_progress" : (status as "todo" | "done");
      await api.tasks.update(task.id, { status: serverStatus });
    } catch {}
  }

  if (loading) {
    return (
      <>
        <ProductNav />
        <div className="dashboard">
          <div className="not-found" style={{ minHeight: "60vh" }}>
            <div className="mono-display muted-text">Loading space…</div>
          </div>
        </div>
      </>
    );
  }

  if (denied) {
    return (
      <>
        <ProductNav />
        <div className="dashboard">
          <div className="not-found" style={{ minHeight: "60vh" }}>
            <div>
              <div className="not-found-code">403</div>
              <h1 className="not-found-title">This Space is private.</h1>
              <p className="not-found-body">Ask a member for an invite, or request to join from Discover.</p>
              <button className="btn btn-primary btn-large" onClick={() => router.push("/discover")}>Back to discover</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (notFound || !space) {
    return (
      <>
        <ProductNav />
        <div className="dashboard">
          <AnimateIn>
            <div className="not-found" style={{ minHeight: "60vh" }}>
              <div>
                <div className="not-found-code">404</div>
                <h1 className="not-found-title">This Space does not exist.</h1>
                <p className="not-found-body">The link you followed may be old, or the Space was taken down. Return to discover to find what is live.</p>
                <button className="btn btn-primary btn-large" onClick={() => router.push("/discover")}>
                  Back to discover
                </button>
              </div>
            </div>
          </AnimateIn>
        </div>
      </>
    );
  }

  return (
    <>
      <ProductNav />

      <div className="workspace-layout">
        <aside className="workspace-sidebar">
          <div className="workspace-sidebar-title">{space.name}</div>
          <nav className="workspace-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`workspace-nav-item ${section === item.id ? "active" : ""}`}
                onClick={() => setSection(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="workspace-content">
          <AnimateIn>
            <div className="workspace-header">
              <div className="status-chips">
                <span className="status-chip status-chip-orange">{space.category}</span>
                <span className="status-chip status-chip-green"><span className="pulse-dot" />{space.status === "open" ? "Open for collaborators" : "Building"}</span>
                <span className="status-chip">{members.length} members</span>
              </div>
              <h1 className="mono-title mb-8">{space.name}</h1>
              <p className="muted-sm">{space.purpose}</p>
            </div>
          </AnimateIn>

          {section === "overview" && <Overview slug={slug} space={space} tasks={tasks} addTask={() => addTask()} />}
          {section === "roadmap" && <Roadmap slug={slug} />}
          {section === "tasks" && <Tasks slug={slug} tasks={tasks} setTasks={setTasks} addTask={() => addTask()} moveTask={moveTask} />}
          {section === "planning" && <Planning slug={slug} />}
          {section === "build" && <Build slug={slug} />}
          {section === "design" && <Design slug={slug} />}
          {section === "collaborate" && <Collaborate slug={slug} />}
          {section === "team" && <Team slug={slug} members={members} />}
          {section === "activity" && <ActivityFeed slug={slug} />}
        </main>
      </div>
    </>
  );
}

function Overview({ slug, space, tasks, addTask }: { slug: string; space: Space; tasks: Task[]; addTask: () => void }) {
  const [stats, setStats] = useState<{ total: number; done: number } | null>(null);
  useEffect(() => {
    api.spaces.overview(slug).then((o) => setStats(o.taskStats)).catch(() => {});
  }, [slug]);
  const done = stats?.done ?? tasks.filter((t) => t.status === "done").length;
  const total = stats?.total ?? tasks.length;
  return (
    <div className="workspace-overview-grid">
      <div>
        <AnimateIn delay={0.1}>
          <div className="panel panel-spaced-sm">
            <div className="eyebrow-muted-tight mb-12">Why this exists</div>
            <h2 className="mono-xl mb-12">{space.purpose}</h2>
            <p className="muted-body mb-16">
              We are making a first version that helps someone feel understood, supported, and able to take the next small step.
            </p>
            <div className="avatar-row">
              {["MC", "NI", "AS", "+2"].map((initials, i) => (
                <div key={i} className="avatar avatar-sm">{initials}</div>
              ))}
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">What is moving</div>
            </div>
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="row-divider">
                <div
                  className="bullet-border"
                  style={task.status === "done" ? { color: "var(--accent)" } : undefined}
                >
                  {task.status === "done" ? <Check size={12} /> : (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        background: task.status === "doing" ? "var(--accent)" : "var(--border)",
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="mono-md">{task.title}</div>
                  <div className="muted-xs">{task.assignee} · {task.due}</div>
                </div>
              </div>
            ))}
            {tasks.length === 0 ? <EmptyState title="No tasks yet" hint="Add the first useful step." /> : null}
          </div>
        </AnimateIn>
      </div>

      <div>
        <AnimateIn delay={0.3}>
          <div className="panel panel-spaced-sm">
            <div className="workspace-metrics-grid">
              <div className="metrics-tile">
                <div className="metrics-tile-value">{total ? Math.round((done / Math.max(1, total)) * 100) : space.progress}%</div>
                <div className="metrics-tile-label">Progress</div>
              </div>
              <div className="metrics-tile">
                <div className="metrics-tile-value">{space.memberCount}</div>
                <div className="metrics-tile-label">Members</div>
              </div>
              <div className="metrics-tile">
                <div className="metrics-tile-value">{tasks.filter((t) => t.status === "todo").length}</div>
                <div className="metrics-tile-label">To do</div>
              </div>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.4}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Up next</div>
              <button className="btn btn-ghost btn-sm" onClick={addTask}><Plus size={12} /> Add</button>
            </div>
            {(tasks.length ? tasks.slice(0, 3).map((t) => t.title) : ["Listen to five people", "Shape the first ritual", "Share a small prototype"]).map((text, i) => (
              <div key={i} className="row-divider">
                <div className="bullet" />
                <div style={{ flex: 1 }}>
                  <div className="mono-md">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}

function Roadmap({ slug }: { slug: string }) {
  const [items, setItems] = useState<ApiRoadmapItem[]>([]);
  const [title, setTitle] = useState("");
  const [horizon, setHorizon] = useState<"now" | "next" | "later">("now");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api.planning.roadmap(slug).then(({ items }) => setItems(items)).catch(() => {});
  }, [slug]);
  async function add() {
    if (title.trim().length < 2) {
      setError("Milestones need 2+ characters.");
      return;
    }
    setError(null);
    try {
      const { item } = await api.planning.addRoadmapItem(slug, { horizon, title: title.trim() });
      setItems([...items, item]);
      setTitle("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not add this milestone.");
    }
  }
  return (
    <AnimateIn>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Roadmap</div>
        </div>
        {items.map((m, i) => (
          <div key={m.id} className="row-divider-lg">
            <div className="bullet-border mono-xs">{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div className="mono-xl">{m.title}</div>
              <div className="muted-sm">{m.horizon}{m.description ? ` · ${m.description}` : ""}</div>
            </div>
          </div>
        ))}
        {items.length === 0 ? <EmptyState title="No milestones yet" hint="Chart the horizons: now, next, later." /> : null}
        <FieldError message={error} />
        <div className="row-8 mt-16">
          <select value={horizon} onChange={(e) => setHorizon(e.target.value as typeof horizon)}>
            <option value="now">now</option>
            <option value="next">next</option>
            <option value="later">later</option>
          </select>
          <input className="input" style={{ flex: 1 }} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add milestone…" aria-label="Add milestone" />
          <button className="btn btn-primary" onClick={add}><Plus size={12} /> Add</button>
        </div>
      </div>
    </AnimateIn>
  );
}

function Tasks({ slug, tasks, setTasks, addTask, moveTask }: { slug: string; tasks: Task[]; setTasks: (t: Task[]) => void; addTask: () => void; moveTask: (t: Task, s: Task["status"]) => void }) {
  const [selected, setSelected] = useState<Task | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Array<{ id: string; body: string }>>([]);
  useEffect(() => {
    if (!selected) return;
    api.tasks.get(selected.id).then(({ comments }) => setComments(comments)).catch(() => setComments([]));
  }, [selected]);
  const groups: [Task["status"], string][] = [["todo", "To hold"], ["doing", "In the room"], ["done", "Made real"]];
  return (
    <AnimateIn>
      <div className="workspace-tasks-header">
        <div>
          <div className="eyebrow-muted-tight mb-8">Tasks with a reason</div>
          <h2 className="mono-title">Make the next step clear.</h2>
        </div>
        <button className="btn btn-primary" onClick={addTask}>
          <Plus size={14} /> Add task
        </button>
      </div>
      <div className="workspace-tasks-grid">
        {groups.map(([status, label]) => (
          <div key={status}>
            <div className="workspace-tasks-column-label">{label}</div>
            {tasks.filter((t) => t.status === status).map((task) => (
              <div key={task.id} className="panel workspace-task-card" onClick={() => setSelected(task)} style={{ cursor: "pointer" }}>
                <div className="mono-xs accent mb-8">{task.label}</div>
                <div className="mono-md mb-8">{task.title}</div>
                <div className="muted-xs">{task.assignee} · {task.due}</div>
                <div className="row-8 mt-16">
                  {status !== "todo" ? <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); moveTask(task, status === "doing" ? "todo" : "doing"); }}>←</button> : null}
                  {status !== "done" ? <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); moveTask(task, status === "todo" ? "doing" : "done"); }}>→</button> : null}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {selected ? (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <div className="muted-sm mb-16">{selected.label} · {selected.status}</div>
          {comments.map((c) => <p key={c.id} className="comment-body">{c.body}</p>)}
          <div className="row-8 mt-16">
            <input className="input" style={{ flex: 1 }} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment on this task…" aria-label="Comment on task" />
            <button className="btn btn-primary" onClick={() => {
              if (!comment.trim()) return;
              api.tasks.comment(selected.id, comment.trim()).then(({ comment: c }) => {
                setComments([...comments, c]);
                setComment("");
              }).catch(() => {});
            }}>Send</button>
          </div>
        </Modal>
      ) : null}
    </AnimateIn>
  );
}

function Planning({ slug }: { slug: string }) {
  const [notes, setNotes] = useState<Array<{ id: string; title: string; body: string; color: string }>>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [color, setColor] = useState<"yellow" | "blue" | "red" | "green">("yellow");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api.planning.notes(slug).then(({ items }) => setNotes(items)).catch(() => {});
  }, [slug]);
  async function add() {
    if (title.trim().length < 2) {
      setError("Notes need a 2+ character title.");
      return;
    }
    setError(null);
    try {
      const { note } = await api.planning.createNote(slug, { title: title.trim(), body: body.trim() || " ", color });
      setNotes([note, ...notes]);
      setTitle("");
      setBody("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not add this note.");
    }
  }
  async function promote(noteId: string) {
    try {
      await api.planning.promoteNote(slug, noteId);
      setNotes(notes.filter((n) => n.id !== noteId));
      toast("Note promoted to a task.");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not promote this note.");
    }
  }
  return (
    <AnimateIn>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Planning notes</div>
        </div>
        {notes.map((n) => (
          <div key={n.id} className="row-divider">
            <div className="bullet" style={n.color !== "yellow" ? { background: n.color === "green" ? "var(--success)" : n.color === "red" ? "var(--danger)" : "var(--accent)" } : undefined} />
            <div style={{ flex: 1 }}>
              <div className="mono-md">{n.title}</div>
              <div className="muted-sm">{n.body}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => promote(n.id)}>Promote to task</button>
          </div>
        ))}
        {notes.length === 0 ? <EmptyState title="No notes yet" hint="Capture raw thinking, then promote the best into tasks." /> : null}
        <FieldError message={error} />
        <div className="stack stack-8 mt-16">
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title…" aria-label="Note title" />
          <textarea className="input input-textarea" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Details…" aria-label="Note body" rows={2} />
          <div className="row-8">
            <select value={color} onChange={(e) => setColor(e.target.value as typeof color)} aria-label="Note color">
              <option value="yellow">yellow</option>
              <option value="blue">blue</option>
              <option value="red">red</option>
              <option value="green">green</option>
            </select>
            <button className="btn btn-primary" onClick={add}><Plus size={12} /> Add note</button>
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}

function Build({ slug }: { slug: string }) {  const [items, setItems] = useState<unknown[]>([]);
  useEffect(() => {
    api.integrations.list(slug).then(({ items }) => setItems(items)).catch(() => {});
  }, [slug]);
  return (
    <AnimateIn>
      <div className="workspace-build-grid">
        <div className="panel">
          <div className="eyebrow-muted-tight mb-12">Builder&apos;s corner</div>
          <h2 className="mono-xl mb-12">Make the invisible work easier to see.</h2>
          <p className="muted-body mb-16">
            Connect a repository when the team is ready. {items.length ? `${items.length} integration(s) connected.` : "No integrations connected yet."}
          </p>
          <button className="btn">
            Connect GitHub <Code2 size={14} />
          </button>
        </div>
        <div className="panel">
          <div className="eyebrow-muted-tight mb-12">Build pulse</div>
          {["The interaction model has been agreed.", "Prototype environment is being prepared.", "First testable moment is within reach."].map((text, i) => (
            <div key={i} className="row-divider">
              <div className="bullet-border accent">
                <Check size={12} />
              </div>
              <div className="muted-md" style={{ color: "var(--text)" }}>{text}</div>
            </div>
          ))}
        </div>
      </div>
    </AnimateIn>
  );
}

function Design({ slug }: { slug: string }) {
  const [links, setLinks] = useState<Array<{ id: string; url: string; title: string }>>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api.integrations.designLinks(slug).then(({ items }) => setLinks(items)).catch(() => {});
  }, [slug]);
  async function add() {
    if (!url.trim() || !title.trim()) {
      setError("URL and title are required.");
      return;
    }
    setError(null);
    try {
      await api.integrations.addDesignLink(slug, { externalFileId: url.trim(), url: url.trim(), title: title.trim() });
      const { items } = await api.integrations.designLinks(slug);
      setLinks(items);
      setUrl("");
      setTitle("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not link this file.");
    }
  }
  return (
    <AnimateIn>
      <div className="workspace-build-grid">
        <div className="panel">
          <div className="eyebrow-muted-tight mb-12">Design, in context</div>
          <h2 className="mono-xl mb-12">Let the experience feel like the care behind it.</h2>
          <FieldError message={error} />
          <div className="stack stack-8">
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Link title…" aria-label="Figma link title" />
            <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://figma.com/…" aria-label="Figma URL" />
            <button className="btn" onClick={add}>
              Link Figma <Palette size={14} />
            </button>
          </div>
        </div>
        <div className="panel">
          <div className="eyebrow-muted-tight mb-12">Design notes</div>
          {links.map((l) => (
            <div key={l.id} className="row-divider">
              <div className="bullet" />
              <div style={{ flex: 1 }}>
                <div className="mono-md">{l.title}</div>
                <div className="muted-xs">{l.url}</div>
              </div>
            </div>
          ))}
          {links.length === 0 ? <EmptyState title="No Figma links yet" /> : null}
        </div>
      </div>
    </AnimateIn>
  );
}

function Collaborate({ slug }: { slug: string }) {
  const router = useRouter();
  return (
    <AnimateIn>
      <div className="workspace-build-grid">
        <div className="panel">
          <div className="eyebrow-muted-tight mb-12">In the room</div>
          <h2 className="mono-xl mb-12">Bring the whole conversation closer.</h2>
          <p className="muted-body mb-16">
            Messages, calls, and decisions stay alongside the work, so nobody has to reconstruct the why.
          </p>
          <button className="btn btn-primary" onClick={() => router.push(`/inbox?space=${slug}`)}>
            Open collaboration <MessageCircle size={14} />
          </button>
        </div>
        <div className="panel">
          <div className="eyebrow-muted-tight mb-12">Live presence</div>
          <h2 className="mono-xl mb-12">Three people are here now.</h2>
          <div className="avatar-row">
            {["MC", "NI", "AS"].map((initials, i) => (
              <div key={i} className="avatar avatar-sm">{initials}</div>
            ))}
          </div>
        </div>
      </div>
    </AnimateIn>
  );
}

function Team({ slug, members }: { slug: string; members: ApiSpaceMember[] }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function invite() {
    if (!email.trim()) return;
    setError(null);
    setMessage(null);
    try {
      await api.spaces.invite(slug, { email: email.trim() });
      setMessage(`Invite sent to ${email.trim()}.`);
      toast(`Invite sent to ${email.trim()}.`);
      setEmail("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not invite this person.");
    }
  }
  return (
    <AnimateIn>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">People who are showing up ({members.length})</div>
        </div>
        {members.map((m) => (
          <div key={m.userId} className="row-divider">
            <div className="avatar avatar-sm">{m.userId.slice(0, 2).toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <div className="mono-md">{m.userId.slice(0, 8)}</div>
              <div className="muted-sm">{m.status}</div>
            </div>
          </div>
        ))}
        {members.length === 0 ? <EmptyState title="Just you for now" hint="Invites appear here once accepted." /> : null}
        <FieldError message={error} />
        {message ? <p style={{ fontSize: 13 }}>{message}</p> : null}
        <div className="row-8 mt-16">
          <input className="input" style={{ flex: 1 }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Invite by email…" aria-label="Invite by email" />
          <button className="btn btn-primary" onClick={invite}><Plus size={12} /> Invite</button>
        </div>
      </div>
    </AnimateIn>
  );
}

function ActivityFeed({ slug }: { slug: string }) {
  const [items, setItems] = useState<Array<{ id: string; type: string }>>([]);
  useEffect(() => {
    api.activity.list(slug).then((body) => {
      const arr = (body as { items?: Array<{ id: string; type: string }> }).items ?? (body as unknown as Array<{ id: string; type: string }>);
      setItems(Array.isArray(arr) ? arr : []);
    }).catch(() => {});
  }, [slug]);
  return (
    <AnimateIn>
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Activity</div>
          <div className="mono-xs">Latest 100</div>
        </div>
        {items.map((a) => (
          <div key={a.id} className="row-divider">
            <div className="bullet-border accent">
              <Activity size={12} />
            </div>
            <div className="muted-md" style={{ color: "var(--text)" }}>{a.type}</div>
          </div>
        ))}
        {items.length === 0 ? <EmptyState title="Quiet for now" hint="Task, member, and settings events land here." /> : null}
      </div>
    </AnimateIn>
  );
}
