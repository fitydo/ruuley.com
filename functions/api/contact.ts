export const onRequestPost: PagesFunction = async (ctx) => {
  const { request, env } = ctx;
  const formData = await request.formData();
  const name = String(formData.get("name") || "").slice(0, 200);
  const email = String(formData.get("email") || "").slice(0, 200);
  const message = String(formData.get("message") || "").slice(0, 5000);
  const token = String(formData.get("cf-turnstile-response") || "");

  if (!env.TURNSTILE_SECRET) {
    return new Response("TURNSTILE_SECRET not set", { status: 500 });
  }
  // Verify Turnstile
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const verifyBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token,
    remoteip: ip,
  });
  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: verifyBody }
  );
  const verifyJson = (await verifyRes.json()) as { success: boolean };
  if (!verifyJson.success) {
    return new Response("Turnstile verification failed", { status: 400 });
  }

  // Post to Slack
  if (!env.SLACK_WEBHOOK_URL) {
    return new Response("SLACK_WEBHOOK_URL not set", { status: 500 });
  }
  const text = `New contact from ${name} <${email}>\n${message}`;
  await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });

  return new Response(null, {
    status: 302,
    headers: { Location: "/contact?sent=1" },
  });
};
