# CLAUDE.md

This file documents the codebase structure, development workflows, and conventions for AI assistants working in this repository.

## Project Overview

**Stories For A Showgirl** — a Taylor Swift fan community web application where Swifties can submit and browse creative works (poems, stories, videos) inspired by Taylor Swift's music and eras. An admin dashboard allows moderators to approve, reject, or delete submissions.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.2 + TypeScript 5.8 |
| Build tool | Vite 6.2 with SWC (Fast Refresh) |
| Styling | Tailwind CSS 3.4 (utility-first, HSL CSS variables) |
| UI components | shadcn/ui (Radix UI primitives, New York style) |
| Routing | React Router DOM 6.23 |
| Forms | React Hook Form + Zod validation |
| Icons | Lucide React |
| Animation | Framer Motion |
| Backend | Supabase (PostgreSQL + auth) |
| Email | SendGrid (`@sendgrid/mail`) |
| Dev tooling | Tempo Devtools (component explorer, enabled via `VITE_TEMPO=true`) |

## Directory Structure

```
src/
├── App.tsx                    # Root router — 3 routes: /, /submit, /admin
├── main.tsx                   # React entry point, BrowserRouter, Tempo init
├── index.css                  # Global Tailwind CSS imports and CSS variables
├── components/
│   ├── home.tsx               # Landing page (hero, eras grid, membership plans)
│   ├── SubmitPage.tsx         # Multi-step content submission form
│   ├── AdminPage.tsx          # Admin dashboard (approve/reject/delete)
│   ├── ui/                    # 52 pre-built shadcn/ui components (do not edit manually)
│   └── forms/                 # Legacy loan application forms (unused, kept for reference)
├── services/
│   ├── ContentService.ts      # Supabase CRUD for submissions (primary data layer)
│   ├── EmailService.ts        # SendGrid email notifications (not yet wired to submit flow)
│   └── NotionService.ts       # Notion API integration (legacy/unused)
├── lib/
│   └── utils.ts               # cn() utility: clsx + tailwind-merge for class merging
├── types/                     # TypeScript type definitions
└── stories/                   # 102 Tempo/Storybook component story files
public/
└── _redirects                 # Netlify SPA routing (all paths → index.html)
```

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173
npm run build        # TypeScript check + Vite production build (outputs to dist/)
npm run lint         # ESLint on .ts/.tsx — zero warnings enforced
npm run preview      # Preview production build locally
npm run types:supabase  # Regenerate src/types/supabase.ts from live Supabase schema
```

## Routes

| Path | Component | Purpose |
|---|---|---|
| `/` | `home.tsx` | Public landing page |
| `/submit` | `SubmitPage.tsx` | Content submission form |
| `/admin` | `AdminPage.tsx` | Admin moderation dashboard |

Tempo devtools routes are dynamically loaded when `VITE_TEMPO=true`.

## Environment Variables

Create a `.env` file at the project root (never commit it):

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_TEMPO=true          # Optional: enable Tempo devtools
SUPABASE_PROJECT_ID=...  # Only needed for npm run types:supabase
```

`ContentService` throws a clear error at runtime if Supabase env vars are missing.

## Data Model

The core Supabase table is `public.submissions`:

```sql
id            uuid  primary key
title         text  not null
content_type  text  check (in 'poem','story','video')
era           text  not null
body          text  (for poem/story)
video_url     text  (for video submissions)
ai_assisted   boolean
ai_details    text
is_original   boolean  not null
no_copyright  boolean  not null
accepts_terms boolean  not null
status        text  check (in 'pending','approved','rejected')  default 'pending'
author_name   text
author_email  text
author_id     uuid  references auth.users(id)
created_at    timestamptz  default now()
reviewed_at   timestamptz
reviewed_by   uuid  references auth.users(id)
```

Row Level Security (RLS) is enabled. See `ContentService.ts` header for the full SQL setup script.

## Key Services

### ContentService (`src/services/ContentService.ts`)
The primary data layer. Singleton exported as `contentService`. Methods:
- `submit(input)` — insert new submission, returns `{ success, id?, error? }`
- `getAll()` — fetch all submissions (admin; needs service role or permissive RLS)
- `getApproved(filters?)` — fetch approved submissions (public browse)
- `updateStatus(id, status)` — approve or reject (admin)
- `delete(id)` — hard delete (admin)

**Note:** `AdminPage.tsx` currently uses hardcoded mock data. Wire it to `contentService.getAll()` to activate the real backend.

### EmailService (`src/services/EmailService.ts`)
SendGrid integration. Not yet connected to the submission flow. Intended to send confirmation emails after successful submission.

### NotionService (`src/services/NotionService.ts`)
Legacy Notion API integration carried over from the previous loan-application version of this project. Not used by the current fan community feature set.

## Code Conventions

### TypeScript
- `strict: false` in `tsconfig.json` — permissive, rapid-development mode
- Path alias `@/` maps to `src/` (use in all imports, e.g. `import { cn } from "@/lib/utils"`)
- Target: ES2020, JSX mode: `react-jsx`

### Naming
- Components and types: PascalCase
- Variables, functions, props: camelCase
- Files: PascalCase for components, camelCase for services/utilities

### Styling
- Tailwind utility classes only — no CSS modules, no CSS-in-JS
- Custom theme colors are HSL CSS variables defined in `src/index.css` and referenced in `tailwind.config.js`
- Dark mode is class-based (`dark:` variants)
- Use `cn()` from `@/lib/utils` for conditional/merged class names

### Components
- All functional components with React hooks
- UI primitives live in `src/components/ui/` — these are generated shadcn/ui components. Add new ones via `npx shadcn-ui@latest add <component>`, do not hand-edit them unless fixing a bug
- Page-level components live directly in `src/components/`

### Forms
- React Hook Form + Zod schemas for all user input
- Validation errors surface via the `<FormMessage>` shadcn component

## Important Notes for AI Assistants

1. **No test suite.** There are no Jest, Vitest, or any other test files. Do not add test infrastructure unless explicitly requested.

2. **Legacy code present.** `src/components/forms/` (loan forms) and `src/services/NotionService.ts` / `EmailService.ts` are carry-overs from a previous project iteration. Do not delete them without confirmation; do not treat them as part of the active feature set.

3. **AdminPage uses mock data.** `AdminPage.tsx` contains hardcoded mock submissions. The `ContentService` is fully built and ready — connecting them is a known pending task.

4. **No CI/CD pipeline.** Deployment target is Netlify (via `public/_redirects`). There are no GitHub Actions workflows.

5. **Build is `tsc ; vite build`.** The semicolon means TypeScript errors do not block the Vite build. Prefer `npm run build` for normal use; it will still report TS errors to stdout.

6. **Linting is strict.** `npm run lint` enforces zero warnings. Fix all lint issues before committing.

7. **Tempo devtools.** The `src/stories/` directory contains 102 component stories for the Tempo visual explorer. These are analogous to Storybook stories. Only relevant when `VITE_TEMPO=true`.

## Git Workflow

- Active development branch: `claude/add-claude-documentation-BLkNs`
- Main branch: `main`
- Commit style: imperative, descriptive ("Add file upload option to submission form")
- No PR template or branch protection rules currently configured
