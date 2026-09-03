import UpcomingEvents from "../allEvents/components/upcomingEvents";
import PastEvents from "../allEvents/components/pastEvents";

export default async function EventsPage() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <UpcomingEvents />
      <PastEvents />
    </div>
  );
}
