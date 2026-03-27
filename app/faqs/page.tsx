// app/faq/page.tsx
"use client";

import React from "react";
import Link from "next/link";

type FAQ = {
  q: string;
  a: React.ReactNode;
  tag: "General" | "Shows" | "Booking" | "Media";
};

const FAQS: FAQ[] = [
  {
    tag: "General",
    q: "Who is Rafsan Sabab?",
    a: (
      <>
        Rafsan Sabab is a host, content creator, and storyteller known for live
        shows, podcasts, and stage events. This site is the official hub for
        shows, episodes, tickets, and updates.
      </>
    ),
  },
  {
    tag: "General",
    q: "Where can I watch the episodes?",
    a: (
      <>
        Most episodes are published on YouTube. You can visit the{" "}
        <Link
          href="https://www.youtube.com/@WHATASHOW_OFFICIAL"
          className="text-[#00D8FF] underline underline-offset-4"
          target="_blank"
        >
          official channel
        </Link>{" "}
        or browse the Shows page here.
      </>
    ),
  },
  {
    tag: "Shows",
    q: "How do I find events for a specific show?",
    a: (
      <>
        Open a show page and hit <b>Get Tickets</b>. You’ll be taken to All
        Events with the show already filtered.
      </>
    ),
  },
  {
    tag: "Shows",
    q: "Do you announce upcoming shows in advance?",
    a: (
      <>
        Yes—upcoming events are listed in All Events. Major announcements also
        appear on social pages and the show banners.
      </>
    ),
  },
  {
    tag: "Shows",
    q: "Are tickets refundable?",
    a: (
      <>
        Refund policies depend on the event organizer/venue and are shown on the
        event registration page. If you’re unsure, contact the organizer listed
        on the ticket page.
      </>
    ),
  },
  {
    tag: "Shows",
    q: "Can I attend with friends or in a group?",
    a: (
      <>
        Absolutely. If an event has group/limited seating rules, you’ll see it
        in the event details and rules section.
      </>
    ),
  },
  {
    tag: "Booking",
    q: "How can I book Rafsan for a corporate event or live show?",
    a: (
      <>
        Go to{" "}
        <Link
          href="/connect"
          className="text-[#00D8FF] underline underline-offset-4"
        >
          Connect
        </Link>{" "}
        and send your event details (date, venue/city, audience size, and event
        type). The team will respond with availability and next steps.
      </>
    ),
  },
  {
    tag: "Booking",
    q: "What information should I include in a booking request?",
    a: (
      <>
        Please include: event type (corporate, campus, brand activation),
        preferred date/time, city/venue, expected audience size, event duration,
        and your contact details.
      </>
    ),
  },
  {
    tag: "Booking",
    q: "How early should I book?",
    a: (
      <>
        For best chances, book 2–4 weeks in advance. For large venues or peak
        seasons, earlier is better.
      </>
    ),
  },
  {
    tag: "Booking",
    q: "Does Rafsan host in Bangla, English, or both?",
    a: (
      <>
        Depending on the event and audience, hosting can be in Bangla, English,
        or a mix. Mention your preference in the booking message.
      </>
    ),
  },
  {
    tag: "Media",
    q: "Can I collaborate or invite Rafsan for a podcast/interview?",
    a: (
      <>
        Yes. Use the{" "}
        <Link
          href="/connect"
          className="text-[#00D8FF] underline underline-offset-4"
        >
          Connect
        </Link>{" "}
        page and select “Collaboration/Media” in your message subject (or write
        it clearly at the start).
      </>
    ),
  },
  {
    tag: "Media",
    q: "Can I use clips/photos from the show?",
    a: (
      <>
        For official footage, branding, and re-uploads, please request permission
        first. For press use, include where it will be published and the usage
        timeline.
      </>
    ),
  },
];

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function FAQPage() {
  const [q, setQ] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<
    "All" | FAQ["tag"]
  >("All");

  const tags: Array<"All" | FAQ["tag"]> = ["All", "General", "Shows", "Booking", "Media"];

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return FAQS.filter((item) => {
      const tagOk = activeTag === "All" ? true : item.tag === activeTag;
      const textOk =
        needle.length === 0
          ? true
          : item.q.toLowerCase().includes(needle) ||
            String(item.a).toLowerCase().includes(needle);
      return tagOk && textOk;
    });
  }, [q, activeTag]);

  return (
    <main className="min-h-screen bg-[#0B0B0E] text-white">
      {/* HERO (matches your site vibe) */}
      <section
        className="
          relative isolate w-full overflow-hidden
          h-[calc(100svh-64px)] min-h-[520px]
          lg:h-[520px]
        "
      >
        {/* Background */}
        <div
          className="
            absolute inset-0 -z-10
            bg-[radial-gradient(55%_60%_at_55%_30%,rgba(0,216,255,.16)_0%,rgba(0,0,0,0)_55%),radial-gradient(45%_50%_at_20%_20%,rgba(153,0,255,.16)_0%,rgba(0,0,0,0)_55%),linear-gradient(180deg,#121212_0%,#0B0B0E_100%)]
          "
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.20)_0%,rgba(0,0,0,.55)_70%,rgba(0,0,0,.80)_100%)]" />

        <div className="site-shell relative z-10 flex h-full flex-col justify-end pb-10 lg:justify-center lg:pb-0">
          <div className="box-border flex items-center gap-[10px] border-l-4 border-[#00D8FF] pl-[20px] h-[32px] md:h-[48px]">
            <h1 className="recoleta font-bold text-white text-[26px] leading-[26px] md:text-[44px] md:leading-[48px]">
              FAQ
            </h1>
          </div>

          <p className="elza mt-4 max-w-[720px] text-white/80 text-[13px] leading-5 md:text-[16px] md:leading-6">
            Quick answers about shows, tickets, bookings, and collaborations. If
            you don’t find what you need, send a message from the Connect page.
          </p>

          {/* Search + tags */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="w-full md:max-w-[520px]">
              <label className="sr-only">Search FAQs</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search questions…"
                className="
                  w-full rounded-full bg-white/10 px-4 py-2.5
                  elza text-[14px] text-white placeholder:text-white/50
                  ring-1 ring-white/15 focus:outline-none focus:ring-2 focus:ring-[#00D8FF]
                "
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((t) => {
                const active = t === activeTag;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTag(t)}
                    className={clsx(
                      "rounded-full px-4 py-2 elza text-[13px] font-bold ring-1 transition",
                      active
                        ? "bg-[#00D8FF] text-[#121212] ring-[#00D8FF]"
                        : "bg-white/5 text-white ring-white/15 hover:bg-white/10"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10" />
      </section>

      {/* FAQ LIST */}
      <section className="bg-[#0B0B0E] py-8 sm:py-10 md:py-14">
        <div className="site-shell mx-auto w-full max-w-6xl">
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <p className="elza text-white/75 text-[14px]">
                No results found. Try a different keyword.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item, idx) => (
                <details
                  key={`${item.tag}-${idx}`}
                  className="
                    group rounded-2xl bg-white/5 ring-1 ring-white/10
                    open:bg-white/7.5
                    transition
                  "
                >
                  <summary
                    className="
                      cursor-pointer list-none
                      px-5 py-4 md:px-6 md:py-5
                      flex items-start gap-3
                    "
                  >
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00D8FF]/15 ring-1 ring-[#00D8FF]/30">
                      <span className="h-2 w-2 rounded-full bg-[#00D8FF]" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="recoleta text-[16px] md:text-[18px] font-bold leading-snug">
                          {item.q}
                        </p>
                        <span className="elza hidden sm:inline-flex rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-bold text-white/80 ring-1 ring-white/10">
                          {item.tag}
                        </span>
                      </div>

                      <div className="mt-3 elza text-[13px] md:text-[14px] leading-6 text-white/80">
                        {item.a}
                      </div>
                    </div>

                    <span
                      className="
                        mt-1 select-none text-white/70
                        group-open:rotate-45 transition-transform
                        text-[18px] leading-none
                      "
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                </details>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 rounded-2xl bg-[linear-gradient(90deg,rgba(0,216,255,.14)_0%,rgba(153,0,255,.10)_55%,rgba(255,255,255,.06)_100%)] p-6 ring-1 ring-white/10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="recoleta text-[18px] md:text-[20px] font-bold">
                  Still have a question?
                </p>
                <p className="elza text-[13px] md:text-[14px] text-white/75">
                  Send your query and we’ll get back with details.
                </p>
              </div>

              <Link
                href="/connect"
                className="
                  inline-flex items-center justify-center rounded-full
                  bg-[#00D8FF] px-6 py-3 elza font-bold text-[#121212]
                  hover:brightness-95
                "
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
