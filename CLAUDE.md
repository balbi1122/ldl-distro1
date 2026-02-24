# CLAUDE.md

This file provides guidance to AI assistants working with this codebase.

## Project Overview

This is a **React + TypeScript + Vite** starter application. It provides a clean base with shadcn/ui components, Tailwind CSS theming, and React Router, ready for new features to be built on top.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6 (with `@vitejs/plugin-react-swc` for SWC-based Fast Refresh)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS 3.4 with CSS variables for theming
- **UI Components**: shadcn/ui (New York style, slate base color)
- **Form Handling**: React Hook Form + Zod validation (available, not yet used)
- **Animations**: Framer Motion (available, not yet used)
- **Icons**: Lucide React
- **Database**: Supabase client (`@supabase/supabase-js`) + generated types
- **Dev Tooling**: Tempo DevTools (storyboard/component preview platform)

## Repository Structure

```
ldl-distro1/
├── src/
│   ├── App.tsx                    # Root component; sets up React Router with Tempo integration
│   ├── main.tsx                   # Entry point; initializes TempoDevtools and BrowserRouter
│   ├── index.css                  # Global CSS with Tailwind directives and CSS variable theme tokens
│   ├── vite-env.d.ts              # Vite environment type declarations
│   ├── components/
│   │   ├── home.tsx               # Home page placeholder (replace with actual content)
│   │   └── ui/                    # shadcn/ui primitives (accordion, button, card, form, input, etc.)
│   ├── lib/
│   │   └── utils.ts               # `cn()` helper combining clsx + tailwind-merge
│   ├── types/
│   │   └── supabase.ts            # Auto-generated Supabase TypeScript types
│   └── stories/                   # Storybook-style stories for each shadcn/ui component
├── public/
│   └── vite.svg
├── components.json                # shadcn/ui configuration (style, aliases, Tailwind config path)
├── tailwind.config.js             # Tailwind config with shadcn CSS variable color system
├── vite.config.ts                 # Vite config with Tempo plugin, path alias (@/), allowedHosts
├── tsconfig.json                  # TypeScript config (ES2020, strict: false, @/* path alias)
├── tsconfig.node.json             # TypeScript config for Vite/Node tooling
├── postcss.config.js              # PostCSS with autoprefixer
└── tempo.config.json              # Tempo DevTools configuration
```

## Development Commands

```bash
# Start development server
npm run dev

# Type-check and build for production
npm run build

# Lint TypeScript/TSX files (zero warnings allowed)
npm run lint

# Preview production build
npm run preview

# Regenerate Supabase TypeScript types (requires SUPABASE_PROJECT_ID env var)
npm run types:supabase
```

## Styling Conventions

- **Tailwind CSS** is the primary styling mechanism. Avoid inline styles except for dynamic values.
- **CSS variables** defined in `src/index.css` power the shadcn/ui color system (e.g., `--primary`, `--muted`, `--border`). These are referenced in `tailwind.config.js` via `hsl(var(--...))`.
- **`cn()` utility** (`src/lib/utils.ts`) combines `clsx` and `tailwind-merge` — always use it when conditionally applying Tailwind classes.
- The shadcn/ui **"new-york" style** with **slate** base color is configured in `components.json`.
- Dark mode is configured as `["class"]` in Tailwind (class-based toggling), not currently wired to a toggle.

## Component Conventions

- All components are **React functional components** with TypeScript interfaces for props.
- Props have **explicit default values** in destructuring (not `defaultProps`).
- Use **default exports** for page-level components and **named exports** for UI primitives.
- The `@/` path alias maps to `src/` — use it for all internal imports (e.g., `@/components/ui/button`).

## shadcn/ui Components

All shadcn/ui components live in `src/components/ui/`. To add new components:

```bash
npx shadcn-ui@latest add <component-name>
```

Do not manually modify files in `src/components/ui/` unless patching a bug — they are managed by the shadcn CLI.

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_TEMPO` | Enables Tempo DevTools route rendering when `"true"` |
| `VITE_BASE_PATH` | Base URL path for non-development deployments |
| `SUPABASE_PROJECT_ID` | Used by `npm run types:supabase` to regenerate `src/types/supabase.ts` |

## Tempo DevTools

This project integrates [Tempo](https://www.tempobook.com/) for visual component development. The Tempo plugin is loaded in `vite.config.ts` and initialized in `main.tsx`. Stories for all shadcn/ui components exist in `src/stories/`. The `src/tempobook/` directory (excluded from TypeScript compilation) contains Tempo-generated assets and is gitignored for dynamic/storyboard content.

## TypeScript Notes

TypeScript strict mode is **off** (`"strict": false` in `tsconfig.json`). Type safety is partial; do not rely on the compiler catching all type errors.
