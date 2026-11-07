import { Terminal, GitBranch, CheckCircle2 } from "lucide-react";

export function TechMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" width={16} height={16}>
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Keep HouseMark alias for backward compatibility
export const HouseMark = TechMark;

export default function WorkspacePreview() {
  return (
    <div className="dev-console" role="region" aria-label="Avera Engineering Workspace Console">
      {/* Console Top Chrome */}
      <div className="dev-console-header">
        <div className="dev-console-dots">
          <span className="dot dot-red" />
          <span className="dot dot-amber" />
          <span className="dot dot-emerald" />
        </div>
        <div className="dev-console-title">
          <Terminal size={12} className="dev-console-icon" />
          <span>avera-workspace / hyperdrive-engine</span>
        </div>
        <div className="dev-console-meta">
          <span className="dev-badge dev-badge-git">
            <GitBranch size={11} /> main: 8f4a19c
          </span>
          <span className="dev-badge dev-badge-ci">
            <CheckCircle2 size={11} /> CI Passing
          </span>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="dev-console-body">
        {/* Left Sub-nav */}
        <aside className="dev-console-sidebar">
          <div className="dev-sidebar-item active">
            <span>Sprint Board</span>
            <span className="dev-pill">12</span>
          </div>
          <div className="dev-sidebar-item">
            <span>Roadmap (v1.4)</span>
            <span className="dev-pill">88%</span>
          </div>
          <div className="dev-sidebar-item">
            <span>RFCs & Specs</span>
            <span className="dev-pill">4</span>
          </div>
          <div className="dev-sidebar-item">
            <span>LiveKit Call</span>
            <span className="dev-dot-live" />
          </div>
          <div className="dev-sidebar-item">
            <span>Git / PRs</span>
            <span className="dev-pill">3 open</span>
          </div>
        </aside>

        {/* Right Active Sprint View */}
        <main className="dev-console-main">
          {/* Metrics bar */}
          <div className="dev-metrics-bar">
            <div className="dev-metric">
              <span className="dev-metric-label">SPRINT VELOCITY</span>
              <span className="dev-metric-val">48 pts <span className="dev-metric-delta">+14%</span></span>
            </div>
            <div className="dev-metric">
              <span className="dev-metric-label">ACTIVE PRs</span>
              <span className="dev-metric-val">3 <span className="dev-metric-sub">Review ready</span></span>
            </div>
            <div className="dev-metric">
              <span className="dev-metric-label">RELEASE TARGET</span>
              <span className="dev-metric-val">v1.4.0-rc2</span>
            </div>
          </div>

          {/* Kanban / Tasks Column Preview */}
          <div className="dev-task-list">
            <div className="dev-task-item dev-task-done">
              <div className="dev-task-status"><CheckCircle2 size={13} /></div>
              <div className="dev-task-info">
                <div className="dev-task-title">AVR-108: Argon2id session layer & TOTP MFA</div>
                <div className="dev-task-meta">Core Auth · Merged in PR #42</div>
              </div>
              <span className="dev-task-tag">MERGED</span>
            </div>

            <div className="dev-task-item dev-task-active">
              <div className="dev-task-status"><span className="pulse-dot" /></div>
              <div className="dev-task-info">
                <div className="dev-task-title">AVR-114: Raft consensus log compaction & replication</div>
                <div className="dev-task-meta">Distributed Systems · Assignee: @alex</div>
              </div>
              <span className="dev-task-tag tag-progress">IN REVIEW</span>
            </div>

            <div className="dev-task-item">
              <div className="dev-task-status"><span className="todo-dot" /></div>
              <div className="dev-task-info">
                <div className="dev-task-title">AVR-119: OpenAPI v3 client codegen & typed contract</div>
                <div className="dev-task-meta">API Gateway · Priority: P1</div>
              </div>
              <span className="dev-task-tag tag-todo">BACKLOG</span>
            </div>
          </div>

          {/* Mini Terminal Trace Output */}
          <div className="dev-terminal-line">
            <span className="dev-prompt">$</span>
            <span className="dev-cmd">avera run ai:spec --target=consensus-engine</span>
            <span className="dev-output">✓ Generated 4 schema migrations, 6 tasks assigned</span>
          </div>
        </main>
      </div>
    </div>
  );
}
