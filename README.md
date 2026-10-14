# Avera — Frontend

The Avera collaboration platform web app — a purpose-led home for ideas, collaboration, and launches. Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, and **Vitest**.

This repository is the **standalone frontend** for Avera. It contains no backend credentials or secrets. It talks to the separately deployed [Avera backend](https://github.com/Big-BenW3/Avera-backend) over a REST API with secure cookie credentials.

---

## Tech Stack

| Area | Choice |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| UI | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS via global CSS + design tokens |
| Fonts | Manrope (display) + DM Sans (body), via `next/font/google` |
| Icons | lucide-react |
| Server state | TanStack Query (`@tanstack/react-query`) |
| Tests | Vitest |
| Runtime | Node.js >= 22 |

---

## Getting Started

### Prerequisites

- **Node.js 22+** (see `engines` in `package.json`)
- npm (bundled with Node)

### Install

```bash
npm install
```

### Configure environment

Copy the example environment file and adjust the values:

```bash
cp .env.example .env
```

The only variable the frontend needs today:

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the Avera backend API | `http://localhost:4000` |

> Keep `.env` out of version control — it is gitignored. Only `.env.example` (no secrets) is committed.

### Run

```bash
npm run dev       # start the Next.js dev server (default http://localhost:3000)
```

In production:

```bash
npm run build     # NODE_ENV=production next build
npm start         # next start
```

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the production bundle |
| `npm start` | Start the production server |
| `npm run check` | Type-check with `tsc --noEmit` |
| `npm test` | Run the Vitest test suite |

---

## Project Structure

```text
app/                     Next.js App Router pages (routes)
  layout.tsx             Root layout: fonts, theme, providers
  page.tsx               Landing page
  login|signup|forgot-password/   Auth flows
  onboarding/            Post-signup onboarding
  discover/              Discovery hub (announcements, ideas, spaces)
  ideas/                 Public idea browser + idea detail
  spaces/                Space workspace, detail, and creation
  inbox/                 Notifications / inbox
  profile/               Current user profile
  settings/              Account settings
  not-found.tsx          404 page
components/              Shared UI components
  Animations.tsx         Motion primitives
  AuthCard.tsx           Auth shell card
  Modal.tsx              Accessible modal
  NotificationBell.tsx   Unread-notification bell
  ProductNav.tsx         App navigation
  ReportButton.tsx       Report / safety flow
  Skeleton.tsx           Skeleton loaders
  ThemeToggle.tsx        Light/dark theme switcher
  Toast.tsx              Toast notifications
  WorkspacePreview.tsx   Space preview card
lib/                     Client-side infrastructure
  api.ts                 Typed REST client for the backend gateway
  auth.tsx               Auth provider/session state
  models.ts              Shared API response types
  query.tsx              TanStack Query providers & hooks
```

---

## Frontend ↔ Backend Integration

All browser requests travel through `lib/api.ts`, a typed gateway to the Avera API:

- Base URL comes from `NEXT_PUBLIC_API_BASE_URL` (falls back to `http://localhost:4000`).
- Requests include `credentials: "include"` so secure session cookies from the API are honored.
- Endpoints are grouped: `auth`, `discover`, `ideas`, `spaces`, `planning`, `tasks`, `chat`, `calls`, `ai`, `notifications`, `safety`, `files`, `integrations`, `users`.

See the [`ROUTES.md`](ROUTES.md) for the screen-to-route map and [`DESIGN.md`](DESIGN.md) for the design system.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | No | Backend base URL; defaults to `http://localhost:4000` |

Format rules:

- Client-visible `NEXT_PUBLIC_*` variables are safe to expose to the browser.
- **Never put** database URLs, LiveKit API secrets, NVIDIA keys, storage credentials, or OAuth client secrets in frontend `.env` — those belong only in the backend server environment.

---

## Deployment (Vercel)

The frontend is a standard Next.js 15 App Router app — Vercel deploys it with **zero configuration** (no `vercel.json` needed; the Next.js framework preset is auto-detected, and the Node version comes from the `engines` field: Node 22+).

### Steps

1. Push this repository to GitHub/GitLab/Bitbucket, then import it in Vercel (or use `npx vercel` from `Frontend/`).
2. If you import the parent `Avera` folder as the repo instead of this standalone repository, set **Root Directory** to `Frontend` in the Vercel project settings.
3. Set environment variables on the project (**Production** *and* **Preview**):

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_API_BASE_URL` | Your deployed backend URL, e.g. `https://api.avera.example` |

   > ⚠️ `NEXT_PUBLIC_*` values are **baked in at build time**. If unset, the app falls back to `http://localhost:4000` and every API call will fail in the deployed site. Set it before the first build.
4. On the backend, add your Vercel domain(s) (e.g. `https://<project>.vercel.app` and any custom domain) to the `WEB_ORIGIN` CORS allowlist — auth uses cookie credentials (`credentials: "include"`), so requests from any other origin are blocked.

### Pre-deploy checklist (all verified locally)

```bash
npm install       # dependencies install cleanly from package-lock.json
npm run check     # tsc --noEmit passes
npm test          # vitest passes (no test files yet → exits 0)
npm run build     # next build succeeds: 14 routes (13 static + 1 dynamic /spaces/[slug])
```

---

## License

Private / proprietary — all rights reserved.