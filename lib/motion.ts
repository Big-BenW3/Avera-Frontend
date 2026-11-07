// Shared Framer Motion tokens — single source so every animated component
// in the app moves with the same physics. Values mirror the CSS tokens in
// app/globals.css (--ease-out, --dur-fast/base/slow) so JS and CSS motion
// never disagree.

export const spring = {
  snappy: { type: "spring", stiffness: 420, damping: 36, mass: 0.9 } as const, // buttons, pills, taps
  smooth: { type: "spring", stiffness: 260, damping: 30, mass: 1 } as const, // layout/card expand
  gentle: { type: "spring", stiffness: 180, damping: 26, mass: 1 } as const, // large surfaces, modals
  magnetic: { type: "spring", stiffness: 150, damping: 15, mass: 0.6 } as const, // cursor-follow, decorative only
};

// Matches --ease-out / --ease-in-out in globals.css — do not diverge.
export const ease = {
  out: [0.16, 1, 0.3, 1] as const, // entrances, exits
  inOut: [0.65, 0, 0.35, 1] as const, // on-screen movement
};

// Matches --dur-fast/base/slow in globals.css.
export const dur = { fast: 0.09, base: 0.13, slow: 0.26 };

// Container + item variants for staggered entrances (replaces hand-indexed delays).
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.slow, ease: ease.out },
  },
};

// Never animate from scale(0) — nothing in the real world appears from nothing.
export const popIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: dur.base, ease: ease.out } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: dur.fast, ease: ease.out } },
};

// Fast step transition (onboarding stepper, create-space wizard).
export const stepTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: dur.fast, ease: ease.out } },
};
