/* eslint-disable @typescript-eslint/no-explicit-any */
// app/event-reg/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import apiList, { withQuery } from "@/apiList";
import { pickEventBannerAssets } from "@/app/lib/eventImages";
import RegBanner from "../components/regBanner";
import EventDetailsSection from "../components/eventDetails";
import Collaboration from "../components/collaboration";
import Newsletter from "@/app/section/newsletter";
import {
  SITE_DESCRIPTION,
  SITE_META_IMAGE,
  WHAT_A_SHOW_DESCRIPTION,
  WHAT_A_SHOW_META_IMAGE,
  buildBreadcrumbJsonLd,
} from "@/app/lib/siteSeo";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamicParams = true;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const event = await fetchEventBySlugOrId(slug);
    const isWhatAShow = /what\s*a\s*show/i.test(event?.title || event?.category || "");
    const image = isWhatAShow ? WHAT_A_SHOW_META_IMAGE : SITE_META_IMAGE;
    const title = `${event?.title || "Event Registration"} | Rafsan Sabab`;
    return {
      title: { absolute: title },
      description: isWhatAShow ? WHAT_A_SHOW_DESCRIPTION : SITE_DESCRIPTION,
      alternates: { canonical: `/event-reg/${encodeURIComponent(slug)}` },
      openGraph: { title, description: isWhatAShow ? WHAT_A_SHOW_DESCRIPTION : SITE_DESCRIPTION, images: [{ url: image }] },
      twitter: { card: "summary_large_image", title, description: isWhatAShow ? WHAT_A_SHOW_DESCRIPTION : SITE_DESCRIPTION, images: [image] },
    };
  } catch {
    return { title: { absolute: "Event Registration | Rafsan Sabab" }, description: SITE_DESCRIPTION, robots: { index: false, follow: true } };
  }
}

/* ---------------- types ---------------- */
type BrandDoc = {
  _id: string;
  brandName?: string; // populated on server
  imageLink?: string; // populated on server
  externalLink?: string; // populated on server
  // fallbacks (older fields)
  name?: string;
  logo?: string;
  logoUrl?: string;
  image?: string;
  imageUrl?: string;
  icon?: string;
  photo?: string;
};

type Occurrence = { date: string; season?: number; episode?: number; image?: string };

type EventDoc = {
  _id: string;
  slug?: string;
  title: string;
  category?: string;
  occurrences?: Occurrence[];
  date?: string[];
  venue?: string;
  city?: string;
  country?: string;
  bannerImage?: string;
  cardImage?: string;
  imageLinkBg?: string;
  imageLinkOverlay?: string;
  backgroundImage?: string;
  shortBlurb?: string;
  longBlurb?: string;
  brands?: BrandDoc[];
  customFields?: Array<{
    id?: string;
    name: string;
    label: string;
    type: "text" | "email" | "phone" | "number" | "select" | "textarea" | "image";
    required?: boolean;
    options?: string[];
  }>;
  notes?: string[];
  ticketUrl?: string;
};
const TZ = "Asia/Dhaka";
function dateOnlyInTz(iso: string, tz = TZ) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-CA", { timeZone: tz }); // YYYY-MM-DD
}
/* ---------------- utils ---------------- */
const isNE = (v?: string | null): v is string =>
  typeof v === "string" && v.trim().length > 0;

const isMongoId = (s: string) => /^[0-9a-fA-F]{24}$/.test(s);

function pickFirst<T>(...vals: Array<T | undefined | null>): T | undefined {
  for (const v of vals) {
    if (typeof v === "string" && (v as string).trim().length) return v as any;
    if (v) return v as any;
  }
  return undefined;
}

function toDatePill(iso: string, tz = TZ) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    timeZone: tz, // ✅
  });
}
function readableDate(iso?: string, tz = TZ) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: tz, // ✅
  });
}
function readableTime(iso?: string, tz = TZ) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz, // ✅
  });
}
const toVenueLine = (ev: EventDoc) =>
  [ev.venue, ev.city, ev.country].filter(Boolean).join(", ");

/** clickable logo entries (with href) and robust src fallbacks */
const brandToLogo = (b: BrandDoc) => {
  const src = pickFirst(
    b.imageLink,
    b.logo,
    b.logoUrl,
    b.imageUrl,
    b.image,
    b.icon,
    b.photo
  ) as string | undefined;
  if (!src) return undefined;
  return {
    src,
    alt: b.brandName || b.name || "Partner",
    shape: "circle" as const,
    href: isNE(b.externalLink) ? b.externalLink : undefined,
  };
};

