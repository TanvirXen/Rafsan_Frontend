// app/allEvents/components/upcomingEvents.tsx
import EventsSection from "./EventsSection";
import { buildUpcoming, fetchAllEvents } from "@/app/lib/events";

export const revalidate = 60;

type UpcomingProps = {
  showFilter?: string;
};

export default async function UpcomingEvents({ showFilter }: UpcomingProps) {
  const all = await fetchAllEvents(200);

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
      title={showFilter ? `Upcoming – ${showFilter}` : "Upcoming Events"}
      events={upcoming}
      divider
    />
  );
}
