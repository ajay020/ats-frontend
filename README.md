# JobTrackr — Application Tracking System

A full-stack job application tracker built with **Express.js + TypeScript** on the backend and **React + Vite** on the frontend. Built as a portfolio project demonstrating production-grade architecture patterns, type safety end-to-end, and professional developer workflows.

---

## Table of contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Design decisions](#design-decisions)
- [Scripts](#scripts)

---

## Overview

JobTrackr lets you track every job application from wishlist to offer. Each application records its full status history as an audit trail, so you can see exactly how long each stage took and review every note and contact along the way.

![Dashboard](/public/dashboard.png)

---

## Tech stack

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js 4 |
| Language | TypeScript 5 (strict mode) |
| ORM | Prisma 5 |
| Database | PostgreSQL 15 |
| Auth | JWT (access + refresh token rotation) |
| Validation | Zod |
| Password hashing | bcryptjs |
| File uploads | Multer |
| Security | Helmet, CORS, express-rate-limit |
| Testing | Jest + Supertest |
| Dev tooling | tsx, ESLint, Prettier |

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript 5 (strict mode) |
| Server state | TanStack Query (React Query v5) |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS (custom design system) |
| HTTP client | Axios (with silent token refresh interceptor) |
| Icons | Lucide React |

---

## Architecture

```
jobtrackr/
├── backend/          # Express API
└── frontend/         # React SPA
```

### Backend layer pattern

Every request flows through the same pipeline — no exceptions:

```
Request
  → Security middleware (Helmet, CORS, rate limiting)
  → Auth middleware     (JWT verification)
  → Validation         (Zod schema)
  → Controller         (parse req, call service, send res)
  → Service            (all business logic, Prisma queries)
  → Global error handler
```

Controllers contain zero business logic. Services contain zero HTTP knowledge. This strict separation makes each layer independently testable.

### Frontend data flow

```
Component
  → Custom hook (useApplications, useAuth…)
  → TanStack Query (cache, refetch, optimistic updates)
  → API module (applicationsApi, authApi)
  → Axios instance (with auto token refresh interceptor)
  → Backend API
```

---

## Features

### Core

- **Full application CRUD** — create, read, update, delete job applications
- **Status pipeline** — move applications through 8 stages: Wishlist → Applied → Phone Screen → Interview → Offer / Rejected / Withdrawn / Ghosted
- **Status audit trail** — every status change is recorded with a timestamp and optional note
- **Dashboard** — live stats including pipeline breakdown, response rate, upcoming interviews, and recent activity
- **Filtering + search** — filter by status, work mode, job type, priority, and favorites; full-text search across job title, company, and location
- **Sortable table** — sort by job title, priority, applied date, or created date
- **Pagination** — server-side with configurable page size

### Per-application

- **Notes** — four types (General, Interview prep, Follow-up, Feedback) with collapsible cards
- **Contacts** — track recruiters and interviewers with email, LinkedIn, and phone
- **Salary range** — min/max with currency
- **Company details** — auto-created on first use, shared across applications
- **Job description** — paste and store the full JD for reference
- **File uploads** — resume and cover letter attachment

### Auth

- **JWT with refresh token rotation** — access tokens (15 min, in memory) + refresh tokens (7 days, stored in DB)
- **Silent refresh** — Axios interceptor transparently refreshes expired access tokens without the user noticing
- **Logout from all devices** — invalidates every refresh token for the user
- **Change password** — atomically updates password and invalidates all sessions

---

## Project structure

### Backend

```
backend/
├── prisma/
│   ├── schema.prisma       # All models, enums, relations, indexes
│   └── seed.ts             # Realistic seed data for development
├── src/
│   ├── config/
│   │   ├── env.ts          # Zod-validated environment variables (crashes on bad config)
│   │   └── database.ts     # Prisma client singleton + query helpers
│   ├── controllers/        # HTTP layer only — parse req, call service, send res
│   │   ├── auth.controller.ts
│   │   └── application.controller.ts
│   ├── services/           # All business logic and database queries
│   │   ├── auth.service.ts
│   │   └── application.service.ts
│   ├── routes/             # Express routers — public API contract
│   │   ├── auth.routes.ts
│   │   └── application.routes.ts
│   ├── middlewares/
│   │   ├── authenticate.ts  # JWT guard + requireRole helper
│   │   ├── validate.ts      # Zod schema middleware factory
│   │   ├── errorHandler.ts  # Global error handler (AppError + ZodError)
│   │   └── notFound.ts
│   ├── validators/          # Zod schemas — single source of truth for input shapes
│   │   ├── auth.validator.ts
│   │   └── application.validator.ts
│   ├── types/
│   │   ├── api.types.ts     # ApiResponse<T>, PaginationMeta
│   │   ├── auth.types.ts    # TokenPayload, AuthTokens, LoginResponse
│   │   └── express.d.ts     # Augments req.user globally
│   ├── utils/
│   │   ├── AppError.ts      # Custom error class with factory helpers
│   │   ├── jwt.ts           # Token generation and verification
│   │   └── response.ts      # sendSuccess, sendCreated, sendNoContent helpers
│   ├── __tests__/
│   │   ├── auth.test.ts
│   │   └── application.test.ts
│   ├── app.ts               # Express app — middleware + routes (no server.listen)
│   └── server.ts            # DB connect → server.listen → graceful shutdown
└── package.json
```

### Frontend

```
frontend/src/
├── api/
│   ├── client.ts            # Axios instance with silent token refresh interceptor
│   ├── auth.api.ts
│   └── applications.api.ts
├── components/
│   ├── ui/                  # Base components built from scratch with Tailwind
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Badge.tsx        # StatusBadge with per-status colour config
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Tabs.tsx         # Context-based tab system (no index guessing)
│   │   ├── Tooltip.tsx
│   │   ├── Spinner.tsx
│   │   └── EmptyState.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── AppShell.tsx     # Outlet wrapper with page transition
│   └── features/
│       ├── CreateApplicationModal.tsx
│       ├── DeleteConfirmModal.tsx
│       ├── StatusTransitionMenu.tsx  # Two-step status change with optional note
│       ├── StatusTimeline.tsx        # Visual audit trail
│       ├── NoteCard.tsx
│       ├── AddNoteForm.tsx
│       ├── ContactCard.tsx
│       └── AddContactForm.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useApplications.ts
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   └── applications/
│       ├── ApplicationsPage.tsx
│       └── ApplicationDetailPage.tsx
├── lib/
│   └── queryClient.ts       # Query client config + query key factory
├── types/
│   └── index.ts             # Mirrors backend types exactly
├── utils/
│   ├── cn.ts                # clsx + tailwind-merge
│   └── formatters.ts        # formatSalary, timeAgo, label maps
├── App.tsx                  # Routes + ProtectedRoute + PublicRoute guards
└── main.tsx
```

---

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm 9+

### 1 — Clone and install

```bash
git clone https://github.com/yourusername/jobtrackr.git
cd jobtrackr

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2 — Configure environment

```bash
cd backend
cp .env.example .env
# Edit .env and fill in your DATABASE_URL and JWT secrets
```

### 3 — Set up the database

```bash
cd backend

# Run migrations — creates all tables
npm run db:migrate

# Generate the Prisma client
npm run db:generate

# Seed with realistic sample data
npm run db:seed
```

### 4 — Start both servers

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev
```

### 5 — Log in

Open `http://localhost:5173` and use the seed credentials:

```
Email:    dev@example.com
Password: Password123!
```

---

## Environment variables

All environment variables are validated at startup using Zod. The app will **crash immediately with a clear error** if any required variable is missing or malformed — never silently at runtime.

```bash
# backend/.env

# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ats_db?schema=public"

# JWT — use a random 32+ character string for each secret
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# File upload
MAX_FILE_SIZE_MB=5
UPLOAD_DIR=uploads
```

---

## API reference

All endpoints (except auth) require `Authorization: Bearer <accessToken>`.

All responses follow the same envelope:

```json
{
  "success": true,
  "message": "Applications fetched",
  "data": [...],
  "meta": { "total": 24, "page": 1, "limit": 20, "totalPages": 2 }
}
```

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create account, receive token pair |
| POST | `/login` | No | Login, receive token pair |
| POST | `/refresh` | No | Rotate refresh token, get new pair |
| POST | `/logout` | No | Revoke refresh token |
| GET | `/me` | Yes | Get current user profile |
| POST | `/logout-all` | Yes | Revoke all sessions for this user |
| PATCH | `/change-password` | Yes | Update password, invalidate all sessions |

### Applications — `/api/applications`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List with filters, search, sort, pagination |
| POST | `/` | Create application (+ company upsert) |
| GET | `/stats` | Dashboard stats |
| GET | `/:id` | Full detail with notes, contacts, history |
| PATCH | `/:id` | Update application fields |
| DELETE | `/:id` | Delete + cascade all children |
| PATCH | `/:id/status` | Transition status, auto-log history entry |
| PATCH | `/:id/favorite` | Toggle isFavorite |
| POST | `/:id/notes` | Add note |
| DELETE | `/:id/notes/:noteId` | Delete note |
| POST | `/:id/contacts` | Add contact |
| DELETE | `/:id/contacts/:contactId` | Delete contact |

#### List query parameters

```
?status=APPLIED
?workMode=REMOTE
?jobType=FULL_TIME
?priority=2
?isFavorite=true
?search=stripe
?sortBy=appliedAt
?sortOrder=desc
?page=1
?limit=20
```

---

## Design decisions

### Why `app.ts` and `server.ts` are separate

`app.ts` configures the Express application and exports it. `server.ts` imports the app and calls `listen()`. This means tests can import `app` directly via Supertest without binding to a port — critical for running tests in parallel.

### Zod for environment variables

Rather than sprinkling `process.env.SOME_VAR` calls across the codebase, all environment variables are parsed and typed once in `src/config/env.ts`. If anything is missing or the wrong type, the process exits with a clear error before accepting a single request. This eliminates an entire category of production bugs.

### Refresh token rotation

When a refresh token is used to get a new access token, the old refresh token is immediately deleted and a new one is issued. This means a stolen refresh token can only be used once — the next legitimate use will fail because the token is already gone, alerting the user that something is wrong.

### Access token in memory, refresh token in localStorage

Access tokens (short-lived, 15 min) are stored in a JavaScript variable — never in localStorage or cookies. This protects against XSS. Refresh tokens (long-lived, 7 days) are stored in localStorage because they need to survive page refreshes. The risk is acceptable because the backend validates every refresh token against the database, so stolen tokens can be invalidated server-side.

### Silent refresh via Axios interceptor

The `client.ts` Axios instance intercepts every 401 response and attempts a token refresh before retrying the original request. All other in-flight requests that arrive during the refresh are queued and replayed once the new token is available. The user never sees an authentication error during normal usage.

### `AppError` class with `isOperational` flag

All expected errors (404, 401, 409 conflicts) are thrown as `AppError` instances with `isOperational: true`. Unexpected errors (programming bugs, database crashes) fall through as regular `Error` instances. The global error handler treats these differently — operational errors return clean JSON responses, unexpected errors log the full stack trace and return a generic 500 in production.

### Prisma `@@map()` on every model

Model names in TypeScript are PascalCase (`User`, `Application`). Table names in PostgreSQL are snake_case (`users`, `applications`). The `@@map()` decorator makes this explicit rather than relying on implicit Prisma conventions — every developer immediately knows the actual table name.

### Query key factory

All React Query cache keys are defined in one place in `queryClient.ts`:

```typescript
export const queryKeys = {
  applications: {
    all: (query = {}) => ['applications', query] as const,
    detail: (id: string) => ['applications', id] as const,
    stats: ['applications', 'stats'] as const,
  },
};
```

This prevents cache key typos and makes invalidation predictable — `qc.invalidateQueries({ queryKey: ['applications'] })` correctly invalidates list, stats, and detail caches simultaneously.

---

## Scripts

### Backend

```bash
npm run dev          # Start dev server with hot reload (tsx watch)
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled build (production)
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier
npm run test         # Jest (runs in band — sequential, safer for DB tests)
npm run test:watch   # Jest in watch mode
npm run db:migrate   # Run pending Prisma migrations
npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:studio    # Open Prisma Studio (visual DB browser on :5555)
npm run db:seed      # Seed the database with sample data
```

### Frontend

```bash
npm run dev          # Vite dev server on :5173 (proxies /api to :5000)
npm run build        # Type-check + Vite production build
npm run preview      # Preview the production build locally
npm run lint         # ESLint
```

---

## License

MIT