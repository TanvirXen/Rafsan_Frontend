"use client";
import { useRef } from "react";
import { EventDoc } from "@/app/types/events";
import EventCard from "./EventCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function EventsRail({ events, title = "All Events" }: {
  events: EventDoc[];
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dx: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dx, behavior: "smooth" });
  };

  return (
    <section className="site-shell">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="recoleta text-2xl text-white md:text-3xl">{title}</h2>
        <div className="flex gap-2">
          <button
            className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => scrollBy(-420)}
            aria-label="Previous"
          >
            <ChevronLeft className="mx-auto mt-2" size={18} />
          </button>
          <button
            className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => scrollBy(+420)}
            aria-label="Next"
          >
            <ChevronRight className="mx-auto mt-2" size={18} />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none]"
      >
        {events.map((ev) => (
          <div key={ev._id} className="snap-start shrink-0 w-[300px]">
            <EventCard ev={ev} />
          </div>
        ))}
      </div>
    </section>
  );
}
