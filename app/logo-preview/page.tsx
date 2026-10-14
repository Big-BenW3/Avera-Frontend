import Link from "next/link";

const LOGOS = [
  {
    file: "/logos/logo-1-hearth.svg",
    name: "Hearth",
    tagline: "The A as a shelter roof — a home for ideas.",
    meaning: "Warm, grounded, protective. Reads as home first, mark second.",
  },
  {
    file: "/logos/logo-2-knot.svg",
    name: "Knot",
    tagline: "Two arcs meeting at a shared node.",
    meaning: "Connection and collaboration — people joining around an idea.",
  },
  {
    file: "/logos/logo-3-ascent.svg",
    name: "Ascent",
    tagline: "A grounded A with an orbiting spark above it.",
    meaning: "Launch and momentum — an idea taking flight.",
  },
];

export default function LogoPreviewPage() {
  return (
    <main className="logo-preview">
      <header className="logo-preview-head">
        <Link href="/" className="btn btn-ghost btn-sm">
          ← Back to Avera
        </Link>
        <div>
          <div className="eyebrow">Brand</div>
          <h1 className="logo-preview-title">Three marks for Avera.</h1>
          <p className="dashboard-subtitle">
            Pick the one that feels most like the product. Each is built on the warm studio palette.
          </p>
        </div>
      </header>

      <div className="logo-preview-grid">
        {LOGOS.map((logo) => (
          <section key={logo.name} className="logo-preview-card">
            <div className="logo-preview-stage">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.file} alt={`Avera — ${logo.name} logo`} width={96} height={96} />
            </div>
            <div className="logo-preview-body">
              <h2 className="panel-title">{logo.name}</h2>
              <p className="compose-label" style={{ marginTop: 4 }}>
                {logo.tagline}
              </p>
              <p className="mono-xs mt-8" style={{ color: "var(--dust)" }}>
                {logo.meaning}
              </p>
            </div>
          </section>
        ))}
      </div>

      <section className="logo-preview-usage">
        <h2 className="panel-title">In context</h2>
        <div className="logo-preview-usage-grid">
          <div className="logo-preview-appbar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGOS[1].file} alt="Avera" width={28} height={28} />
            <span className="logo-preview-word">avera</span>
          </div>
          <div className="logo-preview-appbar" style={{ background: "var(--canvas-warm)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGOS[0].file} alt="Avera" width={28} height={28} />
            <span className="logo-preview-word">
              avera<span style={{ color: "var(--terracotta)" }}>.</span>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
