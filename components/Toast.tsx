"use client";
import { useEffect, useState } from "react";

type Toast = { id: number; message: string; kind: "ok" | "error" };

let push: ((message: string, kind?: Toast["kind"]) => void) | null = null;

export function toast(message: string, kind: Toast["kind"] = "ok") {
  push?.(message, kind);
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    let id = 0;
    push = (message, kind = "ok") => {
      const toastId = ++id;
      setItems((prev) => [...prev.slice(-2), { id: toastId, message, kind }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== toastId)), 3200);
    };
    return () => {
      push = null;
    };
  }, []);
  return (
    <div className="toaster" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
