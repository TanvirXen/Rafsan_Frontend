/* eslint-disable @typescript-eslint/no-explicit-any */
// app/event-reg/page.tsx
import EventRegClient from "./components/EventRegClient";
import apiList from "@/apiList";
import { pickEventCardImage } from "@/app/lib/eventImages";

export const revalidate = 15;

type ApiEvent = {
  _id: string;
  slug?: string;
  title: string;
  category?: string;
  date?: string[]; // ISO[]
  bannerImage?: string;
  cardImage?: string;
  imageLinkBg?: string;
  imageLinkOverlay?: string;
  backgroundImage?: string;
  shortBlurb?: string;
  longBlurb?: string;
  venue?: string;
  city?: string;
  country?: string;
  brands?: Array<Record<string, any>>;
};

type EventsResponse = { events?: ApiEvent[] };

const isNonEmptyStr = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

function pickFirst<T>(...vals: Array<T | undefined | null>): T | undefined {
  for (const v of vals) {
    if (isNonEmptyStr(v)) return v as any;
    if (v) return v as any;
  }
  return undefined;
}

export default async function EventRegIndexPage() {
  // Stable timestamp captured once for this request
  const nowISO = new Date().toISOString();

  let all: ApiEvent[] = [];
  try {
    const res = await fetch(apiList.events.list, { next: { revalidate } });
    if (res.ok) {
      const data = (await res.json()) as EventsResponse;
      all = Array.isArray(data.events) ? data.events : [];
    }
  } catch {
    // soft-fail: all remains []
  }

  // ---- Flatten into occurrences (one card per FUTURE date) ----
  const occurrences = all
    .flatMap((ev) => {
      const img = pickEventCardImage(ev);

      const blurb =
        pickFirst(ev.longBlurb, ev.shortBlurb) ||
        "Grab the chances to watch my upcoming shows!";

      // De-dupe & keep all dates
      const validDates = Array.from(new Set(ev.date || [])).filter(
        (iso) => typeof iso === "string" && iso.trim().length > 0
      );

      return validDates.map((iso) => ({
        id: `${ev._id}:${iso}`, // unique per occurrence
        eventId: ev._id,
        slug: ev.slug,
        title: ev.title,
        dateISO: iso,
        img,
        blurb,
        venue: ev.venue,
        city: ev.city,
        country: ev.country,
        brands: ev.brands ?? [],
      }));
    })
    .filter(Boolean);

  // Sort: upcoming occurrences first (ascending), followed by past occurrences (descending)
  occurrences.sort((a, b) => {
    const aUpcoming = a.dateISO >= nowISO;
    const bUpcoming = b.dateISO >= nowISO;
    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;
    if (aUpcoming && bUpcoming) {
      return a.dateISO < b.dateISO ? -1 : a.dateISO > b.dateISO ? 1 : 0;
    } else {
      return a.dateISO > b.dateISO ? -1 : a.dateISO < b.dateISO ? 1 : 0;
    }
  });

  if (occurrences.length === 0) {
    return (
      <div className="min-h-[50vh] grid place-items-center bg-[#121212] text-white">
        <div className="text-center">
          <p className="text-xl">No events yet.</p>
          <p className="text-white/70 mt-1">Please check back soon!</p>
        </div>
      </div>
    );
  }

  return <EventRegClient occurrences={occurrences} />;
}
