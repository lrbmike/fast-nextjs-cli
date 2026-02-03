# Fast Next.js CLI

A custom scaffold for Next.js 16 + React 19 projects with built-in support for:
- **i18n** (next-intl)
- **Authentication** (Login & Register pages + JWT via Server Actions)
- **Tailwind CSS** + **ShadcnUI**
- **Zustand** State Management

## Prerequisites

- Node.js 18+ (recommended 20+)

## Installation

```bash
# From npm (global install)
npm install -g fast-nextjs-cli

# Or run directly without install
npx fast-nextjs-cli create my-app

# Local development
npm install -g .
# OR link locally
npm link
```

## Usage

Create a new project:

```bash
fast-nextjs-cli create my-app
```

### Options

- `--with-i18n`: Enable i18n support
- `--with-login`: Enable login/register feature (works with or without i18n and updates home page)

Example:

```bash
fast-nextjs-cli create my-app --with-login
```

## Auth & Permissions

- Without `--with-login`, the scaffold only copies the base or i18n structure. There is no auth middleware and every route remains public.
- With `--with-login`, the CLI adds Login/Register pages, `actions/auth.ts`, mock `api/auth/*` routes, and writes `src/middleware.ts` that protects the dashboard routes via the JWT cookie.
  - With `--with-i18n`, routes are locale-aware (`/[locale]/login`, `/[locale]/dashboard`) and users are redirected to the matching locale login page.
  - Without `--with-i18n`, routes are `/login` and `/dashboard`.
- Auth-enabled projects also include a `.env.example`; copy it to `.env.local` and set `API_URL` when replacing the mock API with your backend.

## Project Structure

The generated project will have the following structure based on your choices:

- **Simple**: Standard App Router structure.
- **i18n**: `src/app/[locale]` based structure with `messages/` and Language Switcher.
- **Features**: 
    - **Auth**: Includes `(auth)/login`, `(auth)/register`, `actions/auth.ts`, Mock API Routes (`api/auth/*`), and protected `dashboard`.

## License

MIT
