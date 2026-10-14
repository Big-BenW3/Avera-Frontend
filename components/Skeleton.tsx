type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
};

export function Skeleton({ className = "", style, width, height }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, ...style }}
      aria-hidden
    />
  );
}

export function SkeletonLine({ width = "100%", height = 12 }: { width?: string | number; height?: string | number }) {
  return <Skeleton className="skeleton-line" width={width} height={height} />;
}

export function SkeletonCard() {
  return (
    <div className="panel skeleton-card" aria-hidden>
      <Skeleton className="skeleton-pill" style={{ marginBottom: 16 }} />
      <SkeletonLine width="80%" />
      <SkeletonLine width="60%" />
      <div style={{ height: 16 }} />
      <SkeletonLine width="40%" />
    </div>
  );
}

export function SkeletonIdeaCard() {
  return (
    <div className="panel skeleton-card" aria-hidden>
      <SkeletonLine width="30%" height={10} />
      <div style={{ height: 12 }} />
      <SkeletonLine width="85%" height={16} />
      <div style={{ height: 8 }} />
      <SkeletonLine width="60%" height={16} />
      <div style={{ height: 16 }} />
      <SkeletonLine width="100%" />
      <div style={{ height: 6 }} />
      <SkeletonLine width="90%" />
    </div>
  );
}

export function SkeletonSpaceCard() {
  return (
    <div className="idea-card" aria-hidden>
      <SkeletonLine width="30%" height={10} />
      <div style={{ height: 12 }} />
      <SkeletonLine width="70%" height={16} />
      <div style={{ height: 8 }} />
      <SkeletonLine width="90%" />
      <div style={{ height: 6 }} />
      <SkeletonLine width="80%" />
    </div>
  );
}

export function SkeletonPanel() {
  return (
    <div className="panel" aria-hidden>
      <div className="panel-header">
        <SkeletonLine width="30%" height={14} />
        <SkeletonLine width="20%" height={14} />
      </div>
      <div className="ideas-grid">
        <SkeletonIdeaCard />
        <SkeletonIdeaCard />
        <SkeletonIdeaCard />
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="profile-layout" aria-hidden>
      <div className="profile-header">
        <Skeleton width={80} height={80} />
        <div style={{ flex: 1 }}>
          <SkeletonLine width="40%" height={28} />
          <div style={{ height: 8 }} />
          <SkeletonLine width="30%" />
        </div>
      </div>
      <SkeletonLine width="100%" height={16} />
      <div style={{ height: 8 }} />
      <SkeletonLine width="90%" />
      <div style={{ height: 32 }} />
      <div className="profile-tile-grid-3">
        <Skeleton height={120} />
        <Skeleton height={120} />
        <Skeleton height={120} />
      </div>
      <div className="profile-tile-grid-2">
        <Skeleton height={140} />
        <Skeleton height={140} />
      </div>
    </div>
  );
}
