import type { Metadata } from "next";
import UpcomingEvents from "../allEvents/components/upcomingEvents";
import PastEvents from "../allEvents/components/pastEvents";
import { createPageMetadata } from "../lib/siteSeo";

export const metadata: Metadata = createPageMetadata({
  title: "Upcoming and Past Events | Rafsan Sabab",
  description: "See upcoming appearances and selected past events hosted or presented by Rafsan Sabab.",
  path: "/events",
  keywords: ["Rafsan Sabab events", "upcoming events Bangladesh", "event tickets"],
});

export default async function EventsPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <h1 className="sr-only">Rafsan Sabab Events</h1>
      <UpcomingEvents />
      <PastEvents />
    </div>
  );
}
