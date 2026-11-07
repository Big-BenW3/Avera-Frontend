"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
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

/**
 * Keeps the cached session in step with sign-in and sign-out. Without this the
 * "me" query keeps its first (signed-out) answer, so the nav shows a stale user.
 */
export function useSession() {
  const queryClient = useQueryClient();
  const signedIn = useCallback(
    (user: ApiUser) => queryClient.setQueryData(["me"], { user }),
    [queryClient],
  );
  const signedOut = useCallback(() => {
    // Drop everything that belonged to the previous user, then mark the session empty.
    queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== "me" });
    queryClient.setQueryData(["me"], { user: null });
  }, [queryClient]);
  return { signedIn, signedOut };
}

/** Redirects to /login (remembering where the visitor was headed) when there is no session. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useMe();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, user, router, pathname]);
  if (loading || !user)
    return (
      <div className="route-loading" role="status" aria-live="polite">
        <span className="route-loading-bar" aria-hidden="true" />
        {loading ? "Loading Avera…" : "Redirecting to sign in…"}
      </div>
    );
  return <>{children}</>;
}

/**
 * For /login, /signup and /forgot-password: send people who arrive already signed in
 * to the app. It only reacts to the session that existed on arrival, so signing in
 * on the page itself never races the page's own redirect (e.g. signup → onboarding).
 */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useMe();
  const router = useRouter();
  const arrivedSignedIn = useRef<boolean | null>(null);
  useEffect(() => {
    if (loading || arrivedSignedIn.current !== null) return;
    arrivedSignedIn.current = !!user;
    if (user) router.replace("/discover");
  }, [loading, user, router]);
  return <>{children}</>;
}

export function isAuthError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}
