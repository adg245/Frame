# FRAME — Deployment Guide

This guide walks through deploying FRAME to production: frontend on Vercel, backend on Render (or an equivalent Node host), and the database on Supabase.

---

## Overview

| Component | Platform | Why |
|---|---|---|
| Frontend | Vercel | Built for static/SPA React builds; fast global CDN |
| Backend | Render (or Railway / Fly.io / a VPS) | A long-running Node process — see note below on why not serverless |
| Database + Auth | Supabase | Already the source of truth from Phase 4–5 |

### Why not deploy the backend to Vercel serverless functions?

The brief allows either a Vercel-compatible deployment or "another suitable Node.js hosting provider." FRAME's backend keeps two kinds of **in-process state** that don't survive — and actively work against — a serverless model:

1. **The TMDB response cache** (`backend/src/utils/cache.ts`) is a plain in-memory `Map`. On serverless, every cold start wipes it and concurrent invocations don't share it, so you'd hit TMDB's rate limit far more than intended.
2. **The rate limiters** (`express-rate-limit`) also track state in memory per-process. Serverless cold starts and parallel invocations make these far less effective at protecting the TMDB quota.

Prisma's connection pool also performs better against one long-lived process than against bursty serverless invocations (a well-documented Prisma + serverless pain point, usually solved with a separate connection pooler like PgBouncer — which Supabase's pooled `DATABASE_URL` already provides, but which still works best paired with a stable process). A long-running host sidesteps all of this with no extra configuration. If you still want Vercel serverless for the backend, it's possible — you'd need to move the cache and rate-limit state to something shared (Redis, Supabase itself) first.

---

## 1. Database & Auth — Supabase

1. Create a project at [supabase.com](https://supabase.com/dashboard).
2. **Settings → API** — copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (⚠️ server-only — never put this in the frontend)
3. **Settings → Database** — copy the two connection strings:
   - **Connection pooling** string → `DATABASE_URL`
   - **Direct connection** string → `DIRECT_URL`
4. (Optional) **Authentication → Providers** — enable Google if you want the "Continue with Google" button to work.
5. **Authentication → URL Configuration** — set the **Site URL** to your production frontend URL (e.g. `https://frame.yourdomain.com`), and add it to **Redirect URLs** too. This is required for password-reset emails and OAuth to redirect back correctly.
6. From your local machine, with `backend/.env` filled in:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
   This applies the schema (`prisma/schema.prisma`) to your production database. Review the generated migration before confirming if you're doing this against a live database for the first time.

---

## 2. Backend — Render

1. Push this repository to GitHub/GitLab.
2. In the [Render dashboard](https://dashboard.render.com), choose **New + → Blueprint**, and point it at this repo — Render looks for `render.yaml` at the repo root automatically, which points at the `backend/` subdirectory via its `rootDir` field.
3. Render will prompt you for the env vars marked `sync: false` in that file:

   | Variable | Value |
   |---|---|
   | `FRONTEND_URL` | Your Vercel URL, once you have it (step 3 below) — e.g. `https://frame.vercel.app` |
   | `TMDB_API_READ_ACCESS_TOKEN` | From themoviedb.org → Settings → API |
   | `SUPABASE_URL` | From Supabase step 1 above |
   | `SUPABASE_ANON_KEY` | From Supabase step 1 above |
   | `SUPABASE_SERVICE_ROLE_KEY` | From Supabase step 1 above |
   | `DATABASE_URL` | From Supabase step 1 above (pooled) |
   | `DIRECT_URL` | From Supabase step 1 above (direct) |

4. Deploy. Render builds with `npm install && npm run build` and starts with `npm start`, health-checked at `/api/health`.
5. Once live, note the backend's URL (e.g. `https://frame-backend.onrender.com`) — you'll need it for the frontend's `VITE_API_BASE_URL`.

**No Blueprint, or using Railway/Fly.io/a VPS instead?** The same five steps apply manually: set the env vars above, build with `npm run build`, run with `npm start`, and point whatever health check mechanism your host uses at `GET /api/health`.

---

## 3. Frontend — Vercel

1. In the [Vercel dashboard](https://vercel.com/new), import this repository.
2. Set **Root Directory** to `frontend`. Vercel will pick up `frontend/vercel.json` automatically (SPA rewrites + asset caching).
3. Set environment variables (**Settings → Environment Variables**):

   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | Your backend's full URL + `/api`, e.g. `https://frame-backend.onrender.com/api` |
   | `VITE_SUPABASE_URL` | Same Supabase project URL as the backend |
   | `VITE_SUPABASE_ANON_KEY` | Same Supabase anon key as the backend |

4. Deploy. Vercel runs `npm run build`, outputs `dist/`.
5. Once live, go back to the backend's `FRONTEND_URL` env var (Render dashboard) and set it to this Vercel URL — then redeploy the backend so CORS allows it.

---

## 4. Post-deploy checklist

- [ ] Visit `https://your-backend-url/api/health` — confirm `"tmdb": true`, `"supabase": true`, `"database": true`
- [ ] Visit the frontend — confirm the Home page loads real movie carousels (not the "TMDB not configured" notice)
- [ ] Sign up a test account — confirm the confirmation email arrives (check Supabase's email settings if not)
- [ ] Sign in — confirm the Profile page shows your email and the theme you pick persists after a refresh
- [ ] Add a movie to your watchlist and to a new collection — confirm both appear after a page reload
- [ ] Open a movie's Watch page — confirm the VidRift player loads (see `TESTING.md` for what "loads" means for content you're authorised to embed)
- [ ] Check the browser console and Network tab for any request still pointed at `localhost`

---

## 5. Custom domains (optional)

- **Frontend**: Vercel → Project Settings → Domains → add your domain, follow their DNS instructions.
- **Backend**: Render → your service → Settings → Custom Domain.
- After adding a custom frontend domain, update:
  - The backend's `FRONTEND_URL` env var
  - Supabase's **Site URL** and **Redirect URLs** (Authentication → URL Configuration)

---

## 6. Rolling back / redeploying

Both Vercel and Render redeploy automatically on every push to your connected branch. To roll back:
- **Vercel**: Deployments tab → pick a previous deployment → "Promote to Production"
- **Render**: the service's Deploys tab → pick a previous deploy → "Redeploy"

Database migrations are not automatically rolled back — `prisma migrate` is additive by design. Plan schema changes with that in mind.
