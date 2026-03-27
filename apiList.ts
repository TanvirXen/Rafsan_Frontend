// /apiList.ts (PUBLIC WEBSITE)

/** Ensure we have an absolute, scheme-prefixed base without trailing slash. */
function normalizeBase(input?: string): string {
  const raw = (input || "").trim().replace(/\/+$/, "");
  if (!raw) return "https://api.rafsansabab.com/api";
  // If someone passes "api.rafsansabab.com/api" add scheme
  const hasScheme = /^https?:\/\//i.test(raw);
  return hasScheme ? raw : `https://${raw}`;
}



const API_BASE = normalizeBase(
  process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE
);

/** Join URL-safe path segments onto the base. No trailing slash. */
const path = (...parts: (string | number)[]) =>
  `${API_BASE}/${parts.map((p) => encodeURIComponent(String(p))).join("/")}`;

/**
 * Append (or merge) query params to a URL.
 * - Preserves existing query string.
 * - Encodes arrays by repeating the key (?k=a&k=b).
 * - Skips undefined/null/"" values.
 */
export const withQuery = (
  url: string,
  params?: Record<
    string,
    | string
    | number
    | boolean
    | Array<string | number | boolean>
    | undefined
    | null
  >
) => {
  if (!params || Object.keys(params).length === 0) return url;

  // URL() requires absolute; our URLs from `path()` already are.
  const u = new URL(url);

  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      // Remove existing values for this key to avoid duplicates when merging
      u.searchParams.delete(k);
      for (const item of v) u.searchParams.append(k, String(item));
    } else {
      u.searchParams.set(k, String(v));
    }
  }

  return u.toString();
};

const apiList = {
  base: API_BASE,

  // ----- Settings (GET) -----
  settings: {
    get: path("settings"),
  },

  // ----- Newsletter (public) -----
  newsletter: {
    // GET /api/newsletter/settings (used by homepage ISR)
    settingsGet: path("newsletter", "settings"),

    // POST /api/newsletter/subscribe
    subscribe: path("newsletter", "subscribe"),
  },
  banners: {
    get: (type: "about" | "gallery") => withQuery(path("banners"), { type }),
  },

  // ----- Shows (GET) -----
  shows: {
    list: path("shows"),
    get: (id: string) => path("shows", id),
    seasonsByShow: (showId: string) => path("shows", showId, "seasons"),
    episodesBySeason: (showId: string, seasonId: string) =>
      path("shows", showId, "seasons", seasonId, "episodes"),
    reelsByShow: (showId: string) => path("shows", showId, "reels"),
  },

  // ----- Events (GET) -----
  events: {
    list: path("events"),
    get: (id: string) => path("events", id),

    // Query-by-slug using the same /events endpoint; backend filters by ?slug=...
    bySlug: (slug: string) => withQuery(path("events"), { slug }),

    // Example additional filter (keep or remove based on backend support)
    upcoming: withQuery(path("events"), { status: "published" }),
  },
contact: {
  create: path("contact"),
},
  // ----- Registrations (GET) -----
  registrations: {
    list: path("registrations"),
    get: (id: string) => path("registrations", id),
  },

  // ----- Payments (GET) -----
  payments: {
    list: path("payments"),
    get: (id: string) => path("payments", id),
  },

  // ----- Timeline (GET) -----
  timeline: {
    list: path("timeline"),
    get: (id: string) => path("timeline", id),
  },

  // ----- Notable Events (GET) -----
  notableEvents: {
    list: path("notable-events"),
    get: (id: string) => path("notable-events", id),
  },

  // ----- Brands (GET) -----
  brands: {
    list: path("brands"),
    get: (id: string) => path("brands", id),
  },

  // ----- Shots (GET) -----
  shots: {
    list: path("shots"),
    get: (id: string) => path("shots", id),
  },
} as const;

export default apiList;
