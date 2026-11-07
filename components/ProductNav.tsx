"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useMe, useSession } from "@/lib/auth";
import { spring } from "@/lib/motion";
import { NotificationBell } from "./NotificationBell";
import { AveraLogo } from "./AuthCard";

const tabs = [
  { href: "/discover", label: "Discover" },
  { href: "/ideas", label: "Ideas" },
  { href: "/inbox", label: "Inbox" },
];

export function ProductNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useMe();
  const { signedOut } = useSession();

  async function logout() {
    try {
      await api.auth.signOut();
    } catch {}
    signedOut();
    router.push("/login");
  }

  return (
    <nav className="product-nav">
      <Link href="/discover" className="product-nav-logo">
        <AveraLogo size={16} />
      </Link>
      <div className="product-nav-tabs">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`product-nav-tab${active ? " active" : ""}`}
            >
              {active ? (
                <motion.span layoutId="nav-pill" className="nav-pill" transition={spring.snappy} />
              ) : null}
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div className="product-nav-actions">
        {user ? <NotificationBell /> : null}
        <Link href="/spaces/create" className="btn btn-sm">
          <Plus size={14} /> Space
        </Link>
        <Link href="/profile" className="btn btn-ghost btn-sm">
          {user ? user.displayName : "Profile"}
        </Link>
        {user ? (
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
}