function normalizeOccurrences(ev: EventDoc): Occurrence[] {
  if (Array.isArray(ev.occurrences) && ev.occurrences.length)
    return ev.occurrences.filter(Boolean);
  const dates = Array.isArray(ev.date) ? ev.date.filter(Boolean) : [];
  return dates.map((d) => ({ date: d }));
}
function splitKey(raw: string): { key: string; token?: string } {
  const decoded = decodeURIComponent(raw);
  const idx = decoded.lastIndexOf("--");
  if (idx === -1) return { key: decoded };
  const key = decoded.slice(0, idx);
  const rest = decoded.slice(idx + 2);
  const token = /^\d{4}-\d{2}-\d{2}/.test(rest) ? rest.slice(0, 10) : undefined;
  return { key: key || decoded, token };
}
function chooseOccurrence(
  ev: EventDoc,
  token?: string
): Occurrence | undefined {
  const occs = normalizeOccurrences(ev);
  if (!occs.length) return undefined;
  if (isNE(token)) {
    const exact = occs.find((o) => dateOnlyInTz(o.date) === token); // ✅ BD-local day
    if (exact) return exact;
  }
  const now = new Date();
  const future = occs
    .filter((o) => new Date(o.date).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return future[0] || occs[0];
}

/* ---------------- data fetching ---------------- */
async function fetchEventBySlugOrId(key: string): Promise<EventDoc | null> {
  try {
    const url = withQuery(apiList.events.list, {
      slug: key,
      limit: 5,
      _: Date.now(),
    });
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const arr = Array.isArray(json?.events)
        ? (json.events as EventDoc[])
        : [];
      const exact = arr.find(
        (e) => isNE(e.slug) && e.slug!.toLowerCase() === key.toLowerCase()
      );
      if (exact) return exact;
      if (arr.length === 1) return arr[0];
    }
  } catch {}
  if (isMongoId(key)) {
    try {
      const res = await fetch(apiList.events.get(key), { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        return (json?.event as EventDoc) ?? null;
      }
    } catch {}
  }
  return null;
}

/* ---------------- page ---------------- */
export default async function Page(props: {
  params: Promise<{ slug?: string }>;
}) {
  const { slug: raw } = await props.params;

  if (!isNE(raw)) {
    notFound();
  }

  const { key, token } = splitKey(raw);
  const ev = await fetchEventBySlugOrId(key);
  if (!ev) {
    notFound();
  }

  const occ = chooseOccurrence(ev, token);
  const selectedISO = occ?.date;

  // --- pills: split date and season/episode into two separate pills
  const datePill = selectedISO ? toDatePill(selectedISO) : "";
  const sePill =
    typeof occ?.season === "number" && typeof occ?.episode === "number"
      ? `S${occ.season}E${occ.episode}`
      : typeof occ?.season === "number"
      ? `S${occ.season}`
      : typeof occ?.episode === "number"
      ? `E${occ.episode}`
      : "";

  const title = ev.title || "What A Show";
  const blurb =
    pickFirst(ev.longBlurb, ev.shortBlurb) ||
    "Grab the chances to watch my upcoming shows!";

  const { posterSrc, bgSrc } = pickEventBannerAssets(ev, "/assets/reg.png", occ);

  const ctaHref = isNE(ev.ticketUrl) ? ev.ticketUrl : undefined;
  const venueLine = toVenueLine(ev);
  const notes =
    Array.isArray(ev.notes) && ev.notes.length ? ev.notes : undefined;

  // clickable, centered-ready logos
  const logos = Array.isArray(ev.brands)
    ? ev.brands.map(brandToLogo).filter(Boolean)
    : undefined;

  const primaryDateLabel = selectedISO
    ? `${readableDate(selectedISO) ?? ""}${
        typeof occ?.season === "number" && typeof occ?.episode === "number"
          ? ""
          : "" // keep title clean; pills handle S/E
      }`
    : undefined;

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description: blurb,
    url: `https://www.rafsansabab.com/event-reg/${encodeURIComponent(raw)}`,
    image: [bgSrc, posterSrc].filter(Boolean),
    startDate: selectedISO,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: venueLine || "Bangladesh",
      address: venueLine || "Bangladesh",
    },
    performer: { "@type": "Person", name: "Rafsan Sabab" },
    organizer: { "@type": "Person", name: "Rafsan Sabab" },
    ...(ctaHref ? { offers: { "@type": "Offer", url: ctaHref, availability: "https://schema.org/InStock" } } : {}),
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: title, path: `/event-reg/${raw}` },
  ]);

  const nowMs = new Date().getTime();
  const availableDates = (normalizeOccurrences(ev) || []).map((o) => {
    let ended = false;
    try {
      ended = new Date(o.date).getTime() < nowMs;
    } catch {}
    return {
      iso: o.date,
      label: `${readableDate(o.date) ?? ""} - ${readableTime(o.date) ?? ""}`,
      ended,
    };
  });

  return (
    <div className='bg-[#121212]'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <h1 className='sr-only'>{title} Event Registration</h1>
      <RegBanner
        title={title}
        dates={[datePill, sePill].filter(Boolean)} // ✅ separate pills
        blurb={blurb}
        posterSrc={posterSrc} // ✅ overlay-first for card
        bgSrc={bgSrc} // ✅ bg-first for background (prop expected by your component)
        ctaHref={ctaHref}
      />

      <EventDetailsSection
        eventId={ev._id}
        eventDateISO={selectedISO}
        primaryDate={primaryDateLabel}
        timeText={readableTime(selectedISO)} // ✅ pinned to BD
        venue={venueLine || undefined}
        notes={notes}
        customFields={ev.customFields ?? []}
        availableDates={availableDates}
      />

      <Collaboration logos={logos as any} />
      <Newsletter />
    </div>
  );
}
