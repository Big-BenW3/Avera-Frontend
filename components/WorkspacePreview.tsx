import { type ReactNode } from "react";

type TokenColor = "green" | "purple" | "peach" | "blue" | "muted";

function Token({ color, width }: { color: TokenColor; width: string }) {
  return <span className={`mock-token mock-token--${color}`} style={{ width }} />;
}

function SideItem({
  color,
  width,
  active = false,
  indent = false,
}: {
  color: string;
  width: string;
  active?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className={[
        "side-item",
        active ? "side-item--active" : "",
        indent ? "side-item--indent" : "",
      ].join(" ")}
    >
      <span className={`side-icon side-icon--${color}`} />
      <span className="side-line" style={{ width }} />
    </div>
  );
}

function MockCodeLine({
  n,
  indent = 0,
  cursor = false,
  children,
}: {
  n: number;
  indent?: number;
  cursor?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="mock-code-line">
      <span className="mock-ln">{n}</span>
      <div className="mock-row" style={{ paddingLeft: indent }}>
        {children}
        {cursor ? <span className="mock-cursor" aria-hidden /> : null}
      </div>
    </div>
  );
}

export default function WorkspacePreview() {
  return (
    <div
      className="workspace-window"
      role="img"
      aria-label="Preview of an Avera Space: a project file-tree sidebar and a mock editor with syntax-highlighted blocks."
    >
      <div className="window-bar">
        <div className="window-dots" aria-hidden>
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="window-title">Pulse API — Space</span>
        <div className="window-dots window-dots--ghost" aria-hidden>
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
      </div>

      <div className="workspace-body">
        <aside className="workspace-side">
          <div className="side-head">
            <div className="side-crumbs">
              <span className="side-pill">avera</span>
              <span className="side-pill side-pill--on">Pulse API</span>
            </div>
            <div className="side-search">
              <span className="side-search-icon" aria-hidden />
              <span className="side-search-line" aria-hidden />
            </div>
          </div>

          <div className="side-group">
            <div className="side-group-label">Explorer</div>
            <div className="side-items">
              <SideItem color="green" width="84%" active />
              <SideItem color="purple" width="66%" indent />
              <SideItem color="muted" width="54%" indent />
              <SideItem color="blue" width="72%" />
              <SideItem color="muted" width="62%" />
            </div>
          </div>

          <div className="side-group">
            <div className="side-group-label">Timeline</div>
            <div className="side-items">
              <SideItem color="peach" width="58%" />
              <SideItem color="muted" width="46%" />
              <SideItem color="blue" width="64%" />
            </div>
          </div>

          <div className="side-group">
            <div className="side-group-label">Ship</div>
            <div className="side-items">
              <SideItem color="green" width="52%" />
              <SideItem color="muted" width="40%" />
            </div>
          </div>

          <div className="side-running" aria-hidden>
            <span className="status-dot status-dot--pulse" />
            <span className="side-running-label">deploy · healthy</span>
          </div>
        </aside>

        <div className="editor-panel">
          <div className="editor-tabs">
            <span className="editor-tab editor-tab--active">
              <span className="editor-tab-dot" aria-hidden />
              ship.ts
            </span>
            <span className="editor-tab">space.ts</span>
            <span className="editor-tab">deploy.ts</span>
            <span className="editor-tab">README.md</span>
          </div>

          <div className="mock-code" aria-hidden>
            <MockCodeLine n={1}>
              <Token color="purple" width="30%" />
              <Token color="blue" width="52%" />
            </MockCodeLine>
            <MockCodeLine n={2} />
            <MockCodeLine n={3}>
              <Token color="green" width="26%" />
              <Token color="peach" width="28%" />
              <Token color="purple" width="22%" />
            </MockCodeLine>
            <MockCodeLine n={4} indent={26}>
              <Token color="blue" width="38%" />
              <Token color="green" width="34%" />
            </MockCodeLine>
            <MockCodeLine n={5} indent={26}>
              <Token color="blue" width="30%" />
              <Token color="green" width="30%" />
              <Token color="blue" width="24%" />
            </MockCodeLine>
            <MockCodeLine n={6} indent={26}>
              <Token color="blue" width="34%" />
              <Token color="peach" width="52%" />
            </MockCodeLine>
            <MockCodeLine n={7} indent={14}>
              <Token color="purple" width="16%" />
            </MockCodeLine>
            <MockCodeLine n={8}>
              <Token color="blue" width="12%" />
            </MockCodeLine>
            <MockCodeLine n={9} />
            <MockCodeLine n={10}>
              <Token color="peach" width="34%" />
              <Token color="purple" width="40%" />
            </MockCodeLine>
            <MockCodeLine n={11} indent={26}>
              <Token color="blue" width="36%" />
              <Token color="green" width="44%" />
            </MockCodeLine>
            <MockCodeLine n={12} indent={26}>
              <Token color="green" width="26%" />
              <Token color="blue" width="30%" />
              <Token color="peach" width="22%" />
            </MockCodeLine>
            <MockCodeLine n={13} indent={14}>
              <Token color="purple" width="20%" />
            </MockCodeLine>
            <MockCodeLine n={14} />
            <MockCodeLine n={15}>
              <Token color="purple" width="44%" />
              <Token color="blue" width="36%" />
            </MockCodeLine>
            <MockCodeLine n={16} indent={26}>
              <Token color="muted" width="62%" />
            </MockCodeLine>
            <MockCodeLine n={17} cursor>
              <Token color="muted" width="30%" />
              <Token color="blue" width="40%" />
            </MockCodeLine>
          </div>

          <div className="editor-terminal">
            <div className="terminal-head">
              <span className="terminal-caret" aria-hidden />
              <span className="terminal-label">Terminal</span>
            </div>
            <div className="terminal-lines" aria-hidden>
              <div className="terminal-line">
                <span className="terminal-prompt">$</span>
                <Token color="green" width="24%" />
                <Token color="muted" width="18%" />
              </div>
              <div className="terminal-line">
                <span className="terminal-prompt terminal-prompt--ok">✓</span>
                <Token color="blue" width="34%" />
                <Token color="green" width="14%" />
              </div>
            </div>
          </div>

          <div className="editor-status">
            <div className="editor-status-left">
              <span className="status-dot" aria-hidden />
              main
            </div>
            <div className="editor-status-right">
              <span>tsx</span>
              <span aria-hidden>·</span>
              <span>Ln 17, Col 3</span>
              <span aria-hidden>·</span>
              <span>UTF-8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}