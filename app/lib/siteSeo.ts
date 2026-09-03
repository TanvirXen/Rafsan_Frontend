import type { Metadata } from "next";

export const SITE_NAME = "Rafsan Sabab";
export const SITE_TITLE = "Rafsan Sabab — Host • Comedian • Creator";
export const SITE_META_IMAGE = "/rafsanmeta.jpeg";
export const WHAT_A_SHOW_META_IMAGE = "/whatashowmeta.jpeg";

const DEFAULT_SITE_URL = "https://www.rafsansabab.com";

function normalizeSiteUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return DEFAULT_SITE_URL;

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(candidate).toString().replace(/\/+$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL
);

export const SITE_DESCRIPTION =
  "I’m Rafsan Sabab — a Bangladeshi host, comedian, and content creator passionate about entertainment, storytelling, and connecting with people. Explore my shows, projects, latest work, and journey across television, digital media, and the world of entertainment.";

export const WHAT_A_SHOW_DESCRIPTION =
  "Welcome to What a Show! — my space for unforgettable conversations, comedy, games, and stories with some of Bangladesh’s most exciting personalities. Hosted by me, Rafsan Sabab, What a Show! brings together entertainment, laughter, and real conversations for audiences across Bangladesh.";

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

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = SITE_META_IMAGE,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = getSiteUrl(path);

  return {
    title: { absolute: title },
    description,
    keywords: [...SITE_KEYWORDS, ...keywords],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

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

export function buildRootJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { ...buildWebSiteJsonLd(), "@context": undefined },
      { ...buildPersonJsonLd(), "@context": undefined },
    ],
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: getSiteUrl(item.path) } : {}),
    })),
  };
}
