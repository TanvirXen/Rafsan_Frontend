import type { MetadataRoute } from "next";
import apiList from "@/apiList";
import { slugifyTitle } from "@/app/lib/slugifyTitle";
import {
  PORTFOLIO_TYPES,
  portfolioTypeToSlug,
} from "@/app/lib/portfolioNotableEvents";
import { getSiteUrl } from "./lib/siteSeo";

type Show = {
  _id: string;
  title: string;
  updatedAt?: string;
  createdAt?: string;
};

type EventDoc = {
  _id: string;
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
};

/** A route plus the best "last changed" timestamp we can source for it. */
type SlugEntry = {
  slug: string;
  lastModified: Date;
};

/** Parse an API timestamp, falling back when the field is missing or malformed. */
function toDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

async function fetchShowEntries(fallback: Date): Promise<SlugEntry[]> {
  try {
    const res = await fetch(apiList.shows.list, {
      next: { revalidate: 15 },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as Show[] | { shows?: Show[] };
    const shows = Array.isArray(json) ? json : json.shows ?? [];

    return shows
      .map((show) => ({
        slug: slugifyTitle(show.title),
        lastModified: toDate(show.updatedAt ?? show.createdAt, fallback),
      }))
      .filter((entry) => entry.slug.length > 0);
  } catch {
    return [];
  }
}

async function fetchEventRegEntries(fallback: Date): Promise<SlugEntry[]> {
  try {
    const res = await fetch(apiList.events.list, {
      next: { revalidate: 15 },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as { events?: EventDoc[] };
    const events = Array.isArray(json.events) ? json.events : [];

    return events
      .map((event) => ({
        slug: event.slug?.trim() ?? "",
        lastModified: toDate(event.updatedAt ?? event.createdAt, fallback),
      }))
      .filter((entry) => entry.slug.length > 0);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [showEntries, eventEntries] = await Promise.all([
    fetchShowEntries(now),
    fetchEventRegEntries(now),
  ]);

  // Static pages have no per-page timestamp, so we date them by the most recent
  // CMS change. That keeps lastmod stable between content updates instead of
  // moving on every revalidation, which search engines learn to ignore.
  const contentDates = [...showEntries, ...eventEntries].map(
    (entry) => entry.lastModified
  );
  const siteLastModified = contentDates.length
    ? new Date(Math.max(...contentDates.map((date) => date.getTime())))
    : now;

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/portfolio",
    "/gallery",
    "/explore-shows",
    "/events",
    "/connect",
    "/faqs",
    "/privacy",
    "/cookies",
  ].map((path) => ({
    url: getSiteUrl(path),
    lastModified: siteLastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const showRoutes: MetadataRoute.Sitemap = showEntries.map((entry) => ({
    url: getSiteUrl(`/shows/${encodeURIComponent(entry.slug)}`),
    lastModified: entry.lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventRoutes: MetadataRoute.Sitemap = eventEntries.map((entry) => ({
    url: getSiteUrl(`/event-reg/${encodeURIComponent(entry.slug)}`),
    lastModified: entry.lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = PORTFOLIO_TYPES.map((type) => ({
    url: getSiteUrl(`/categories/${portfolioTypeToSlug(type)}`),
    lastModified: siteLastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...showRoutes, ...eventRoutes, ...categoryRoutes];
}
