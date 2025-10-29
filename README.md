# ruuley.com (Cloudflare Pages + Astro)

This repository contains the marketing site for ruuley.com, designed for Cloudflare Pages with minimal serverless functions.

## Quick start

```bash
npm i
npm run dev
npm run build
```

## Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist/`
- Functions directory: `functions/`
- Custom domains: apex `ruuley.com` (prod), `www` → 301 to apex, `staging.ruuley.com` for branch previews.

## Environment variables
Set these in Cloudflare Pages → Settings → Environment variables.

- `TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key (public)
- `TURNSTILE_SECRET`: Cloudflare Turnstile secret key (server)
- `SLACK_WEBHOOK_URL`: Incoming webhook URL for contact form delivery
- `SITE_URL`: e.g. `https://ruuley.com`

## Notes
- `functions/robots.ts` returns `Disallow: /` for preview domains and `Allow` for production.
- `_redirects` handles `www` → apex redirect.
- `_headers` configures basic security and caching headers.
