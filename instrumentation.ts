// Runs once per server instance (Next.js instrumentation hook).
//
// The backend rate-limits per client IP. Server-side renders on Vercel all
// reach the API from a handful of Vercel IPs, so they would share — and
// exhaust — one IP's budget. When INTERNAL_API_KEY is set (server-only env,
// never NEXT_PUBLIC_), attach it as X-Internal-Key to server-side requests
// bound for the API so the backend can exempt them.
//
// With INTERNAL_API_KEY unset this does nothing.

export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const key = (process.env.INTERNAL_API_KEY || "").trim();
  if (!key) return;

  const apiBase = (
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.API_BASE ||
    "https://api.rafsansabab.com"
  ).trim();

  let apiOrigin: string;
  try {
    apiOrigin = new URL(/^https?:\/\//i.test(apiBase) ? apiBase : `https://${apiBase}`).origin;
  } catch {
    return;
  }

  const originalFetch = globalThis.fetch;
  if (typeof originalFetch !== "function") return;

  const patchedFetch: typeof fetch = (input, init) => {
    try {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.href
          : input.url;

      if (new URL(url).origin === apiOrigin) {
        const headers = new Headers(
          init?.headers ?? (input instanceof Request ? input.headers : undefined)
        );
        if (!headers.has("x-internal-key")) headers.set("x-internal-key", key);
        return originalFetch(input, { ...init, headers });
      }
    } catch {
      // Unparseable / relative URL — fall through untouched.
    }
    return originalFetch(input, init);
  };

  // Preserve any properties Next.js attaches to its patched fetch.
  Object.assign(patchedFetch, originalFetch);
  globalThis.fetch = patchedFetch;
}
