# VIP CELEBRATIONS — Premium Cloudflare Website

This package keeps the premium VIP CELEBRATIONS visual layout and adds the real Cloudflare backend: D1 for content and R2 for photos/logo.

## Features
- Premium responsive homepage based on the supplied VIP CELEBRATIONS design
- D1-powered programs, budgets, albums/posts and YouTube videos
- R2-powered photo and logo uploads
- Album = one decoration post with any number of photos
- Album detail route `/post/<slug>` with photo viewer and optional YouTube button
- Gallery: Albums / All Photos, search, program filter, budget filter and price sorting
- Search covers uploaded website posts and their descriptions; YouTube section is also searchable by the page search only when video data is loaded in the frontend
- Admin panel at `/admin`
- Admin can change logo, business links/settings, create albums, upload multiple photos and add/delete YouTube videos
- Floating WhatsApp button
- SEO metadata and mobile-first layout

## Cloudflare resources expected
- Worker: `vipcelebrations`
- D1: `vip-celebrations-db`
- D1 ID: `4690d1e1-af42-4d21-a1f8-bf0d9d8d02d6`
- R2: `vipcelebrations-media`

## One required security setting
In Cloudflare Worker **Settings → Variables and Secrets**, add a secret named `ADMIN_PASSWORD`. Choose a strong password. The Admin page uses it for login.

## Deployment
GitHub Builds can use:
- Build command: blank
- Deploy command: `npx wrangler deploy`

The repository must contain `package.json`, `wrangler.jsonc`, `src/`, `public/`, and `migrations/` at the repository root.

After the first successful deployment, run the D1 migrations if the database does not already contain the tables:
`npx wrangler d1 migrations apply vip-celebrations-db --remote`

If the existing database already has the same tables/seed data from an earlier setup, do not run duplicate seed migrations.
