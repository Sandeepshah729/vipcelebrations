# VIP CELEBRATIONS — Cloudflare Worker + D1 + R2

This is the dashboard-friendly full-stack project for VIP CELEBRATIONS.

## What is included
- Premium mobile-first website
- Unified search for website decoration albums
- Program + budget filters
- Price low/high sorting
- Decoration albums with multiple photos
- Per-album YouTube video button
- Latest 10 managed YouTube videos
- Admin panel
- D1 database schema
- R2 image storage
- SEO title/description/keywords
- WhatsApp, Maps, Facebook, Instagram, YouTube links

## Recommended easiest deployment
1. Create a GitHub repository and upload this entire folder.
2. Cloudflare Dashboard → Workers & Pages → Create application → Import an existing Git repository.
3. Connect GitHub and select the repository.
4. Root directory: `/`
5. Build command: leave blank.
6. Deploy command: `npx wrangler deploy`
7. After the first deployment, open Worker → Bindings and confirm:
   - D1: `DB`
   - R2: `PHOTOS`
8. If R2 bucket does not exist, create `vip-celebrations-photos` first, then bind it as `PHOTOS`.
9. Worker Settings → Variables/Secrets → add secret:
   - `ADMIN_KEY` = a long random password
10. Apply the D1 migrations from the D1 dashboard or with Wrangler:
   `npx wrangler d1 migrations apply vip-celebrations-db --remote`

## Important
- The D1 ID in wrangler.jsonc is the database shown in the project setup screenshots. Verify it before deployment.
- Google Business Profile reviews are intentionally not faked. To display live Google reviews, add the appropriate Google Places API credentials later.
- YouTube auto-sync can be upgraded to YouTube Data API after adding a YouTube API key. The admin panel already supports manually adding/updating channel videos.
- Never put an ADMIN_KEY in public JavaScript.
