"use client";

import Link from "next/link";
import React from "react";
import { FAQ_ITEMS, type FAQTag } from "./faqData";

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function FAQPage() {
  const [q, setQ] = React.useState("");
  const [activeTag, setActiveTag] = React.useState<"All" | FAQTag>("All");

  const tags: Array<"All" | FAQTag> = [
    "All",
    "General",
    "Shows",
    "Booking",
    "Media",
  ];

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const tagOk = activeTag === "All" ? true : item.tag === activeTag;
      const textOk =
        needle.length === 0
          ? true
          : item.search.toLowerCase().includes(needle) ||
            item.q.toLowerCase().includes(needle);
      return tagOk && textOk;
    });
  }, [q, activeTag]);

  return (
    <main className="min-h-screen bg-[#0B0B0E] text-white">
      <section
        className="
          relative isolate w-full overflow-hidden
          h-[calc(100svh-64px)] min-h-[520px]
          lg:h-[520px]
        "
      >
        <div
          className="
            absolute inset-0 -z-10
            bg-[radial-gradient(55%_60%_at_55%_30%,rgba(0,216,255,.16)_0%,rgba(0,0,0,0)_55%),radial-gradient(45%_50%_at_20%_20%,rgba(153,0,255,.16)_0%,rgba(0,0,0,0)_55%),linear-gradient(180deg,#121212_0%,#0B0B0E_100%)]
          "
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.20)_0%,rgba(0,0,0,.55)_70%,rgba(0,0,0,.80)_100%)]" />

        <div className="site-shell relative z-10 flex h-full flex-col justify-end pb-10 lg:justify-center lg:pb-0">
          <div className="box-border flex h-[32px] items-center gap-[10px] border-l-4 border-[#00D8FF] pl-[20px] md:h-[48px]">
            <h1 className="recoleta text-[26px] font-bold leading-[26px] text-white md:text-[44px] md:leading-[48px]">
              FAQ
            </h1>
          </div>

          <p className="elza mt-4 max-w-[720px] text-[13px] leading-5 text-white/80 md:text-[16px] md:leading-6">
            Quick answers about shows, tickets, bookings, and collaborations. If
            you do not find what you need, send a message from the Connect page.
          </p>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="w-full md:max-w-[520px]">
              <label className="sr-only">Search FAQs</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search questions..."
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

      <section className="bg-[#0B0B0E] py-8 sm:py-10 md:py-14">
        <div className="site-shell mx-auto w-full max-w-6xl">
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <p className="elza text-[14px] text-white/75">
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
                    open:bg-white/[0.075]
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
                        <p className="recoleta text-[16px] font-bold leading-snug md:text-[18px]">
                          {item.q}
                        </p>
                        <span className="elza hidden rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-bold text-white/80 ring-1 ring-white/10 sm:inline-flex">
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    <span
                      className="
                        mt-1 select-none text-[18px] leading-none text-white/70
                        transition-transform group-open:rotate-45
                      "
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>

                  <div className="px-5 pb-5 md:px-6 md:pb-6">
                    <div className="ml-8 elza text-[13px] leading-6 text-white/80 md:text-[14px]">
                      {item.a}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl bg-[linear-gradient(90deg,rgba(0,216,255,.14)_0%,rgba(153,0,255,.10)_55%,rgba(255,255,255,.06)_100%)] p-6 ring-1 ring-white/10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="recoleta text-[18px] font-bold md:text-[20px]">
                  Still have a question?
                </p>
                <p className="elza text-[13px] text-white/75 md:text-[14px]">
                  Send your query and we&apos;ll get back with details.
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
