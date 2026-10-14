/** Backend gateway for Avera; all browser requests travel to the separately deployed API with secure cookie credentials. */
import type {
  Announcement, ApiActivity, ApiAiRun, ApiCall, ApiConversation, ApiIdea, ApiIdeaComment,
  ApiMessage, ApiNotification, ApiOffer, ApiPlanningNote, ApiRoadmapItem, ApiSpace, ApiSpaceMember,
  ApiTask, ApiUser, AuthResponse, Person,
} from "./models";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (response.status === 204) return null as T;
  const body = (await response.json().catch(() => null)) as T | { error?: { message?: string } } | null;
  if (!response.ok)
    throw new ApiError(response.status, (body as { error?: { message?: string } })?.error?.message ?? "Avera could not complete that request.");
  return body as T;
}

const q = (params: Record<string, string | undefined>) => {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) search.set(k, v);
  const s = search.toString();
  return s ? `?${s}` : "";
};

export const api = {
  baseUrl: API_BASE,
  auth: {
    signUp: (input: { email: string; password: string; displayName: string; handle: string }) =>
      request<AuthResponse>("/api/v1/auth/sign-up", { method: "POST", body: JSON.stringify(input) }),
    signIn: (input: { email: string; password: string }) =>
      request<AuthResponse>("/api/v1/auth/sign-in", { method: "POST", body: JSON.stringify(input) }),
    mfaVerify: (input: { ticket: string; code: string }) =>
      request<AuthResponse>("/api/v1/auth/mfa/verify", { method: "POST", body: JSON.stringify(input) }),
    me: () => request<{ user: ApiUser }>("/api/v1/auth/me"),
    updateProfile: (input: { displayName: string; bio?: string | null; skills?: string[] }) =>
      request<{ user: ApiUser }>("/api/v1/auth/profile", { method: "PATCH", body: JSON.stringify(input) }),
    mfaEnroll: () => request<{ secret: string; otpauthUrl: string }>("/api/v1/auth/mfa/enroll", { method: "POST" }),
    mfaConfirm: (code: string) =>
      request<{ enabled: boolean }>("/api/v1/auth/mfa/confirm", { method: "POST", body: JSON.stringify({ code }) }),
    signOut: () => request<null>("/api/v1/auth/sign-out", { method: "POST" }),
    forgotPassword: (email: string) =>
      request<{ sent: boolean; resetTicket?: string }>("/api/v1/auth/password/forgot", { method: "POST", body: JSON.stringify({ email }) }),
    resetPassword: (input: { ticket: string; password: string }) =>
      request<{ user: ApiUser }>("/api/v1/auth/password/reset", { method: "POST", body: JSON.stringify(input) }),
  },
  discover: {
    announcements: () => request<{ items: Announcement[] }>("/api/v1/discover/announcements"),
    ideas: (category?: string) =>
      request<{ items: ApiIdea[]; bookmarkedIdeaIds: string[] }>(`/api/v1/discover/ideas${q({ category })}`),
    spaces: (topic?: string, type?: string) =>
      request<{ items: ApiSpace[] }>(`/api/v1/discover/spaces${q({ topic, type })}`),
    following: () => request<{ items: ApiSpace[] }>("/api/v1/discover/following"),
    search: (term: string) => request<{ items: Array<{ kind: string; id: string; name: string; detail?: string }> }>(`/api/v1/search${q({ q: term })}`),
  },
  ideas: {
    detail: (ideaId: string) => request<{ idea: ApiIdea; comments: ApiIdeaComment[] }>(`/api/v1/ideas/${ideaId}`),
    create: (input: { title: string; body: string; category: string; lookingFor?: string }) =>
      request<{ idea: ApiIdea }>("/api/v1/ideas", { method: "POST", body: JSON.stringify(input) }),
    bookmark: (ideaId: string) => request<null>(`/api/v1/ideas/${ideaId}/bookmark`, { method: "POST" }),
    unbookmark: (ideaId: string) => request<null>(`/api/v1/ideas/${ideaId}/bookmark`, { method: "DELETE" }),
    interest: (ideaId: string) => request<null>(`/api/v1/ideas/${ideaId}/interest`, { method: "POST" }),
    uninterest: (ideaId: string) => request<null>(`/api/v1/ideas/${ideaId}/interest`, { method: "DELETE" }),
    offer: (ideaId: string, input: { offer: string; availability?: string }) =>
      request<{ offer: ApiOffer }>(`/api/v1/ideas/${ideaId}/offers`, { method: "POST", body: JSON.stringify(input) }),
    offers: (ideaId: string) => request<{ items: ApiOffer[] }>(`/api/v1/ideas/${ideaId}/offers`),
    comment: (ideaId: string, body: string) =>
      request<{ comment: ApiIdeaComment }>(`/api/v1/ideas/${ideaId}/comments`, { method: "POST", body: JSON.stringify({ body }) }),
    hideComment: (ideaId: string, commentId: string) =>
      request<null>(`/api/v1/ideas/${ideaId}/comments/${commentId}/hide`, { method: "POST" }),
    promote: (ideaId: string, input: { name: string; summary: string; type: ApiSpace["type"]; visibility?: "public" | "private" }) =>
      request<{ space: ApiSpace }>(`/api/v1/ideas/${ideaId}/promote`, { method: "POST", body: JSON.stringify(input) }),
  },
  spaces: {
    create: (input: { name: string; summary: string; category: string; type: ApiSpace["type"]; visibility?: "public" | "private"; recruiting?: boolean; productStage?: string; maxMembers?: number }) =>
      request<{ space: ApiSpace }>("/api/v1/spaces", { method: "POST", body: JSON.stringify(input) }),
    detail: (slug: string) =>
      request<{ space: ApiSpace; members: ApiSpaceMember[]; permissions: string[] }>(`/api/v1/spaces/${slug}`),
    overview: (slug: string) =>
      request<{ spaceId: string; taskStats: { total: number; done: number }; latestActivity: ApiActivity[] }>(`/api/v1/spaces/${slug}/overview`),
    updateSettings: (slug: string, input: { summary?: string; visibility?: "public" | "private"; recruiting?: boolean; externalUrl?: string | null; category?: string }) =>
      request<{ space: ApiSpace }>(`/api/v1/spaces/${slug}/settings`, { method: "PATCH", body: JSON.stringify(input) }),
    follow: (slug: string) => request<null>(`/api/v1/spaces/${slug}/follow`, { method: "POST" }),
    unfollow: (slug: string) => request<null>(`/api/v1/spaces/${slug}/follow`, { method: "DELETE" }),
    invite: (slug: string, input: { email: string; roleId?: string | null }) =>
      request<{ invite: { id: string }; acceptanceToken: string }>(`/api/v1/spaces/${slug}/invites`, { method: "POST", body: JSON.stringify(input) }),
    joinRequest: (slug: string, input: { desiredRole?: string; note?: string }) =>
      request(`/api/v1/spaces/${slug}/join-requests`, { method: "POST", body: JSON.stringify(input) }),
    reviewJoin: (slug: string, requestId: string, input: { status: "accepted" | "declined"; roleId?: string | null }) =>
      request(`/api/v1/spaces/${slug}/join-requests/${requestId}`, { method: "PATCH", body: JSON.stringify(input) }),
    ban: (slug: string, userId: string) => request<null>(`/api/v1/spaces/${slug}/bans/${userId}`, { method: "POST" }),
  },
  tasks: {
    list: (slug: string) => request<{ items: ApiTask[] }>(`/api/v1/spaces/${slug}/tasks`),
    create: (slug: string, input: { title: string; description?: string; area?: string; priority?: "low" | "medium" | "high"; assigneeUserId?: string | null; roadmapItemId?: string | null; dueAt?: string | null }) =>
      request<{ task: ApiTask }>(`/api/v1/spaces/${slug}/tasks`, { method: "POST", body: JSON.stringify(input) }),
    get: (taskId: string) => request<{ task: ApiTask; comments: ApiIdeaComment[] }>(`/api/v1/tasks/${taskId}`),
    update: (taskId: string, input: Partial<{ title: string; description: string | null; area: string; priority: "low" | "medium" | "high"; status: "todo" | "in_progress" | "done"; position: number; assigneeUserId: string | null; roadmapItemId: string | null; dueAt: string | null }>) =>
      request<{ task: ApiTask }>(`/api/v1/tasks/${taskId}`, { method: "PATCH", body: JSON.stringify(input) }),
    comment: (taskId: string, body: string) =>
      request<{ comment: ApiIdeaComment }>(`/api/v1/tasks/${taskId}/comments`, { method: "POST", body: JSON.stringify({ body }) }),
  },
  planning: {
    notes: (slug: string) => request<{ items: ApiPlanningNote[] }>(`/api/v1/spaces/${slug}/planning-notes`),
    createNote: (slug: string, input: { title: string; body: string; color?: "yellow" | "blue" | "red" | "green" }) =>
      request<{ note: ApiPlanningNote }>(`/api/v1/spaces/${slug}/planning-notes`, { method: "POST", body: JSON.stringify(input) }),
    promoteNote: (slug: string, noteId: string) =>
      request<{ task: ApiTask }>(`/api/v1/spaces/${slug}/planning-notes/${noteId}/promote`, { method: "POST" }),
    roadmap: (slug: string) => request<{ items: ApiRoadmapItem[] }>(`/api/v1/spaces/${slug}/roadmap-items`),
    addRoadmapItem: (slug: string, input: { horizon: "now" | "next" | "later"; title: string; description?: string; position?: number }) =>
      request<{ item: ApiRoadmapItem }>(`/api/v1/spaces/${slug}/roadmap-items`, { method: "POST", body: JSON.stringify(input) }),
  },
  activity: {
    list: (slug: string) => request<{ items?: ApiActivity[] } & { [k: string]: unknown }>(`/api/v1/spaces/${slug}/activity`),
  },
  chat: {
    history: (slug: string) => request<{ conversationId: string; items: ApiMessage[] }>(`/api/v1/spaces/${slug}/chat`),
    send: (slug: string, body: string, replyToMessageId?: string) =>
      request<{ message: ApiMessage }>(`/api/v1/spaces/${slug}/chat/messages`, { method: "POST", body: JSON.stringify({ body, ...(replyToMessageId ? { replyToMessageId } : {}) }) }),
    dmRequest: (input: { recipientUserId: string; body: string }) =>
      request(`/api/v1/dm/requests`, { method: "POST", body: JSON.stringify(input) }),
    dmRequests: () => request<{ items: Array<{ id: string; senderUserId: string; body: string; status: string }> }>("/api/v1/dm/requests"),
    reviewDm: (requestId: string, status: "accepted" | "declined") =>
      request<{ status: string; conversationId: string | null }>(`/api/v1/dm/requests/${requestId}`, { method: "PATCH", body: JSON.stringify({ status }) }),
    dmConversations: () => request<{ items: ApiConversation[] }>("/api/v1/dm/conversations"),
    messages: (conversationId: string) =>
      request<{ items: ApiMessage[] }>(`/api/v1/conversations/${conversationId}/messages`),
    sendDm: (conversationId: string, body: string) =>
      request<{ message: ApiMessage }>(`/api/v1/conversations/${conversationId}/messages`, { method: "POST", body: JSON.stringify({ body }) }),
    markRead: (messageId: string) => request<null>(`/api/v1/messages/${messageId}/read`, { method: "POST" }),
  },
  calls: {
    list: (slug: string) => request<{ items: ApiCall[] }>(`/api/v1/spaces/${slug}/calls`),
    create: (slug: string, input: { title: string; taskId?: string; startsAt?: string }) =>
      request<{ call: ApiCall }>(`/api/v1/spaces/${slug}/calls`, { method: "POST", body: JSON.stringify(input) }),
    join: (callId: string) => request<{ room: string; serverUrl: string; token: string }>(`/api/v1/calls/${callId}/join`, { method: "POST" }),
    end: (callId: string) => request<null>(`/api/v1/calls/${callId}/end`, { method: "POST" }),
  },
  ai: {
    settings: (slug: string) => request<{ settings: { enabledSources: string[]; chatExcluded: boolean } }>(`/api/v1/spaces/${slug}/ai/settings`),
    updateSettings: (slug: string, input: { enabledSources: string[]; chatExcluded: true }) =>
      request(`/api/v1/spaces/${slug}/ai/settings`, { method: "PUT", body: JSON.stringify(input) }),
    run: (slug: string, input: { kind: "planning_interview" | "proposal" | "summary" | "task_breakdown" | "memory_question"; prompt: string; sourceIds?: string[] }) =>
      request<{ run: ApiAiRun }>(`/api/v1/spaces/${slug}/ai/runs`, { method: "POST", body: JSON.stringify(input) }),
    runs: (slug: string) => request<{ items: ApiAiRun[] }>(`/api/v1/spaces/${slug}/ai/runs`),
    runDetail: (runId: string) => request<{ run: ApiAiRun; citations: unknown[] }>(`/api/v1/ai/runs/${runId}`),
  },
  notifications: {
    list: (unread?: boolean) =>
      request<{ items: ApiNotification[] }>(`/api/v1/notifications${q({ unread: unread ? "true" : undefined })}`),
    markRead: (notificationId: string) => request<null>(`/api/v1/notifications/${notificationId}/read`, { method: "POST" }),
    markAll: () => request<null>("/api/v1/notifications/read-all", { method: "POST" }),
  },
  safety: {
    report: (input: { entityType: "idea" | "space" | "profile" | "comment"; entityId: string; reason: "spam" | "harassment" | "impersonation" | "other"; context?: string }) =>
      request("/api/v1/reports", { method: "POST", body: JSON.stringify(input) }),
  },
  files: {
    uploadUrl: (slug: string, input: { fileName: string; contentType: string; byteSize: number; entityType: "task" | "planning_note" | "design_link" | "space"; entityId: string }) =>
      request<{ file: { id: string }; uploadUrl: string }>(`/api/v1/spaces/${slug}/files/upload-url`, { method: "POST", body: JSON.stringify(input) }),
    downloadUrl: (fileId: string) => request<{ downloadUrl: string }>(`/api/v1/files/${fileId}/download-url`),
  },
  integrations: {
    list: (slug: string) => request<{ items: unknown[] }>(`/api/v1/spaces/${slug}/integrations`),
    designLinks: (slug: string) => request<{ items: Array<{ id: string; url: string; title: string }> }>(`/api/v1/spaces/${slug}/design-links`),
    addDesignLink: (slug: string, input: { externalFileId: string; url: string; title: string }) =>
      request(`/api/v1/spaces/${slug}/design-links`, { method: "POST", body: JSON.stringify(input) }),
  },
  users: {
    directory: (term?: string) => request<{ items: Person[] }>(`/api/v1/people${q({ q: term })}`),
    person: (handle: string) => request<{ person: Person }>(`/api/v1/people/${handle}`),
    block: (userId: string) => request<null>(`/api/v1/me/blocks/${userId}`, { method: "POST" }),
    unblock: (userId: string) => request<null>(`/api/v1/me/blocks/${userId}`, { method: "DELETE" }),
  },
};
