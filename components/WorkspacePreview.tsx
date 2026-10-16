import Image from "next/image";

/**
 * Hero scene — a single composed product moment instead of a scattered collage.
 *
 * The previous version stacked three rotated photos plus a floating card plus
 * two strips of tape. Individually each was fine; together they had no focal
 * point, four competing shadows, and a rotation on every edge so nothing read as
 * a single object.
 *
 * What replaced it: one large photo as the anchor, one real UI card that
 * overlaps it, and a small caption. Two shadows, one accent, one focal point.
 */

const PHOTOS = {
  table:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
  people:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
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
    <div
      className="hero-scene"
      role="img"
      aria-label="An Avera Space called Tidepool, showing progress, collaborators, and the tasks in flight."
    >
      {/* Anchor — one photo, no rotation. This is the only large shadow in the scene. */}
      <div className="hero-photo">
        <Image
          src={PHOTOS.table}
          alt="A warm workshop table with sketches and coffee"
          fill
          sizes="(max-width: 900px) 92vw, 560px"
          priority
        />
        <div className="hero-photo-wash" aria-hidden="true" />
      </div>

      {/* Secondary — smaller, tucks behind the card. Same family of shadow, lighter. */}
      <div className="hero-photo hero-photo--inset">
        <Image
          src={PHOTOS.people}
          alt="Three collaborators leaning over a table"
          fill
          sizes="(max-width: 900px) 40vw, 260px"
        />
      </div>

      {/* The product, actually shown. Overlaps the photo so the two read as one composition. */}
      <div className="hero-card">
        <div className="hero-card-head">
          <div>
            <span className="hero-card-space">Tidepool</span>
            <h3 className="hero-card-title">
              Local climate actions that feel possible
            </h3>
          </div>
          <span className="hero-card-status">
            <span className="hero-card-dot" aria-hidden="true" />
            Live
          </span>
        </div>

        <div className="hero-card-progress">
          <div
            className="hero-card-track"
            role="progressbar"
            aria-valuenow={64}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tasks complete"
          >
            <span className="hero-card-fill" />
          </div>
          <span className="hero-card-count">18 of 28</span>
        </div>

        <ul className="hero-card-tasks">
          <li>
            <span>Neighbourhood map</span>
            <em>In progress</em>
          </li>
          <li>
            <span>Weekly digest</span>
            <em>Friday send</em>
          </li>
        </ul>

        <div className="hero-card-foot">
          <div className="hero-card-people">
            <span>MC</span>
            <span>NI</span>
            <span>AS</span>
            <span className="hero-card-more">+3</span>
          </div>
          <span className="hero-card-note">Six people, one roadmap</span>
        </div>
      </div>

      {/* Quiet caption instead of decorative tape. */}
      <p className="hero-caption">
        <HouseMark className="hero-caption-mark" />
        One idea, from first note to shipped.
      </p>
    </div>
  );
}