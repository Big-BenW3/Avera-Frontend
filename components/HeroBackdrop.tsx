"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// WebGL is client-only and heavy; keep it out of the server render and the first JS chunk.
const FaultyTerminal = dynamic(() => import("./FaultyTerminal"), { ssr: false });

/** Tracks the root data-theme attribute so canvas-drawn components follow the toggle. */
export function useIsDark(): boolean | null {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === "dark");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export default function HeroBackdrop() {
  const dark = useIsDark();
  return (
    <div className="hero-backdrop" aria-hidden="true">
      {dark !== null && (
        <FaultyTerminal
          tint={dark ? "#34d399" : "#059669"}
          lightMode={!dark}
          glyphs="characters"
          scale={2.2}
          digitSize={1.25}
          timeScale={0.6}
          brightness={dark ? 0.7 : 0.9}
          glow={dark ? 0.25 : 0}
          persistence={0.25}
          mouseStrength={0.35}
          mouseGlow={0.3}
          curvature={0.1}
          vignette={0.55}
          clickEffect="none"
          flickerAmount={0.25}
          noiseAmp={1.2}
          variation={2}
          dpr={1.25}
        />
      )}
    </div>
  );
}
