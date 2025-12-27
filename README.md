# Fast Next.js CLI

A custom scaffold for Next.js 15 + React 19 projects with built-in support for:
- **i18n** (next-intl)
- **Authentication** (Login & Register pages + JWT via Server Actions)
- **Tailwind CSS** + **ShadcnUI**
- **Zustand** State Management

## Installation

```bash
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
- `--with-login`: Enable login/register feature (automatically enables i18n and updates home page)

Example:

```bash
fast-nextjs-cli create my-app --with-login
```

## Auth & Permissions

- Without `--with-login`, the scaffold only copies the base or i18n structure. There is no auth middleware and every route remains public.
- With `--with-login`, the CLI adds locale-aware Login/Register pages, `actions/auth.ts`, mock `api/auth/*` routes, and writes `src/middleware.ts` that protects `/[locale]/dashboard` via the JWT cookie. Users without a token are redirected to the correct locale login page.
- Auth-enabled projects also include a `.env.example`; copy it to `.env.local` and set `API_URL` when replacing the mock API with your backend.

## Project Structure

The generated project will have the following structure based on your choices:

- **Simple**: Standard App Router structure.
- **i18n**: `src/app/[locale]` based structure with `messages/` and Language Switcher.
- **Features**: 
    - **Auth**: Includes `(auth)/login`, `(auth)/register`, `actions/auth.ts`, Mock API Routes (`api/auth/*`), and protected `dashboard`.

## License

MIT
