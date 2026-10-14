import Image from "next/image";

/**
 * Hero scene — a photographic "house of ideas" collage instead of a
 * CSS-only laptop mockup. Layered real photography (workshop table,
 * studio wall, hands sketching) with a floating Avera Space card and a
 * hand-drawn house-mark SVG woven through. Nothing here looks like SaaS.
 */
const PHOTOS = {
  table:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80",
  people:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
  sketch:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
};

export function HouseMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 96" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 52 L60 14 L106 52"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 46 V84 H94 V46"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="64" r="9" fill="currentColor" opacity="0.85" />
      <path
        d="M96 22 q6 -8 14 -6"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function WorkspacePreview() {
  return (
    <div className="hero-scene" role="img" aria-label="A collage of real workshop photography with a floating Avera Space card showing tasks and people.">
      <div className="hero-photo hero-photo--main">
        <Image src={PHOTOS.table} alt="A warm workshop table with sketches and coffee" fill sizes="(max-width: 900px) 100vw, 640px" priority />
      </div>
      <div className="hero-photo hero-photo--top">
        <Image src={PHOTOS.people} alt="Three collaborators leaning over a table, laughing" fill sizes="(max-width: 900px) 40vw, 300px" />
      </div>
      <div className="hero-photo hero-photo--low">
        <Image src={PHOTOS.sketch} alt="Hands sketching a plan on paper" fill sizes="(max-width: 900px) 40vw, 300px" />
      </div>

      <HouseMark className="hero-doodle" />

      <div className="hero-space-card">
        <div className="hero-space-top">
          <span className="hero-space-eyebrow">Tidepool · Building</span>
          <span className="hero-space-live"><span className="pulse-dot" /> Live</span>
        </div>
        <div className="hero-space-title">Local climate actions that feel possible</div>
        <div className="hero-space-row">
          <div className="hero-avatars" aria-hidden="true">
            <span>MC</span><span>NI</span><span>AS</span><span className="more">+3</span>
          </div>
          <div className="hero-space-bar"><span style={{ width: "64%" }} /></div>
        </div>
        <div className="hero-space-tasks">
          <div><b>Neighbourhood map</b><i>In progress</i></div>
          <div><b>Weekly digest</b><i>Friday send</i></div>
        </div>
      </div>

      <div className="hero-tape hero-tape--a" aria-hidden="true" />
      <div className="hero-tape hero-tape--b" aria-hidden="true" />
    </div>
  );
}

