"use client";
import Image from "next/image";
import Link from "next/link";
import { EventDoc } from "@/app/types/events";

export default function EventCard({ ev }: { ev: EventDoc }) {
  return (
    <Link
      href={`/event-reg/${ev.slug}`}
      className="block rounded-2xl overflow-hidden bg-[#171717] ring-1 ring-white/10 hover:ring-white/20 transition"
    >
      <div className="relative h-44">
        <Image
          src={ev.cardImage || ev.bannerImage || "/assets/reg.png"}
          alt={ev.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) calc(100vw - 2rem), 33vw"
        />
      </div>
      <div className="p-4 text-white">
        <h3 className="recoleta text-lg font-semibold">{ev.title}</h3>
        {ev.shortBlurb && (
          <p className="elza mt-1 line-clamp-2 text-sm text-white/75">
            {ev.shortBlurb}
          </p>
        )}
        {Array.isArray(ev.date) && ev.date.length > 0 && (
          <p className="elza mt-2 text-xs text-white/60">
            {new Date(ev.date[0]).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {ev.date.length > 1 ? ` · +${ev.date.length - 1} more` : ""}
          </p>
        )}
      </div>
    </Link>
  );
}
