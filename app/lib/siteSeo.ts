export const SITE_NAME = "Rafsan Sabab";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  "https://rafsan-sabab-frontend.vercel.app";

export const SITE_DESCRIPTION =
  "Official website of Rafsan Sabab, an event host, emcee, podcaster, and vlogger known for live shows, stage hosting, brand collaborations, and What a Show.";

export const SITE_KEYWORDS = [
  "Rafsan Sabab",
  "Rafsan Sabab official website",
  "event host Bangladesh",
  "best event host in Bangladesh",
  "emcee Bangladesh",
  "MC Bangladesh",
  "corporate event host",
  "live show host",
  "stage host",
  "podcast host",
  "vlogger",
  "content creator Bangladesh",
  "brand collaboration",
  "college event host",
  "What a Show",
  "What a Show host",
  "book Rafsan Sabab",
  "Bangla host",
  "English host",
];

export const SITE_SOCIALS = [
  "https://www.facebook.com/rafsansababshows",
  "https://www.instagram.com/rafsan_sabab/?hl=en",
  "https://www.youtube.com/@RafsanSabab",
  "https://www.youtube.com/@WHATASHOW_OFFICIAL",
  "https://www.linkedin.com/in/rafsan-sabab?originalSubdomain=bd",
];

export function getSiteUrl(path = "/") {
  const base = SITE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    sameAs: SITE_SOCIALS,
    jobTitle: ["Event Host", "Podcaster", "Vlogger", "Content Creator"],
    knowsAbout: [
      "Event hosting",
      "Corporate shows",
      "Podcasting",
      "Brand collaborations",
      "Live stage events",
    ],
  };
}
