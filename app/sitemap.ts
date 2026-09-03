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
};

type EventDoc = {
  _id: string;
  slug?: string;
};

async function fetchShowSlugs() {
  try {
    const res = await fetch(apiList.shows.list, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as Show[] | { shows?: Show[] };
    const shows = Array.isArray(json) ? json : json.shows ?? [];

    return shows
      .map((show) => slugifyTitle(show.title))
      .filter((slug) => slug.length > 0);
  } catch {
    return [];
  }
}

async function fetchEventRegSlugs() {
  try {
    const res = await fetch(apiList.events.list, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as { events?: EventDoc[] };
    const events = Array.isArray(json.events) ? json.events : [];

    return events
      .map((event) => event.slug?.trim())
      .filter((slug): slug is string => Boolean(slug));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/portfolio",
    "/gallery",
    "/explore-shows",
    "/events",
    "/allEvents",
    "/connect",
    "/faqs",
    "/privacy",
    "/cookies",
    "/search",
    "/event-reg",
  ].map((path) => ({
    url: getSiteUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const [showSlugs, eventSlugs] = await Promise.all([
    fetchShowSlugs(),
    fetchEventRegSlugs(),
  ]);

  const showRoutes: MetadataRoute.Sitemap = showSlugs.map((slug) => ({
    url: getSiteUrl(`/shows/${encodeURIComponent(slug)}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventRoutes: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: getSiteUrl(`/event-reg/${encodeURIComponent(slug)}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = PORTFOLIO_TYPES.map((type) => ({
    url: getSiteUrl(`/categories/${portfolioTypeToSlug(type)}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...showRoutes, ...eventRoutes, ...categoryRoutes];
}
