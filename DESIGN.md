# Design System: Avera Collaboration Platform

## 1. Visual Theme & Atmosphere
A warm, optimistic collaboration studio — gallery-airy, never clinical. Density 4 (balanced daily-app breathing room), variance 5 (confident Offset Asymmetric marketing surfaces, predictable symmetric app interiors), motion 5 (fluid friendly spring motion that reassures, never performs). The mood is a sunlit architecture studio: pale blue-white air, one confident orange voice, calm green trust signals. Sleek and clean always — chrome recedes, people and work lead.

## 2. Color Palette & Roles
- **Morning Canvas** (#F8F9FF) — Primary app background, page air
- **Pure Surface** (#FFFFFF) — Cards, auth shell, modal fill
- **Mist Fill** (#EFF4FF) — Pill input fill, OAuth button fill, search fill
- **Contour Line** (#D3E4FE) — 1px structural borders, card outlines, dividers
- **Deep Navy Ink** (#0B1C30) — Primary text, headlines, logo wordmark
- **Muted Slate** (#565E74) — Secondary text, descriptions, metadata, placeholders
- **Signal Orange** (#FF6B00) — THE single accent: primary CTAs, active tabs, focus rings, links, logo mark. Saturation ~100% by brand, used sparingly on small surfaces only
- **Trust Green** (#006C49) — Presence, completed, secure, strength-optimal states only
- **Alert Red** (#BA1A1A) — Form errors, destructive actions only
- Banned: pure black (#000000), purple/blue neon, gradients on buttons, second accents

## 3. Typography Rules
- **Display:** Manrope (600–800) — Track-tight headlines, weight-driven hierarchy, controlled scale. Never screaming
- **Body:** DM Sans (400–700) — Relaxed leading (1.6), 65ch max measure, Deep Navy Ink or Muted Slate
- **Mono accents:** Space Mono ONLY for eyebrows, labels, timestamps, metrics — never body or headlines
- **Banned:** Inter, Roboto, Arial, system fonts as primary UI type. Generic serifs (Times, Georgia, Garamond) banned everywhere. Serif banned in dashboards

## 4. Component Stylings
- **Logo:** Rounded-square Signal Orange tile with white wayfinder mark + `Avera` wordmark + orange dot. Always top-center on auth, top-left in app nav
- **Auth shell:** Centered Pure Surface card, 28–32px radius, Contour Line border, soft blue-tinted lift shadow, max-width 520px. Backdrop is Morning Canvas with a soft peach radial glow at top-center. One card per screen — no split layouts on auth
- **Inputs:** Pill (999px) single-line controls, Mist Fill background, no visible border at rest; 16px radius for textareas. Trailing icon adornments (user, mail, eye) in Muted Slate. Label above input (mono 11px uppercase), error text below in Alert Red. Focus: white fill + 2px Signal Orange ring. No floating labels
- **Password fields:** Eye/eye-off revealer button inside the input (44px target). Strength meter: 4 segments below, Trust Green as they fill + status pill (Weak/Okay/Strong/Optimal). Confirm-password field on signup and reset with mismatch error
- **Buttons:** Primary = full Signal Orange pill, white label, soft orange lift; active state translates -1px (tactile push). Secondary = Mist Fill pill or ghost. No neon outer glows. One primary CTA per hero/form. OAuth = three Mist Fill pills (Google/GitHub/Figma) under an "OR CONTINUE WITH" divider — disabled with helper text until backend OAuth exists
- **Cards:** White, 20–24px radius, Contour Line border, soft blue-tinted lift. Used only when elevation serves hierarchy; dense layouts use border-top dividers
- **Chips/status:** Small pills — orange tint for active/in-progress, green tint for live/complete, Mist Fill for neutral metadata
- **Loaders:** Skeletal shimmer matching layout dimensions. No circular spinners
- **Empty states:** Composed guidance (title + what-to-do-next), never bare "No data"
- **Trust row:** Below auth card — lock/shield lucide icons + "SOC2 Type II Certified" and "End-to-end Encrypted" microcopy in Muted Slate

## 5. Layout Principles
- Centered single-column auth flows (card max-width 520px, 24px mobile gutters). App pages: max-width shell, 24px desktop / 16px mobile gutters
- Split/asymmetric marketing surfaces allowed; app interiors stay predictable symmetric. No overlapping elements — every element owns its spatial zone
- Grid-first; all multi-column grids collapse to one column below 768px. Full-height sections use `min-h-[100dvh]`, never `h-screen`
- The generic 3-equal-cards feature row is banned — use asymmetric grids or 2-up rhythm

## 6. Motion & Interaction
- Default easing `cubic-bezier(.16, 1, .3, 1)` (gentle expo-out). Hover = 1–2px transform only
- Friendly entrance: auth card rises 12px + fades in once; fields cascade with 40ms stagger (waterfall reveal, never instant lists)
- Perpetual micro-motion: soft peach glow drifts (12s loop), logo dot pulses gently, primary CTA arrow nudges 2px on hover. Hardware-accelerated transform/opacity only
- `prefers-reduced-motion`: all loops and entrances disabled

## 7. Anti-Patterns (Banned)
No emojis anywhere (lucide icons only). No Inter. No pure black. No neon/outer glows. No gradient buttons or gradient headline text. No custom mouse cursors. No overlapping elements. No 3-column equal card rows. No centered hero when variance exceeds 4. No generic names (John Doe, Acme, Nexus). No fake round stats. No AI copy clichés (Elevate, Seamless, Unleash, Next-Gen). No filler text ("Scroll to explore", scroll arrows, bouncing chevrons). No broken image links (picsum.photos or SVG avatars only). Body text minimum 14px. Touch targets minimum 44px.
