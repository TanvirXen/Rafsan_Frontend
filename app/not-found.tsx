/* eslint-disable react-hooks/purity */
// app/not-found.tsx
"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiHome, FiSearch, FiRefreshCw, FiCopy } from "react-icons/fi";

const MEMES = [
  {
    title: "Bro… the link is missing 😭",
    line: "Looks like this page is off-camera. Try a different link or search below.",
    tag: "RELATABLE",
  },
  {
    title: "404: Scene not found 🎬",
    line: "The page you’re looking for may have been moved or deleted.",
    tag: "CUT SCENE",
  },
  {
    title: "Wrong route, captain 🧭",
    line: "The camera was rolling… but the page wasn’t there. Let’s go home.",
    tag: "BEHIND THE SCENES",
  },
  {
    title: "This isn’t viral — it’s missing 😅",
    line: "Double-check the URL, or jump back to the homepage.",
    tag: "MISSING LINK",
  },
  {
    title: "No page, no drama 🎭",
    line: "But the content is still here. Browse shows and watch episodes.",
    tag: "COMEDY MODE",
  },
];

export default function NotFound() {
  const router = useRouter();
  const pick = useMemo(() => MEMES[Math.floor(Math.random() * MEMES.length)], []);

  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("—");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const onSearch = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const onCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  };

  return (
    <main className="relative min-h-[calc(100svh-64px)] overflow-hidden bg-[#0b0b0f] text-white">
      {/* soft glow bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-20 h-[560px] w-[92vw] max-w-[1020px] -translate-x-1/2 rounded-[999px] blur-3xl"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 50%, rgba(0,216,255,0.22) 0%, rgba(168,85,247,0.18) 30%, rgba(45,27,89,0.22) 50%, rgba(0,0,0,0) 74%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25)_0%,rgba(0,0,0,.75)_55%,rgba(0,0,0,.95)_100%)]" />
      </div>

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-16 text-center sm:py-20">
        {/* mini badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(0,216,255,.6)]" />
          <p className="elza text-[11px] font-bold tracking-[0.22em] text-white/75">
            RAFSAN SABAB • MEME ERROR
          </p>
        </div>

        {/* 404 headline */}
        <div className="mt-6 flex items-baseline gap-3">
          <h1 className="recoleta text-[64px] leading-[0.9] sm:text-[104px] drop-shadow-[0_20px_60px_rgba(0,0,0,.55)]">
            404
          </h1>
          <span className="elza text-[14px] font-bold text-white/70 sm:text-[16px]">
            Scene Missing
          </span>
        </div>

        <p className="elza mt-4 max-w-[720px] text-[14px] leading-6 text-white/80 sm:text-[16px]">
          The page you’re looking for doesn’t exist (or it was moved). Try searching below.
        </p>

        {/* Meme card */}
        <div className="mt-10 w-full max-w-[820px] overflow-hidden rounded-3xl border border-white/12 bg-white/6 shadow-[0_22px_70px_rgba(0,0,0,.55)] backdrop-blur">
          <div className="relative p-6 sm:p-7">
            {/* corner stamp */}
            <div className="absolute right-5 top-5 rotate-[-8deg] rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-cyan-100">
              {pick.tag}
            </div>

            <p className="recoleta text-[22px] leading-[28px] sm:text-[28px] sm:leading-[34px] font-extrabold">
              {pick.title}
            </p>

            <p className="elza mt-3 text-[13px] leading-5 text-white/75 sm:text-[15px] sm:leading-6">
              {pick.line}
            </p>

            {/* URL bar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-left">
                <p className="elza text-[11px] font-bold tracking-widest text-white/55">
                  CURRENT URL
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <p className="text-xs text-white/75 truncate max-w-[520px]">{url}</p>
                  <button
                    type="button"
                    onClick={onCopyUrl}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[12px] text-white/80 hover:bg-white/10"
                    title="Copy"
                  >
                    <FiCopy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="elza inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[13px] font-bold text-white hover:bg-white/10 active:scale-[0.99]"
              >
                <FiRefreshCw className="h-4 w-4" />
                Reload
              </button>
            </div>

            {/* Search */}
            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch();
                  }}
                  placeholder="Search shows or episodes…"
                  className="w-full rounded-2xl border border-white/12 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
              <button
                type="button"
                onClick={onSearch}
                className="elza inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00D8FF] px-6 py-3 text-[14px] font-extrabold text-[#00131b] shadow-[0_14px_34px_rgba(0,216,255,.22)] hover:brightness-95 active:scale-[0.99]"
              >
                <FiSearch className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* Quick actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 px-6 py-5 sm:px-7">
            <Link
              href="/"
              className="elza inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-extrabold text-black shadow-[0_14px_30px_rgba(255,255,255,.10)] hover:brightness-95 active:scale-[0.99]"
            >
              <FiHome className="h-4 w-4" />
              Go Home
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="elza inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-[14px] font-bold text-white hover:bg-white/10 active:scale-[0.99]"
            >
              <FiArrowLeft className="h-4 w-4" />
              Go Back
            </button>

            <Link
              href="/explore-shows"
              className="elza inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-6 py-3 text-[14px] font-bold text-cyan-100 hover:bg-cyan-400/15 active:scale-[0.99]"
            >
              Browse Shows →
            </Link>
          </div>
        </div>

        <p className="elza mt-10 text-[12px] tracking-widest text-white/45">
          rafsansabab.com • “Give me the right link” energy ✨
        </p>
      </section>
    </main>
  );
}
