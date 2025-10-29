# Deploying to Cloudflare Pages

1. Create a new Pages project
   - Connect GitHub repository that contains `ruuley.com/`.
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: `20`

2. Environment variables (Project → Settings → Environment variables)
   - `SITE_URL` = `https://ruuley.com`
   - `PUBLIC_TURNSTILE_SITE_KEY` = your Turnstile site key
   - `TURNSTILE_SECRET` = your Turnstile secret
   - `SLACK_WEBHOOK_URL` = Slack incoming webhook URL
   - `PUBLIC_CF_ANALYTICS_TOKEN` = Cloudflare Web Analytics token (optional)

3. Custom domains
   - Add `ruuley.com` as the primary domain (apex). Issue SSL automatically.
   - Add `www.ruuley.com` and keep as secondary; `_redirects` will 301 to apex.
   - Optional: Add `staging.ruuley.com` and map to Branch previews.

4. Security
   - SSL/TLS mode: Full (strict)
   - Always Use HTTPS: On
   - HSTS: On (include subdomains, preload if desired)
   - WAF managed rules: On
   - Bots: Block AI training bots, allow mainstream search crawlers

5. Performance
   - Enable Brotli, HTTP/3, Early Hints.
   - Cache Rules: default HTML short (5m), static assets long (30d). `_headers` already sets long cache for `/assets/*`.

6. Analytics
   - If using Cloudflare Web Analytics, set `PUBLIC_CF_ANALYTICS_TOKEN`. The script loads automatically in the layout.

7. Verify
   - `robots.txt` should be `Disallow: /` on preview domains and `Allow` on production.
   - Contact form POST `/api/contact` should succeed when Turnstile keys are valid.
