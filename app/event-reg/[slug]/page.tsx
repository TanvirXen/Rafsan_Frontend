/* eslint-disable @typescript-eslint/no-explicit-any */
// app/event-reg/[slug]/page.tsx
import apiList, { withQuery } from "@/apiList";
import RegBanner from "../components/regBanner";
import EventDetailsSection from "../components/eventDetails";
import Collaboration from "../components/collaboration";
import Newsletter from "@/app/section/newsletter";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamicParams = true;

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

type Occurrence = { date: string; season?: number; episode?: number };

type EventDoc = {
  _id: string;
  slug?: string;
  title: string;
  occurrences?: Occurrence[];
  date?: string[];
  venue?: string;
  city?: string;
  country?: string;
  bannerImage?: string;
  cardImage?: string;
  imageLinkBg?: string;
  imageLinkOverlay?: string;
  shortBlurb?: string;
  longBlurb?: string;
  brands?: BrandDoc[];
  customFields?: Array<{
    id?: string;
    name: string;
    label: string;
    type: "text" | "email" | "phone" | "number" | "select" | "textarea";
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

const dateOnly = (iso: string) => {
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return iso.slice(0, 10);
  }
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
    return (
      <div className='min-h-[50vh] grid place-items-center bg-[#121212] text-white p-6'>
        <p className='text-xl font-semibold'>Invalid URL.</p>
        <p className='opacity-80 mt-2'>No slug or id was provided.</p>
      </div>
    );
  }

  const { key, token } = splitKey(raw);
  const ev = await fetchEventBySlugOrId(key);
  if (!ev) {
    return (
      <div className='min-h-[50vh] grid place-items-center bg-[#121212] text-white p-6'>
        <p className='text-xl font-semibold'>
          We couldn’t find an event for “{key}”.
        </p>
        <p className='opacity-80 mt-2'>Please check the URL or try again.</p>
      </div>
    );
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

  // --- DIFFERENT IMAGES ---
  // Card/foreground image: overlay-first
  const posterSrc =
    pickFirst(
      ev.imageLinkOverlay,
      ev.cardImage,
      ev.bannerImage,
      ev.imageLinkBg
    ) || "/assets/reg.png";
  // Background image: bg-first (kept separate from poster)
  const bgSrc =
    pickFirst(ev.imageLinkBg, ev.bannerImage, ev.cardImage) || posterSrc;

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

  return (
    <div className='bg-[#121212]'>
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
      />

      <Collaboration logos={logos as any} />
      <Newsletter />
    </div>
  );
}
