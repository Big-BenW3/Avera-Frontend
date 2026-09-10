"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { ApiUser } from "@/lib/models";
import { AnimateIn, TiltCard } from "@/components/Animations";
import { ProductNav } from "@/components/ProductNav";
import { SkeletonProfile } from "@/components/Skeleton";
import { FieldError } from "@/components/Modal";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [touchedBio, setTouchedBio] = useState(false);
  const [touchedSkills, setTouchedSkills] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.auth
      .me()
      .then(({ user }) => {
        setUser(user);
        setDisplayName(user.displayName);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function save() {
    if (displayName.trim().length < 2) {
      setError("Display name needs 2+ characters.");
      return;
    }
    setError(null);
    try {
      const { user: updated } = await api.auth.updateProfile({
        displayName: displayName.trim(),
        // Only send bio/skills when the user touched them — the /me payload
        // does not include them, so a blank field must not wipe stored values.
        ...(touchedBio ? { bio: bio || null } : {}),
        ...(touchedSkills ? { skills: skills.split(",").map((s) => s.trim()).filter(Boolean) } : {}),
      });
      setUser(updated);
      setEditing(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not save this profile.");
    }
  }

  async function logout() {
    try {
      await api.auth.signOut();
    } catch {}
    router.push("/login");
  }

  if (loading) {
    return (
      <>
        <ProductNav />
        <SkeletonProfile />
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <ProductNav />

      <div className="profile-layout">
        <AnimateIn>
          <div className="profile-header">
            <div className="profile-avatar">{user.displayName.split(" ").map((p) => p[0]).join("")}</div>
            <div>
              <h1 className="profile-name">{user.displayName}</h1>
              <div className="profile-handle">@{user.handle} · {user.email}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setEditing((v) => !v)}>{editing ? "Cancel" : "Edit"}</button>
              <Link href="/settings" className="btn btn-ghost"><Settings size={14} /></Link>
              <button className="btn btn-ghost" onClick={logout} style={{ color: "#b42318" }}>Logout</button>
            </div>
          </div>
        </AnimateIn>

        {editing ? (
          <AnimateIn delay={0.1}>
            <div className="panel" style={{ marginBottom: 24 }}>
              <div className="field">
                <label htmlFor="displayName">Display name</label>
                <input id="displayName" className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="bio">Bio (max 500)</label>
                <textarea id="bio" className="input" value={bio} onChange={(e) => { setBio(e.target.value); setTouchedBio(true); }} maxLength={500} rows={3} placeholder="Leave untouched to keep your current bio" />
              </div>
              <div className="field">
                <label htmlFor="skills">Skills (comma separated)</label>
                <input id="skills" className="input" value={skills} onChange={(e) => { setSkills(e.target.value); setTouchedSkills(true); }} placeholder="Leave untouched to keep your current skills" />
              </div>
              <FieldError message={error} />
              <button className="btn btn-primary" onClick={save}>Save profile</button>
            </div>
          </AnimateIn>
        ) : null}

        <AnimateIn delay={0.1}>
          <div className="mb-32">
            <div className="eyebrow">What I care about</div>
            <p className="muted-intro">
              Making space for the people, rituals, and small systems that help us take better care of one another.
            </p>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="profile-tile-grid-3">
            <TiltCard className="panel" style={{ padding: "20px" }}>
              <div className="mono-xs accent mb-12">Handle</div>
              <div className="mono-xl">@{user.handle}</div>
            </TiltCard>
            <TiltCard className="panel" style={{ padding: "20px" }}>
              <div className="mono-xs accent mb-12">Email</div>
              <div className="mono-xl" style={{ fontSize: 14 }}>{user.email}</div>
            </TiltCard>
            <TiltCard className="panel" style={{ padding: "20px" }}>
              <div className="mono-xs accent mb-12">Member</div>
              <div className="mono-xl">{user.id.slice(0, 8)}</div>
            </TiltCard>
          </div>
        </AnimateIn>
      </div>
    </>
  );
}
