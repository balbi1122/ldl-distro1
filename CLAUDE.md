# CLAUDE.md

This file provides guidance to AI assistants working with this codebase.

## Project Overview

This is a **Hard Money Mortgage Loan Application** web application built for **Mortgage Funding Partners**. It presents a multi-step loan application form that collects applicant personal information, property details, and loan requirements, then submits data to Notion and sends notification emails via SendGrid.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6 (with `@vitejs/plugin-react-swc` for SWC-based Fast Refresh)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS 3.4 with CSS variables for theming
- **UI Components**: shadcn/ui (New York style, slate base color)
- **Form Handling**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend Integrations**: Notion API (`@notionhq/client`), SendGrid (`@sendgrid/mail`)
- **Database Types**: Supabase (types generated, client available)
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
│   │   ├── home.tsx               # Page layout: header, hero, LoanApplicationWidget, contact, footer
│   │   ├── LoanApplicationWidget.tsx  # Core multi-step form orchestrator (main business logic)
│   │   ├── ApplicationReview.tsx  # Step 4: summary view with edit links before final submit
│   │   ├── NavigationControls.tsx # Previous/Next/Submit buttons with keyboard navigation
│   │   ├── ProgressIndicator.tsx  # Visual step tracker (circles + connecting lines)
│   │   ├── ThankYouPage.tsx       # Post-submission confirmation page; clears localStorage
│   │   ├── forms/
│   │   │   ├── PersonalInformationForm.tsx  # Step 1: name, contact, address, credit, income
│   │   │   ├── PropertyDetailsForm.tsx      # Step 2: property address, type, value, specs
│   │   │   └── LoanRequirementsForm.tsx     # Step 3: loan amount, purpose, term, exit strategy
│   │   └── ui/                    # shadcn/ui primitives (accordion, button, card, form, input, etc.)
│   ├── services/
│   │   ├── NotionService.ts       # Notion API client: submitApplication, getApplication, updateApplicationStatus
│   │   └── EmailService.ts        # SendGrid email client: sends confirmation to applicant + notification to loan officers
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

# Build without failing on type errors (same as build currently)
npm run build-no-errors

# Lint TypeScript/TSX files (zero warnings allowed)
npm run lint

# Preview production build
npm run preview

