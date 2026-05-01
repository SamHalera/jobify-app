# Jobify

A job application tracker built with Next.js. Manage your applications, track recruitment stages, attach documents, and visualize your job search with statistics.

🌐 **Live demo:** https://jobify-samhalera.vercel.app

📦 **Source code:** [GitHub](https://github.com/SamHalera/jobify-app)

## Context

I built Jobify to organize my own job search. Spreadsheets and notes 
quickly fell short — I wanted a single place to track applications by 
status, log every step of a recruitment process, and keep CVs / cover 
letters attached to each company. The stats page came later when I 
realized I had no clear view of my pipeline at a glance.

This is the project I'm currently using daily for my own job search.

## Features

- **Application tracking** — Create and manage job applications with statuses (Wishlist → Applied → In Progress → Offer → Accepted/Rejected)
- **Recruitment stages** — Log each step of a recruitment process (screening, technical test, interview, etc.)
- **Document library** — Upload CVs and cover letters to Cloudinary, attach them to applications
- **Company management** — Manage companies independently and link applications to them
- **Statistics** — Visual KPIs: application breakdown by status and monthly activity chart

## Routes

| Route | Description |
|---|---|
| `/applications` | Application list with status filter |
| `/applications/new` | Create a new application |
| `/applications/[id]` | Application detail: metadata, stages, documents |
| `/applications/[id]/edit` | Edit an application |
| `/companies` | Company list |
| `/companies/[id]` | Company detail with linked applications |
| `/documents` | Document library |
| `/documents/upload` | Upload a PDF to Cloudinary |
| `/stats` | KPIs and charts |

## Prerequisites

- [Node.js](https://nodejs.org) >= 20
- [PostgreSQL](https://www.postgresql.org) >= 15 running locally
- A [Cloudinary](https://cloudinary.com) account (free tier is sufficient)

## Installation

**1. Clone the repository**

```bash
git clone <repository-url>
cd jobify
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Fill in `.env` with your values (see [Environment variables](#environment-variables) below).

**4. Set up the database**

Create the `jobify` database in PostgreSQL, then push the schema:

```bash
npx prisma db push
```

**5. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Create a company first at `/companies` before creating your first application.

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random secret for session encryption (min. 32 characters) |
| `BETTER_AUTH_URL` | Base URL of the app used by Better Auth |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the app |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `NEXT_PUBLIC_CLOUDINARY_ATTACHMENTS_PRESET` | Unsigned upload preset name configured in Cloudinary |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret (server-side only) |

To generate `BETTER_AUTH_SECRET`:

```bash
openssl rand -hex 32
```

### Cloudinary setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. In your dashboard, go to **Settings → Upload → Upload presets**
3. Create an **unsigned** preset and note its name
4. Copy your Cloud name, API key, and API secret from the dashboard

## Tech stack

### Framework & Language

| Library | Version | Description | Docs |
|---|---|---|---|
| [Next.js](https://nextjs.org) | 16 | React framework with App Router, Server Actions, and file-system routing | [nextjs.org/docs](https://nextjs.org/docs) |
| [React](https://react.dev) | 19 | UI library | [react.dev](https://react.dev) |
| [TypeScript](https://www.typescriptlang.org) | 5 | Static typing for JavaScript | [typescriptlang.org/docs](https://www.typescriptlang.org/docs) |

### Database & ORM

| Library | Version | Description | Docs |
|---|---|---|---|
| [Prisma](https://www.prisma.io) | 7 | Type-safe ORM for PostgreSQL. Handles schema definition, migrations, and query building | [prisma.io/docs](https://www.prisma.io/docs) |
| [@prisma/adapter-pg](https://www.prisma.io/docs/orm/overview/databases/postgresql) | 7 | Official Prisma adapter for the `pg` (node-postgres) driver | [prisma.io/docs](https://www.prisma.io/docs/orm/overview/databases/postgresql) |
| [pg](https://node-postgres.com) | 8 | Node.js PostgreSQL client | [node-postgres.com](https://node-postgres.com) |

### Authentication

| Library | Version | Description | Docs |
|---|---|---|---|
| [Better Auth](https://www.better-auth.com) | 1 | Full-featured authentication library for Next.js. Handles sessions, OAuth providers, and email/password auth | [better-auth.com/docs](https://www.better-auth.com/docs) |

### File storage

| Library | Version | Description | Docs |
|---|---|---|---|
| [Cloudinary](https://cloudinary.com) | 2 | Cloud media platform. Used server-side to delete files via the Admin API | [cloudinary.com/documentation](https://cloudinary.com/documentation/node_integration) |
| [next-cloudinary](https://next.cloudinary.dev) | 6 | Next.js integration for Cloudinary. Provides `CldUploadWidget` for client-side direct uploads and `CldImage` for optimized image display | [next.cloudinary.dev](https://next.cloudinary.dev) |

### UI & Styling

| Library | Version | Description | Docs |
|---|---|---|---|
| [shadcn/ui](https://ui.shadcn.com) | 4 | Collection of accessible, composable UI components built on Radix/Base UI and styled with Tailwind | [ui.shadcn.com](https://ui.shadcn.com) |
| [@base-ui/react](https://base-ui.com) | 1 | Unstyled, accessible headless UI primitives used as the foundation for shadcn components | [base-ui.com/react/overview](https://base-ui.com/react/overview) |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first CSS framework | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) | — | Tailwind v4-compatible animation utilities | [github](https://github.com/Wombosvideo/tw-animate-css) |
| [next-themes](https://github.com/pacocoursey/next-themes) | — | Theme management (dark/light mode) with zero flicker for Next.js | [github](https://github.com/pacocoursey/next-themes) |
| [Lucide React](https://lucide.dev) | — | Open-source icon library with 1000+ SVG icons as React components | [lucide.dev](https://lucide.dev) |

### Forms & Validation

| Library | Version | Description | Docs |
|---|---|---|---|
| [React Hook Form](https://react-hook-form.com) | 7 | Performant, flexible form library with minimal re-renders | [react-hook-form.com](https://react-hook-form.com) |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | 5 | Adapters to connect React Hook Form with validation libraries (Zod, Yup, etc.) | [github](https://github.com/react-hook-form/resolvers) |
| [Zod](https://zod.dev) | 4 | TypeScript-first schema declaration and validation library | [zod.dev](https://zod.dev) |

### Charts & Data visualization

| Library | Version | Description | Docs |
|---|---|---|---|
| [Recharts](https://recharts.org) | 3 | Composable chart library built on D3. Used for the stats page (pie chart by status, bar chart by month) | [recharts.org](https://recharts.org) |

### Utilities

| Library | Version | Description | Docs |
|---|---|---|---|
| [date-fns](https://date-fns.org) | 4 | Lightweight date utility library. Used for formatting and relative date display | [date-fns.io](https://date-fns.io) |
| [Sonner](https://sonner.emilkowal.ski) | 2 | Opinionated toast notification library for React | [sonner.emilkowal.ski](https://sonner.emilkowal.ski) |
| [clsx](https://github.com/lukeed/clsx) | — | Utility for conditionally joining class names | [github](https://github.com/lukeed/clsx) |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | — | Merges Tailwind CSS classes without style conflicts | [github](https://github.com/dcastil/tailwind-merge) |
| [class-variance-authority](https://cva.style) | — | Creates type-safe component variants with Tailwind | [cva.style](https://cva.style) |
| [uuid](https://github.com/uuidjs/uuid) | 14 | Generates RFC-compliant UUIDs | [github](https://github.com/uuidjs/uuid) |
| [dotenv](https://github.com/motdotla/dotenv) | — | Loads environment variables from `.env` into `process.env` (used by the Prisma config) | [github](https://github.com/motdotla/dotenv) |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npx prisma studio          # Open Prisma Studio (visual DB explorer)
npx prisma db push         # Push schema changes to the database
npx prisma migrate dev     # Create and apply a migration
```
