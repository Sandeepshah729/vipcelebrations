# VIP CELEBRATIONS — Premium Dynamic Cloudflare Worker

This project keeps the original premium frontend style while making gallery, photos, posts, videos and reviews data-driven.

## Cloudflare resources
- Worker + Assets
- D1 binding: `DB`
- R2 binding: `PHOTOS`
- Admin secret: `ADMIN_KEY`
- Optional YouTube secret: `YOUTUBE_API_KEY` (the Worker resolves `@vipcelebrations` to the channel ID automatically)
- Optional Google secret: `GOOGLE_PLACES_API_KEY` (the Worker finds the VIP CELEBRATIONS place automatically; `GOOGLE_PLACE_ID` is optional)

## Important
YouTube search/sync is restricted server-side to `YOUTUBE_CHANNEL_ID`. Google reviews are read server-side from the configured Place ID. Never put API keys in frontend files.

## Deployment
1. Run `npm install`
2. Ensure `wrangler.jsonc` has your real D1 database ID and R2 bucket name.
3. Run migrations with `npx wrangler d1 migrations apply vip-celebrations-db --remote`
4. Deploy with `npx wrangler deploy`
5. In Cloudflare Worker Settings → Variables and Secrets, add `ADMIN_KEY` as a Secret.
6. Optional: add `YOUTUBE_API_KEY` and `GOOGLE_PLACES_API_KEY` as Cloudflare Secrets. You do not need to find the channel ID or Place ID unless you prefer to set them explicitly.
7. Open `/admin`, enter ADMIN_KEY, and use Sync.

The scheduled Worker sync runs every 30 minutes after API credentials are configured.
