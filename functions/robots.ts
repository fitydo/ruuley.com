export const config = { path: "/robots.txt" };

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  const url = new URL(request.url);
  const host = url.hostname;
  const isPreview = host.endsWith(".pages.dev") || host.startsWith("staging.");
  const site = env.SITE_URL || "https://ruuley.com";
  // Google best practice: Allow all by default (empty Disallow means allow)
  // Explicitly block preview domains, allow production
  const body = isPreview
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nDisallow:\nSitemap: ${site}/sitemap.xml\n`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
};
