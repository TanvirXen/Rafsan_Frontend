// app/allEvents/components/upcomingEvents.tsx
import EventsSection from "./EventsSection";
import { buildUpcoming, fetchAllEvents } from "@/app/lib/events";

export const revalidate = 15;

type UpcomingProps = {
  showFilter?: string;
};

export default async function UpcomingEvents({ showFilter }: UpcomingProps) {
  // A failed or slow API call must not crash the page (or the whole build
  // while pre-rendering), so fall back to an empty list.
  const all = await fetchAllEvents(200).catch((err) => {
    console.error("Failed to load events", err);
    return [];
  });

  const filtered = showFilter
    ? all.filter((ev) => {
        const needle = showFilter.toLowerCase();
        const title = (ev.title ?? "").toLowerCase();
        const slug = (ev.slug ?? "").toLowerCase();
        return title.includes(needle) || slug === needle;
      })
    : all;

  const upcoming = buildUpcoming(filtered).slice(0, 8);

  return (
    <EventsSection
      title={showFilter ? `${showFilter} Events` : "Upcoming Events"}
      events={upcoming}
      divider
    />
  );
}
