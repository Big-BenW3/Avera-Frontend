"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { api, ApiError } from "./api";
import type { ApiUser } from "./models";

const AuthContext = createContext<{ user: ApiUser | null; loading: boolean }>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.auth.me(),
    retry: false,
  });
  return (
    <AuthContext.Provider value={{ user: data?.user ?? null, loading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useMe() {
  return useContext(AuthContext);
}

/** Redirect to /login when no session (ignores 401s while loading). */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useMe();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);
  if (loading) return <p style={{ padding: 24 }}>Loading Avera…</p>;
  if (!user) return null;
  return <>{children}</>;
}

export function isAuthError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}
