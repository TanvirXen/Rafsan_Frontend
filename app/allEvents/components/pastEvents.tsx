// app/shows/PastEvents.tsx (Server Component)
import EventsSection from "./EventsSection";
import { buildPast, fetchAllEvents } from "@/app/lib/events";

export const revalidate = 60; // segment-level fallback

export default async function PastEvents() {
  const all = await fetchAllEvents(200);
  const past = buildPast(all).slice(0, 8);
  return <EventsSection title="Past Events" events={past} divider />;
}
