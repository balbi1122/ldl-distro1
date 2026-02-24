# CLAUDE.md

This file provides guidance for AI assistants working in this codebase.

## Project Overview

This is a **Hard Money Mortgage Loan Application** web platform. It presents a multi-step loan application form that collects applicant personal information, property details, and loan requirements, then submits the data to a Notion database and triggers confirmation emails via SendGrid.

The app is built as a single-page React application with a widget-based architecture that can be embedded or used standalone.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build tool | Vite 6 with SWC plugin |
| Styling | Tailwind CSS 3.4 + CSS variables for theming |
| UI components | Shadcn UI (New York style) + Radix UI primitives |
| Forms | React Hook Form 7 + Zod 3 schema validation |
| Routing | React Router 6 |
| Animations | Framer Motion 11 |
| Backend integration | Notion API (`@notionhq/client`), SendGrid (`@sendgrid/mail`) |
| Database types | Supabase (`@supabase/supabase-js`) |
| Dev tooling | Tempo Devtools (component storybook environment) |

## Repository Structure

```
src/
├── App.tsx                          # Root component, React Router setup + Tempo route integration
├── main.tsx                         # React entry point
├── index.css                        # Global Tailwind CSS with CSS variable theme definitions
├── vite-env.d.ts                    # Vite environment type declarations
│
├── components/
│   ├── LoanApplicationWidget.tsx    # Main orchestrator: multi-step form, state, submission logic
│   ├── ApplicationReview.tsx        # Step 4: read-only review of all collected data
│   ├── NavigationControls.tsx       # Prev/Next/Submit buttons with keyboard support
│   ├── ProgressIndicator.tsx        # Step progress bar with completion markers
│   ├── ThankYouPage.tsx             # Confirmation page shown after successful submission
│   ├── home.tsx                     # Landing page that renders LoanApplicationWidget
│   │
│   ├── forms/
│   │   ├── PersonalInformationForm.tsx   # Step 1 form
│   │   ├── PropertyDetailsForm.tsx       # Step 2 form
│   │   └── LoanRequirementsForm.tsx      # Step 3 form
│   │
│   └── ui/                          # 43 Shadcn UI base components (do not modify manually)
│
├── services/
│   ├── EmailService.ts              # SendGrid email integration (applicant + loan officer)
│   └── NotionService.ts             # Notion database CRUD for applications
│
├── lib/
│   └── utils.ts                     # `cn()` helper: merges Tailwind class names
│
├── types/
│   └── supabase.ts                  # Auto-generated Supabase TypeScript types
│
└── stories/                         # Tempo/Storybook component stories (39 files)
```

## Development Commands

```bash
npm run dev              # Start Vite dev server with HMR
npm run build            # TypeScript check (non-blocking) + Vite production build
npm run build-no-errors  # Same as build
npm run lint             # ESLint with strict mode (0 warnings allowed)
npm run preview          # Serve the production build locally
npm run types:supabase   # Regenerate Supabase types (requires SUPABASE_PROJECT_ID)
```

> **Note:** `tsc ; vite build` uses `;` (not `&&`), so TypeScript errors do not block the Vite build. Type errors are reported but the build still produces output.

## Environment Variables

The application reads these at runtime. Set them in `.env.local` for local development:

```env
# Notion integration
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...

# SendGrid email
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=loans@example.com
SENDGRID_APPLICANT_TEMPLATE_ID=d-...   # Optional; falls back to plain HTML
SENDGRID_OFFICER_TEMPLATE_ID=d-...     # Optional; falls back to plain HTML

# Supabase (for type generation only)
SUPABASE_PROJECT_ID=...

# Vite-specific
VITE_TEMPO=true          # Enable Tempo devtools routes
VITE_BASE_PATH=/         # App base path (defaults to "/" in dev, uses this in prod)
```

**Important:** Variables accessed from the client (browser) via `import.meta.env` must be prefixed with `VITE_`. The `NOTION_API_KEY`, `NOTION_DATABASE_ID`, and `SENDGRID_*` vars are accessed without the `VITE_` prefix in service files, meaning they are currently treated as build-time constants baked into the bundle. In production these should be moved to a server-side API layer.

## Application Flow

```
Home (home.tsx)
  └── LoanApplicationWidget (orchestrator)
        ├── Step 0: PersonalInformationForm
        ├── Step 1: PropertyDetailsForm
        ├── Step 2: LoanRequirementsForm
        ├── Step 3: ApplicationReview  ← user can click "Edit" to go back to any step
        └── Step 4: ThankYouPage
```

### State Management

All multi-step form state lives in `LoanApplicationWidget` as three separate `useState` objects:
- `personalInfo` (PersonalInfoData)
- `propertyDetails` (PropertyDetailsData)
- `loanRequirements` (LoanRequirementsData)

