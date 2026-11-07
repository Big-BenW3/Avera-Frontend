"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { dur, ease } from "@/lib/motion";

/**
 * Entrance animation. Fade + rise only — no tilt, no rotate, no 3D.
 * Respects prefers-reduced-motion by rendering the content fully visible,
 * instantly, with no motion at all (not just a shorter one).
 */
export function AnimateIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: dur.slow, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
