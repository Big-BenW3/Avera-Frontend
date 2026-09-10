/** Shared presentation models keep the Avera interface aligned with durable API resources while allowing graceful offline previews. */

// ---- Display models (existing screens) ----
export type Idea = { id: string; title: string; summary: string; category: string; author: string; interestCount: number; commentCount: number; bookmarked?: boolean; stage: "spark" | "forming" | "building"; };
export type Space = { id: string; slug: string; name: string; purpose: string; category: string; memberCount: number; progress: number; status: "open" | "building" | "shipped"; accent: "violet" | "coral" | "sky" | "gold"; };
export type Task = { id: string; title: string; status: "todo" | "doing" | "done"; assignee?: string; due?: string; label: string; };
export type ChatMessage = { id: string; sender: string; text: string; time: string; own?: boolean; };

// ---- Server wire types (mirror backend zod contracts) ----
export type ApiUser = { id: string; email: string; handle: string; displayName: string };
export type AuthResponse = { user: ApiUser; requiresMfa: boolean; mfaTicket?: string };
export type ApiIdea = {
  id: string; title: string; body: string; category: string; lookingFor?: string | null;
  lifecycle: string; authorUserId: string; interestCount?: number; createdAt?: string;
};
export type ApiIdeaComment = { id: string; ideaId: string; authorUserId: string; body: string; createdAt?: string };
export type ApiOffer = { id: string; ideaId: string; userId: string; offer: string; availability?: string | null };
export type ApiSpace = {
  id: string; slug: string; name: string; summary: string; category: string;
  type: "startup" | "hackathon" | "open_source" | "client_project" | "personal" | "experiment";
  visibility: "public" | "private"; recruiting?: boolean; productStage?: string; maxMembers?: number;
};
export type ApiSpaceMember = { userId: string; roleId: string | null; status: string; joinedAt?: string };
export type ApiTask = {
  id: string; spaceId: string; title: string; description?: string | null;
  area?: string; priority?: "low" | "medium" | "high"; status: "todo" | "in_progress" | "done";
  assigneeUserId?: string | null; dueAt?: string | null; position?: number;
};
export type ApiMessage = { id: string; conversationId: string; authorUserId: string; body: string; createdAt?: string };
export type ApiConversation = { id: string; kind: "space" | "direct"; spaceId?: string | null };
export type ApiCall = { id: string; spaceId: string; title: string; status: string; livekitRoom?: string };
export type ApiAiRun = { id: string; spaceId: string; kind: string; status: string; output?: unknown };
export type ApiNotification = { id: string; kind: string; payload?: unknown; readAt?: string | null; createdAt?: string };
export type ApiActivity = { id: string; spaceId: string; type: string; entityType?: string; entityId?: string; createdAt?: string };
export type ApiPlanningNote = { id: string; spaceId: string; title: string; body: string; color: string };
export type ApiRoadmapItem = { id: string; spaceId: string; horizon: "now" | "next" | "later"; title: string; description?: string | null };
export type Announcement = { id: string; title: string; body?: string; priority?: number };
export type Person = { id: string; handle: string; displayName: string; bio?: string | null; skills?: string[] };

// ---- Mappers: server -> display ----
export function toIdea(item: ApiIdea): Idea {
  return {
    id: item.id,
    title: item.title,
    summary: item.body?.slice(0, 160) ?? "",
    category: item.category,
    author: item.authorUserId?.slice(0, 8) ?? "member",
    interestCount: item.interestCount ?? 0,
    commentCount: 0,
    stage: item.lifecycle === "promoted" ? "building" : item.lifecycle === "team_forming" ? "forming" : "spark",
  };
}

export function toSpace(item: ApiSpace, memberCount = 0): Space {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    purpose: item.summary,
    category: item.category,
    memberCount,
    progress: 0,
    status: "building",
    accent: "violet",
  };
}

export function toTask(item: ApiTask): Task {
  return {
    id: item.id,
    title: item.title,
    status: item.status === "in_progress" ? "doing" : item.status,
    assignee: item.assigneeUserId ?? undefined,
    due: item.dueAt ?? undefined,
    label: item.area ?? "Product",
  };
}

export function toChatMessage(item: ApiMessage, meId?: string): ChatMessage {
  return {
    id: item.id,
    sender: item.authorUserId?.slice(0, 8) ?? "member",
    text: item.body,
    time: item.createdAt ?? "",
    own: meId ? item.authorUserId === meId : false,
  };
}
