"use client";
import { useState } from "react";
import { api, ApiError } from "../lib/api";
import { Modal, FieldError } from "./Modal";
import { toast } from "./Toast";

const REASONS = ["spam", "harassment", "impersonation", "other"] as const;

export function ReportButton({ entityType, entityId, label = "Report" }: { entityType: "idea" | "space" | "profile" | "comment"; entityId: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<(typeof REASONS)[number]>("spam");
  const [context, setContext] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await api.safety.report({ entityType, entityId, reason, context: context || undefined });
      setDone(true);
      toast("Report sent. Moderators will review it.");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not file this report.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button onClick={() => { setOpen(true); setDone(false); }}>{label}</button>
      {open ? (
        <Modal title={`Report ${entityType}`} onClose={() => setOpen(false)}>
          {done ? (
            <p>Thanks — our moderators will review this.</p>
          ) : (
            <>
              <label>Reason
                <select value={reason} onChange={(e) => setReason(e.target.value as typeof reason)} style={{ display: "block", margin: "8px 0", width: "100%" }}>
                  {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <label>Context (optional)
                <textarea value={context} onChange={(e) => setContext(e.target.value)} maxLength={3000} rows={3} style={{ display: "block", width: "100%", marginTop: 8 }} />
              </label>
              <FieldError message={error} />
              <button onClick={submit} disabled={busy} style={{ marginTop: 12 }}>{busy ? "Sending…" : "Send report"}</button>
            </>
          )}
        </Modal>
      ) : null}
    </>
  );
}
