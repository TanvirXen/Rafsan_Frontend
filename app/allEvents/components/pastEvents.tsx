// app/allEvents/components/pastEvents.tsx (Server Component)
import EventsSection from "./EventsSection";
import { buildPast, fetchAllEvents } from "@/app/lib/events";

export const revalidate = 15; // short ISR window keeps CMS edits timely

type PastProps = {
  showFilter?: string;
};

export default async function PastEvents({ showFilter }: PastProps) {
  const all = await fetchAllEvents(200);

  const filtered = showFilter
    ? all.filter((ev) => {
        const needle = showFilter.toLowerCase();
        const title = (ev.title ?? "").toLowerCase();
        const slug = (ev.slug ?? "").toLowerCase();
        return title.includes(needle) || slug === needle;
      })
    : all;

  const past = buildPast(filtered).slice(0, 8);

  if (past.length === 0) return null;

  return (
    <EventsSection
      title={showFilter ? `Past Events – ${showFilter}` : "Past Events"}
      events={past}
      divider
    />
  );
}
