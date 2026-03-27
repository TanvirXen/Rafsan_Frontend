/* eslint-disable @typescript-eslint/no-explicit-any */
import apiList, { withQuery } from "@/apiList";

export type ApiOccurrence = { date: string; season?: number; episode?: number };

export type ApiEvent = {
  _id: string;
  slug: string;
  title: string;
  date: string[];              // legacy (still filled)
  occurrences?: ApiOccurrence[]; // NEW (preferred)
  venue: string;
  type: "Free" | "Free_with_approval" | "Paid" | "Paid_with_approval";
  description?: string;
  imageLinkBg?: string;
  imageLinkOverlay?: string;
  category?: string;
  brands?: any[];
  createdAt: string;
  updatedAt: string;
};

type EventsResponse = {
  events: ApiEvent[];
  pagination: { total: number; page: number; pages: number; limit: number };
};

export type EventItem = {
  id: string;
  title: string;
  date: string;   // e.g., "November 22, 2025 — S2E5"
  img: string;
  href: string;   // /event-reg/<slugOrId>--YYYY-MM-DD
};

export function formatDate(d: Date) {
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const year = d.getUTCFullYear();
  const suffix = (n: number) => (n > 3 && n < 21) ? "th" : (["th","st","nd","rd"][(n % 10)] || "th");
  return `${month} ${day}${suffix(day)}, ${year}`;
}

async function fetchEventsPage(page = 1, limit = 50): Promise<EventsResponse> {
  const url = withQuery(apiList.events.list, { page, limit });
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Events fetch failed: HTTP ${res.status}`);
  return (await res.json()) as EventsResponse;
}

export async function fetchAllEvents(maxTotal = 200): Promise<ApiEvent[]> {
  const out: ApiEvent[] = [];
  let page = 1;
  const limit = 50;
  while (out.length < maxTotal) {
    const data = await fetchEventsPage(page, limit);
    out.push(...data.events);
    if (page >= data.pagination.pages) break;
    page += 1;
  }
  return out;
}

const dateToken = (iso: string) => {
  try { return new Date(iso).toISOString().slice(0,10); } catch { return iso.slice(0,10); }
};

function pickImg(ev: ApiEvent) {
  return ev.imageLinkBg?.trim() || ev.imageLinkOverlay?.trim() || "/assets/exp1.jpg";
}

function labelWithSE(base: string, occ?: ApiOccurrence) {
  if (!occ) return base;
  const parts: string[] = [base];
  if (occ.season) parts.push(`S${occ.season}`);
  if (occ.episode) parts.push(`E${occ.episode}`);
  return parts.length > 1 ? `${base} — ${parts.slice(1).join("")}` : base;
}

/** Flatten FUTURE occurrences to cards, sorted by soonest */
export function buildUpcoming(events: ApiEvent[], now = new Date()): EventItem[] {
  const rows: { item: EventItem; t: number }[] = [];
  const nowISO = now.toISOString();

  for (const ev of events) {
    const occs: ApiOccurrence[] =
      (ev.occurrences && ev.occurrences.length)
        ? ev.occurrences
        : (ev.date || []).map(d => ({ date: d }));

    for (const occ of occs) {
      if (!occ?.date || occ.date < nowISO) continue;
      const d = new Date(occ.date);
      if (Number.isNaN(d.getTime())) continue;

      const baseDateStr = formatDate(d);
      const label = labelWithSE(baseDateStr, occ);
      const img = pickImg(ev);
      const slugOrId = ev.slug || ev._id;
      const href = `/event-reg/${encodeURIComponent(`${slugOrId}--${dateToken(occ.date)}`)}`;

      rows.push({
        item: { id: `${ev._id}:${occ.date}`, title: ev.title, date: label, img, href },
        t: d.getTime(),
      });
    }
  }

  rows.sort((a, b) => a.t - b.t);
  return rows.map(r => r.item);
}

/** Flatten PAST occurrences to cards, sorted by most recent first */
export function buildPast(events: ApiEvent[], now = new Date()): EventItem[] {
  const rows: { item: EventItem; t: number }[] = [];
  const nowISO = now.toISOString();

  for (const ev of events) {
    const occs: ApiOccurrence[] =
      (ev.occurrences && ev.occurrences.length)
        ? ev.occurrences
        : (ev.date || []).map(d => ({ date: d }));

    for (const occ of occs) {
      if (!occ?.date || occ.date >= nowISO) continue;
      const d = new Date(occ.date);
      if (Number.isNaN(d.getTime())) continue;

      const baseDateStr = formatDate(d);
      const label = labelWithSE(baseDateStr, occ);
      const img = pickImg(ev);
      const slugOrId = ev.slug || ev._id;
      const href = `/event-reg/${encodeURIComponent(`${slugOrId}--${dateToken(occ.date)}`)}`;

      rows.push({
        item: { id: `${ev._id}:${occ.date}`, title: ev.title, date: label, img, href },
        t: d.getTime(),
      });
    }
  }

  rows.sort((a, b) => b.t - a.t);
  return rows.map(r => r.item);
}
