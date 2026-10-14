"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { Bell } from "lucide-react";
import { api } from "../lib/api";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({ queryKey: ["notifications", "unread"], queryFn: () => api.notifications.list(true) });
  const unread = data?.items?.length ?? 0;
  return (
    <div style={{ position: "relative" }}>
      <button className="bell-btn" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} onClick={() => setOpen((v) => !v)}>
        <Bell size={18} />
        {unread > 0 ? <span className="bell-dot">{unread > 9 ? "9+" : unread}</span> : null}
      </button>
      {open ? (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 320, background: "var(--surface, #fff)", border: "1px solid #eee", borderRadius: 12, padding: 12, zIndex: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Notifications</strong>
            <button onClick={() => api.notifications.markAll().then(() => setOpen(false))}>Mark all read</button>
          </div>
          {(data?.items ?? []).slice(0, 8).map((n) => (
            <div key={n.id} style={{ padding: "8px 0", borderTop: "1px solid #f0f0f0", fontSize: 13 }}>
              <span>{n.kind}</span>
            </div>
          ))}
          {(data?.items ?? []).length === 0 ? <p style={{ fontSize: 13 }}>You are all caught up.</p> : null}
          <Link href="/inbox" onClick={() => setOpen(false)}>Open inbox</Link>
        </div>
      ) : null}
    </div>
  );
}
