import apiList, { withQuery } from "../../apiList";
import EventsRail from "./components/EventsRail";
import EventCard from "./components/EventCard";
import { EventDoc } from "@/app/types/events";

async function fetchEvents(): Promise<EventDoc[]> {
  const res = await fetch(apiList.events.list, { cache: "no-store" });
  const data = await res.json();
  // adapt if your API returns {events: [...]}
  return (data.events ?? data) as EventDoc[];
}

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Top hero rail like your screenshot */}
      <div className="pt-8 sm:pt-10">
        <EventsRail events={events} title="Upcoming & Featured" />
      </div>

      {/* Grid below */}
      <section className="site-shell mt-10 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <EventCard key={ev._id} ev={ev} />
          ))}
        </div>
      </section>
    </div>
  );
}
