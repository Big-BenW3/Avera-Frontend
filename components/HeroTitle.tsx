"use client";

import dynamic from "next/dynamic";
import { useIsDark } from "./HeroBackdrop";

const TechText = dynamic(() => import("./TechText"), { ssr: false });

export default function HeroTitle({ text = "Avera" }: { text?: string }) {
  const dark = useIsDark();
  return (
    <div className="hero-title">
      {/* Reserve the height up front so the canvas mounting never shifts the layout. */}
      <div className="hero-title-stage">
        {dark !== null && (
          <TechText
            text={text}
            style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif", color: "var(--ink)" }}
            fontWeight={700}
            fontSize={260}
            letterSpacing={-0.055}
            color="currentColor"
            accentColor={dark ? "#34d399" : "#059669"}
            reveal="letter"
            dashLength={5}
            dashGap={3}
            strokeWidth={1.75}
            specks={15}
            intro="assemble"
            introDuration={1.8}
            labels={false}
            clickKick
            guides={false}
          />
        )}
      </div>
    </div>
  );
}
