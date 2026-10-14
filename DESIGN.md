# Design System: Avera — Warm Human Studio (rebuilt)

## 1. Visual Theme & Atmosphere
A warm, optimistic collaboration studio — milk-cream air, one ripe persimmon voice, honey + sage + blush support. Density 4 (balanced daily-app breathing room), variance 5 (offset asymmetric marketing surfaces, predictable friendly app interiors), motion 5 (gentle rise + drift, never performative). The mood is a sunlit workshop: real photography, hand-drawn house marks, tape and paper textures. Chrome recedes, people and work lead.

## 2. Color Palette & Roles
- **Milk Canvas** (#FAF5EE) — Primary page background, warm air
- **Paper** (#FFFDF9) — Cards, panels, auth form side
- **Espresso Ink** (#2B2118) — Primary text, headlines, logo wordmark
- **Warm Dust** (#8A7D72) — Secondary text, descriptions, metadata
- **Persimmon** (#E4572E) — THE single voice: primary CTAs, active tabs, focus rings, links, logo mark
- **Deep Persimmon** (#B93A1A) — Hover, emphasis, mural eyebrows
- **Persimmon Wash** (#FDEBD9) — Tints: active chips, kickers, focus rings
- **Honey** (#D9A441) — Secondary warmth: progress bars, tape, highlights
- **Sage** (#5B7E3F) — Trust, live, complete, success states only
- **Blush** (#F6C9B8) — Soft support: avatars, photographic warmth
- Dark theme: lamplit umber (#1D1712 canvas), never cold slate
- Banned: pure black, neon, gradients on buttons, second accent voices

## 3. Typography Rules
- **Display:** Instrument Serif (400) — Warm editorial headlines, tight leading, controlled scale. Italic emphasis in persimmon for one word max
- **Body:** Plus Jakarta Sans (400–700) — Relaxed leading (1.6), 65ch max measure, Espresso Ink or Warm Dust
- **Mono accents:** DM Mono ONLY for eyebrows, labels, timestamps, metrics — never body or headlines
- **Banned:** Inter, Roboto, Arial as primary UI type. Cold grotesques banned everywhere. Serif stays in headlines and quotes — dashboards use it for titles, never for data

## 4. Component Stylings
- **Logo:** Persimmon tile with wayfinder mark + `Avera` serif wordmark + persimmon dot. Top-left on mural auth, top-left in app nav
- **Auth:** Seamless blend — photographic/CSS mural left (dawn wash, sun disc, hills, floating idea cards), form right. A gradient veil dissolves the mural into the milk canvas. NO dividing line, NO card, NO border between the two — one continuous room
- **Photography:** Real Unsplash workshop/studio/portrait photography via `next/image`. Warm, human, slightly imperfect — never stock-smiling. Tape, rotation (±3deg), and paper borders make photos feel pinned, not placed
- **Illustration:** One hand-drawn HouseMark SVG (roof + hearth dot) woven through hero, tape strip, collab notes. Stroke-based, persimmon, slightly rotated — never geometric-perfect
- **Inputs:** 12px radius, warm paper fill, barely-there warm border; label above (mono 11px uppercase), error below in Deep Persimmon. Focus: 3px persimmon-wash ring
- **Buttons:** Primary = persimmon, 14px radius, white label, warm lift shadow; arrow nudges 2px on hover. Secondary = transparent with warm border. No pills, no neon
- **Cards:** Warm paper, 18px radius, warm border, layered warm shadow. Hover = -2 to -4px lift only
- **Landing structure (never centered-SaaS):** offset hero (copy left, photo collage right) → tape strip → photo story → staggered portraits → numbered craft index w/ sticky photo → collab collage + note → photo testimonials → photographic CTA. No 3-equal-anything anywhere
- **Loaders:** Skeletal shimmer in warm tones. No circular spinners
- **Empty states:** Composed guidance (title + what-to-do-next), never bare "No data"

## 5. Layout Principles
- Auth: seamless 1.05fr/1fr blend, mural dissolves into form via gradient veil; mobile collapses to form-only (mural hidden below 768px)
- Landing: offset asymmetric grids (hero 1fr/1.1fr, story 1fr/1fr, craft 0.9fr/1.1fr, collab 1fr/1.1fr); stagger middle portrait +28px; sticky craft photo; all collapse to one column below 768px
- App pages: max-width shell, warm friendly panels, 18px radii, 24px desktop / 16px mobile gutters
- No overlapping elements except intentional collage layering (photos, tape, floating cards — every layer owns its zone)
- Grid-first; full-height sections use `min-h-[100dvh]`, never `h-screen`

## 6. Motion & Interaction
- Default easing `cubic-bezier(.16, 1, .3, 1)` (gentle expo-out). Hover = small lift only
- Friendly entrance: fadeUp 20px + fade, staggered 40–80ms (waterfall reveal, never instant lists)
- Perpetual micro-motion: mural sun drifts (16s), idea cards bob (7s), tape strip slides (28s), Space card floats. Hardware-accelerated transform/opacity only
- `prefers-reduced-motion`: all loops and entrances disabled

## 7. Anti-Patterns (Banned)
No emojis anywhere (lucide icons only). No Inter. No pure black. No neon/outer glows. No gradient buttons or gradient headline text. No custom mouse cursors. No centered SaaS hero. No CSS-only laptop mockups. No blob-circle "collaboration visuals". No 3-equal-card rows. No generic names (John Doe, Acme, Nexus). No fake round stats. No AI copy clichés (Elevate, Seamless, Unleash, Next-Gen). No filler text ("Scroll to explore", scroll arrows, bouncing chevrons). Body text minimum 14px. Touch targets minimum 44px. Photography must be real (Unsplash `images.unsplash.com`, configured in `next.config.ts`) — never broken links, never grey placeholders.
