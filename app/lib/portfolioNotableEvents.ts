import apiList from "@/apiList";
import { slugifyTitle } from "@/app/lib/slugifyTitle";

export const PORTFOLIO_TYPES = [
  "Event Hosting",
  "Sessions & Workshops",
  "Brand Collaboration",
  "Corporate Shows",
] as const;

export type PortfolioType = (typeof PORTFOLIO_TYPES)[number];

type NotableEventApi = {
  _id?: string;
  type?: string;
  title?: string;
  date?: string;
  imageLink?: string;
  description?: string;
};

export type PortfolioNotableEvent = {
  id: string;
  type: PortfolioType;
  title: string;
  description: string;
  dateISO: string;
  dateLabel: string;
  image: string;
  alt: string;
};

export type PortfolioNotableEventsByType = Record<
  PortfolioType,
  PortfolioNotableEvent[]
>;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function createEmptyGroupedEvents(): PortfolioNotableEventsByType {
  return {
    "Event Hosting": [],
    "Sessions & Workshops": [],
    "Brand Collaboration": [],
    "Corporate Shows": [],
  };
}

export function isPortfolioType(value: string | null | undefined): value is PortfolioType {
  return PORTFOLIO_TYPES.includes(value as PortfolioType);
}

export function portfolioTypeToSlug(type: PortfolioType) {
  return slugifyTitle(type);
}

export function portfolioSlugToType(slug: string) {
  return PORTFOLIO_TYPES.find((type) => portfolioTypeToSlug(type) === slug) ?? null;
}

export function portfolioTypeHref(type: PortfolioType) {
  return `/categories/${portfolioTypeToSlug(type)}`;
}

function getDateTime(value: string) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function formatDateLabel(value: string) {
  const time = getDateTime(value);
  if (!time) return value;
  return dateFormatter.format(new Date(time));
}

function normalizeNotableEvent(
  event: NotableEventApi
): PortfolioNotableEvent | null {
  const type = event.type?.trim();
  const title = event.title?.trim();
  const image = event.imageLink?.trim();
  const dateISO = event.date?.trim() ?? "";
  const description =
    event.description?.trim() || "Details for this event will be shared soon.";

  if (!isPortfolioType(type) || !title || !image) {
    return null;
  }

  return {
    id: event._id?.trim() || `${type}-${title}-${dateISO}`,
    type,
    title,
    description,
    dateISO,
    dateLabel: formatDateLabel(dateISO),
    image,
    alt: title,
  };
}

export async function fetchPortfolioNotableEvents(): Promise<PortfolioNotableEventsByType> {
  const grouped = createEmptyGroupedEvents();

  try {
    const res = await fetch(apiList.notableEvents.list, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to load portfolio notable events", await res.text());
      return grouped;
    }

    const json = await res.json();
    const apiEvents: NotableEventApi[] = Array.isArray(json.events) ? json.events : [];

    for (const apiEvent of apiEvents) {
      const event = normalizeNotableEvent(apiEvent);
      if (!event) continue;
      grouped[event.type].push(event);
    }

    for (const type of PORTFOLIO_TYPES) {
      grouped[type].sort((a, b) => {
        const byDate = getDateTime(b.dateISO) - getDateTime(a.dateISO);
        if (byDate !== 0) return byDate;
        return a.title.localeCompare(b.title);
      });
    }

    return grouped;
  } catch (error) {
    console.error("Error loading portfolio notable events", error);
    return grouped;
  }
}