# Regenerate Supabase TypeScript types (requires SUPABASE_PROJECT_ID env var)
npm run types:supabase
```

## Application Flow

The multi-step form in `LoanApplicationWidget.tsx` progresses through 5 states:

| Step (index) | Component | Description |
|---|---|---|
| 0 | `PersonalInformationForm` | Name, contact info, address, credit score, annual income |
| 1 | `PropertyDetailsForm` | Property address, type, value, purchase price, year built, sq ft |
| 2 | `LoanRequirementsForm` | Loan amount, purpose, term, exit strategy, timeframe |
| 3 | `ApplicationReview` | Read-only summary with "Edit" buttons for each section |
| 4 | `ThankYouPage` | Confirmation with application ID; clears localStorage |

### Form State Persistence

Form data is auto-saved to `localStorage` under key `loanApplicationProgress` on every change. On initial render, data is restored if it is less than 24 hours old. The `ThankYouPage` clears this key on mount.

### Submission Flow

On final submit (`handleSubmitApplication` in `LoanApplicationWidget.tsx`):
1. Services are dynamically imported (`NotionService`, `EmailService`)
2. Application is submitted to Notion via `notionService.submitApplication()`
3. If Notion succeeds, emails are sent via `emailService.sendApplicationEmails()`:
   - Confirmation email to the applicant
   - Notification email to loan officers (`david@balbi.ai`, `lucadbalbi@gmail.com`, `sal@growthandexit.com.au`)
4. The `onApplicationSubmit` callback prop is called
5. UI advances to `ThankYouPage`

## Environment Variables

Services read credentials from Vite environment variables (prefix `VITE_` is **not** used for these — they are accessed via `import.meta.env` directly):

| Variable | Used In | Purpose |
|---|---|---|
| `NOTION_API_KEY` | `NotionService` | Notion integration token |
| `NOTION_DATABASE_ID` | `NotionService`, `LoanApplicationWidget` | Target Notion database |
| `SENDGRID_API_KEY` | `EmailService` | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | `EmailService` | Sender email address |
| `SENDGRID_APPLICANT_TEMPLATE_ID` | `EmailService` | Optional SendGrid dynamic template for applicant email |
| `SENDGRID_OFFICER_TEMPLATE_ID` | `EmailService` | Optional SendGrid dynamic template for loan officer email |
| `VITE_TEMPO` | `App.tsx` | Enables Tempo DevTools route rendering when `"true"` |
| `VITE_BASE_PATH` | `vite.config.ts` | Base URL path for non-development deployments |
| `SUPABASE_PROJECT_ID` | npm script only | Used to regenerate `src/types/supabase.ts` |

**Note**: When `NOTION_API_KEY` or `SENDGRID_API_KEY` are absent or set to their placeholder strings (`"NOTION_API_KEY"` / `"SENDGRID_API_KEY"`), both services simulate API calls with `setTimeout` delays and log to console. The application still completes the submission flow successfully in development.

## Styling Conventions

- **Tailwind CSS** is the primary styling mechanism. Avoid inline styles except for dynamic values (e.g., `primaryColor` prop passed to widget header).
- **CSS variables** defined in `src/index.css` power the shadcn/ui color system (e.g., `--primary`, `--muted`, `--border`). These are referenced in `tailwind.config.js` via `hsl(var(--...))`.
- **`cn()` utility** (`src/lib/utils.ts`) combines `clsx` and `tailwind-merge` — always use it when conditionally applying Tailwind classes.
- The shadcn/ui **"new-york" style** with **slate** base color is configured in `components.json`.
- Dark mode is configured as `["class"]` in Tailwind (class-based toggling), but no dark mode toggle is currently implemented.

## Component Conventions

- All components are **React functional components** with TypeScript interfaces for props.
- Props have **explicit default values** in destructuring (not `defaultProps`).
- Components use **named exports** for forms/UI primitives and **default exports** for page-level and widget components.
- The `@/` path alias maps to `src/` — use it for imports from within the project (e.g., `@/components/ui/button`).
- **Zod schemas** are defined at the top of `LoanApplicationWidget.tsx` and validated per-step before advancing.

## shadcn/ui Components

All shadcn/ui components live in `src/components/ui/`. To add new components:

```bash
npx shadcn-ui@latest add <component-name>
```

Do not manually modify files in `src/components/ui/` unless patching a bug — they are managed by the shadcn CLI.

## Tempo DevTools

This project integrates [Tempo](https://www.tempobook.com/) for visual component development. The Tempo plugin is loaded in `vite.config.ts` and initialized in `main.tsx`. Stories for all shadcn/ui components exist in `src/stories/`. The `src/tempobook/` directory (excluded from TypeScript compilation) contains Tempo-generated assets and is gitignored for dynamic/storyboard content.

## Key Implementation Notes

1. **`NotionService` constructor signature mismatch**: The class constructor accepts `(apiKey, databaseId)` but `LoanApplicationWidget` instantiates it as `new NotionService(databaseId)` — passing only one argument. The API key is always read from `import.meta.env.NOTION_API_KEY`. If integrating Notion fully, verify this constructor call.

2. **Form validation is step-gated**: Zod schemas are parsed in `validateCurrentStep()`. Errors surface as a list in an `Alert` component above the form. Navigation to a later step is blocked until the current step validates.

3. **Step back navigation is unrestricted**: Users can always go back to a previous step without re-validation. Clicking a step in `ProgressIndicator` is only allowed for already-completed steps.

4. **Keyboard navigation**: `NavigationControls` supports arrow keys (Left/Right) for step navigation and Enter to submit, but only when focus is not inside an input/textarea/select.

5. **Application ID generation**: `LN-${Date.now().toString().slice(-6)}` — generated twice (once during submission, once when rendering `ThankYouPage`). These will differ; consolidate if consistency matters.

6. **TypeScript strict mode is off** (`"strict": false` in `tsconfig.json`). Type safety is partial; do not rely on compiler catching all type errors.