Progress is auto-saved to `localStorage` under key `loanApplicationProgress` and restored on mount if less than 24 hours old. The ThankYouPage clears this key on display.

### Form Validation

Each step uses its own Zod schema defined at the top of `LoanApplicationWidget.tsx`. Validation runs when the user clicks "Next". Errors are displayed in an Alert component above the form. The three schemas are:
- `personalInfoSchema`
- `propertyDetailsSchema`
- `loanRequirementsSchema`

Individual forms use React Hook Form with `@hookform/resolvers/zod`. The widget also validates via `validateCurrentStep()` before advancing.

### Submission Flow (`handleSubmitApplication`)

1. Generate `applicationId` as `LN-<last 6 digits of timestamp>`
2. Dynamically import `NotionService` and `EmailService`
3. Call `notionService.submitApplication()` with the combined form data
4. If Notion submission succeeds, call `emailService.sendApplicationEmails()` for both applicant and loan officers
5. Call `onApplicationSubmit` prop callback
6. Advance to ThankYouPage (step 4)

**Current state:** Both services include simulated API delays for development. Real API calls are stubbed out in comments. To activate real Notion/SendGrid calls, implement the commented-out SDK usage in `NotionService.ts` and `EmailService.ts`.

## Key Conventions

### Path Aliases
Use `@/` to import from the `src/` directory:
```ts
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

### Classname Merging
Always use the `cn()` utility from `@/lib/utils` when combining Tailwind classes:
```ts
import { cn } from "@/lib/utils";
// cn uses clsx + tailwind-merge to handle conflicts correctly
```

### Shadcn UI Components
The `src/components/ui/` directory contains Shadcn UI components. These are **source files you own** (not from node_modules) and can be edited. When adding new Shadcn components, use the CLI:
```bash
npx shadcn-ui@latest add <component-name>
```

### TypeScript Configuration
- `strict` mode is **disabled** (`"strict": false` in `tsconfig.json`)
- Target: ES2020
- Path alias: `@/*` maps to `./src/*`
- The codebase uses explicit type annotations selectively; avoid introducing unnecessary `any` types

### ESLint
Configured with `--max-warnings 0`. Every warning is treated as an error. Run `npm run lint` before committing.

### No Tests
There are currently no test files or test framework configuration. If adding tests, Vitest is the natural choice given the Vite setup.

## Tempo Devtools

Tempo is active when `VITE_TEMPO=true`. It injects component stories from `src/stories/` and `src/tempobook/` (gitignored) as additional routes. The `App.tsx` conditionally renders Tempo routes:
```tsx
{import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
```
Do not remove this conditional — it is required for the Tempo development environment.

## Theming

Theming is controlled by CSS custom properties defined in `src/index.css`. The Tailwind config in `tailwind.config.js` maps these properties to Tailwind utility classes. The `LoanApplicationWidget` accepts a `primaryColor` prop (default: `#3b82f6`) that is applied inline to the header.

Dark mode is supported via the `dark` CSS class strategy (add `class="dark"` to `<html>`).

## Services Architecture

Both backend services follow the same pattern:
- Class-based with environment variable injection in constructor
- Development mode: simulate API calls with `setTimeout` delays
- Production mode: SDK calls are stubbed in comments (not yet wired up)
- All methods return `{ success: boolean, message: string, data?: any }`

### EmailService
- Sends to loan officers at hardcoded addresses: `david@balbi.ai`, `lucadbalbi@gmail.com`, `sal@growthandexit.com.au`
- Falls back to plain text/HTML if no SendGrid template ID is set

### NotionService
- Formats application data to Notion's property schema
- `Status` field defaults to `"New Application"` on creation

## Adding New Form Steps

1. Create a new form component in `src/components/forms/`
2. Define a Zod schema in `LoanApplicationWidget.tsx`
3. Add the step label to the `steps` array
4. Add a `case` in `validateCurrentStep()` and `renderCurrentStep()`
5. Add corresponding state with `useState` and a submit handler

## Common Gotchas

- **Numeric fields stored as strings:** Form fields for monetary values (`loanAmount`, `propertyValue`, etc.) are stored as strings and converted to numbers on submission using `.replace(/[^0-9.-]+/g, "")`. Do not assume they are numbers in form state.
- **`useEffect` inside JSX:** `LoanApplicationWidget.tsx` calls `React.useEffect` inside the JSX return (inside `renderCurrentStep`). This is technically invalid hook usage but currently works due to the stable render order. Avoid replicating this pattern.
- **`notionDatabaseId` prop vs env var:** The widget accepts a `notionDatabaseId` prop that takes precedence over the `NOTION_DATABASE_ID` env var.
- **Step index vs display index:** `NavigationControls` receives `currentStep={currentStep + 1}` (1-based for display), while all internal step logic uses 0-based indexing.
