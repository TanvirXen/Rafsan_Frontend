/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiList,
  FiSearch,
  FiPlay,
  FiX,
  FiMaximize,
  FiMinimize,
  FiChevronDown,
} from "react-icons/fi";
import { ChannelLogo } from "./ChannelLogo";
import { PipeText } from "@/app/components/PipeText";

type Season = {
  _id: string;
  title: string;
  description?: string;
  showId: string;
};

type Episode = {
  _id: string;
  title: string;
  showId: string;
  seasonId: string;
  thumbnail?: string;
  link?: string;
  featured?: boolean;
};

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function extractLastNumber(input?: string | null): number {
  if (!input) return -1;
  const m = input.match(/\d+/g);
  if (!m?.length) return -1;
  return Number(m[m.length - 1]);
}

/* ---------------------- YouTube helpers ---------------------- */

function getYouTubeId(input: string): string | null {
  try {
    const u = new URL(input);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    const v = u.searchParams.get("v");
    if (v) return v;

    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => ["embed", "shorts", "live"].includes(p));
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];

    return null;
  } catch {
    const m =
      input.match(/v=([a-zA-Z0-9_-]{6,})/) ||
      input.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/) ||
      input.match(/\/shorts\/([a-zA-Z0-9_-]{6,})/) ||
      input.match(/\/embed\/([a-zA-Z0-9_-]{6,})/);
    return m?.[1] ?? null;
  }
}

function toWatchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

const CHANNEL_SUBSCRIBE_URL =
  "https://www.youtube.com/@WHATASHOW_OFFICIAL?sub_confirmation=1";

/* ---------------------- Isolated YT Mount (fixed origin + safer init) ---------------------- */

type YTMountProps = {
  youtubeId: string | null;
  onReady?: () => void;
  onEnded?: () => void;
};

const YTMount = memo(function YTMount({
  youtubeId,
  onReady,
  onEnded,
}: YTMountProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  const onReadyRef = useRef(onReady);
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    onReadyRef.current = onReady;
    onEndedRef.current = onEnded;
  }, [onReady, onEnded]);

  const destroy = () => {
    try {
      if (playerRef.current?.destroy) playerRef.current.destroy();
    } catch {}
    playerRef.current = null;

    try {
      mountRef.current?.replaceChildren();
    } catch {}
  };

  const ensureYT = () =>
    new Promise<void>((resolve) => {
      if (window.YT?.Player) return resolve();

      let done = false;

      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        try {
          prev?.();
        } catch {}
        if (done) return;
        done = true;
        resolve();
      };

      // Safety poll (prevents hanging forever if callback already fired)
      const start = Date.now();
      const tick = () => {
        if (window.YT?.Player) {
          if (!done) {
            done = true;
            resolve();
          }
          return;
        }
        if (Date.now() - start > 8000) {
          // resolve anyway; create() will no-op if YT still missing
          if (!done) {
            done = true;
            resolve();
          }
          return;
        }
        setTimeout(tick, 60);
      };
      tick();
    });

  const create = async (id: string) => {
    if (!mountRef.current) return;

    try {
      await ensureYT();
      if (!window.YT?.Player || !mountRef.current) return;

      destroy();

      playerRef.current = new window.YT.Player(mountRef.current, {
        host: "https://www.youtube.com",
        videoId: id,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          // ✅ fixes your "postMessage origin mismatch" in dev/local
          origin: window.location.origin,
          enablejsapi: 1,
        },
        events: {
          onReady: () => onReadyRef.current?.(),
          onStateChange: (ev: any) => {
            if (ev?.data === 0) onEndedRef.current?.();
          },
        },
      });
    } catch (err) {
      console.error("YT create failed:", err);
    }
  };

  useEffect(() => {
    if (!youtubeId) return;
    create(youtubeId);
    return () => destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" />;
});

/* ---------------------- Component ---------------------- */

type Props = {
  showSlug: string;
  showTitle?: string;
  seasons: Season[];
  episodes: Episode[];
  initialEpisodeId?: string | null;
};

export default function EnhancedPlayer({
  showSlug,
  showTitle,
  seasons,
  episodes,
  initialEpisodeId,
}: Props) {
  const shellRef = useRef<HTMLDivElement | null>(null);

  // ✅ season sort: 9 -> 8 -> 7 ...
  const seasonsSorted = useMemo(() => {
    const copy = [...seasons];
    copy.sort((a, b) => {
      const an = extractLastNumber(a.title);
      const bn = extractLastNumber(b.title);
      if (bn !== an) return bn - an;
      return (b.title || "").localeCompare(a.title || "");
    });
    return copy;
  }, [seasons]);

  const seasonById = useMemo(() => {
    const m = new Map<string, Season>();
    for (const s of seasons) m.set(s._id, s);
    return m;
  }, [seasons]);

  const normalized = useMemo(() => {
    return episodes.map((ep) => {
      const yt = ep.link ? getYouTubeId(ep.link) : null;
      return {
        ...ep,
        youtubeId: yt,
        watchUrl: yt ? toWatchUrl(yt) : null,
        seasonTitle: seasonById.get(ep.seasonId)?.title || "Season",
        _epSort: extractLastNumber(ep.title),
      };
    });
  }, [episodes, seasonById]);

  // ✅ build master order: Season 9.. then episodes 9.. inside each
  const playlistAll = useMemo(() => {
    const bySeason = new Map<string, typeof normalized>();
    for (const ep of normalized) {
      const arr = bySeason.get(ep.seasonId) ?? [];
      arr.push(ep);
      bySeason.set(ep.seasonId, arr);
    }

    for (const [sid, arr] of bySeason.entries()) {
      arr.sort((a, b) => {
        const an = a._epSort ?? -1;
        const bn = b._epSort ?? -1;
        if (bn !== an) return bn - an;
        return (b.title || "").localeCompare(a.title || "");
      });
      bySeason.set(sid, arr);
    }

    const out: typeof normalized = [];
    for (const s of seasonsSorted) out.push(...(bySeason.get(s._id) ?? []));
    return out;
  }, [normalized, seasonsSorted]);

  const firstPlayable = useMemo(
    () => playlistAll.find((e) => !!e.youtubeId) || playlistAll[0],
    [playlistAll]
  );

  const [query, setQuery] = useState("");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);

  // ✅ Season dropdown filter (custom themed)
  const [seasonFilter, setSeasonFilter] = useState<string>("all");
  const [seasonMenuOpen, setSeasonMenuOpen] = useState(false);
  const seasonMenuRef = useRef<HTMLDivElement | null>(null);

  // ✅ theater + fullscreen
  const [theater, setTheater] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [currentId, setCurrentId] = useState<string>(
    initialEpisodeId || firstPlayable?._id || ""
  );

  // back/forward
  useEffect(() => {
    const onPop = () => {
      const sp = new URLSearchParams(window.location.search);
      const ep = sp.get("ep");
      if (ep) setCurrentId(ep);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // keep URL shareable
  useEffect(() => {
    if (!currentId) return;
    const url = `/shows/${encodeURIComponent(showSlug)}?ep=${encodeURIComponent(
      currentId
    )}`;
    window.history.replaceState(null, "", url);
  }, [currentId, showSlug]);

  // close season menu on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!seasonMenuOpen) return;
      const t = e.target as Node;
      if (seasonMenuRef.current && !seasonMenuRef.current.contains(t)) {
        setSeasonMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [seasonMenuOpen]);

  const playlistVisible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return playlistAll.filter((e) => {
      if (seasonFilter !== "all" && e.seasonId !== seasonFilter) return false;
      if (onlyFeatured && !e.featured) return false;

      if (q) {
        const hay = `${e.title} ${e.seasonTitle}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [playlistAll, query, onlyFeatured, seasonFilter]);

  const current = useMemo(() => {
    return playlistAll.find((e) => e._id === currentId) || firstPlayable;
  }, [playlistAll, currentId, firstPlayable]);

  // nav should always work (even if current filtered out)
  const navList = useMemo(() => {
    const inVisible = playlistVisible.some((e) => e._id === current?._id);
    return inVisible ? playlistVisible : playlistAll;
  }, [playlistVisible, playlistAll, current?._id]);

  const currentIndex = useMemo(
    () => navList.findIndex((e) => e._id === current?._id),
    [navList, current?._id]
  );

  const prevEp = currentIndex > 0 ? navList[currentIndex - 1] : null;
  const nextEp =
    currentIndex >= 0 && currentIndex < navList.length - 1
      ? navList[currentIndex + 1]
      : null;

  const autoplayRef = useRef(autoplay);
  useEffect(() => {
    autoplayRef.current = autoplay;
  }, [autoplay]);

  const nextIdRef = useRef<string | null>(null);
  useEffect(() => {
    nextIdRef.current = nextEp?._id ?? null;
  }, [nextEp?._id]);

  const [ready, setReady] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setReady(false), [current?.youtubeId]);

  const poster = current?.thumbnail || "/assets/exp1.jpg";
  const watchOnYouTube = current?.youtubeId ? toWatchUrl(current.youtubeId) : null;

  const onEnded = () => {
    if (!autoplayRef.current) return;
    const nid = nextIdRef.current;
    if (nid) setCurrentId(nid);
  };

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await shellRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (err) {
      console.error("Fullscreen failed:", err);
    }
  };

  const currentSeasonLabel =
    seasonFilter === "all"
      ? "All Seasons"
      : seasonsSorted.find((s) => s._id === seasonFilter)?.title ?? "Season";

  return (
    <section
      className={cn(
        "mx-auto max-w-6xl px-4 sm:px-6 lg:px-0 pt-6 text-white",
        theater ? "min-h-[calc(100svh-64px)]" : ""
      )}
    >
      {/* load once */}
      <Script
        id="youtube-iframe-api"
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />

      <div
        ref={shellRef}
        className={cn(
          "overflow-hidden rounded-3xl ring-1 ring-white/10 bg-[#0f0f0f] shadow-[0_22px_70px_rgba(0,0,0,.55)]",
          isFullscreen ? "rounded-none" : ""
        )}
      >
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-[1fr_380px]",
            theater ? "lg:min-h-[calc(100svh-120px)]" : ""
          )}
        >
          {/* LEFT */}
          <div className="p-4">
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10",
                theater ? "aspect-video lg:aspect-auto lg:h-[calc(100svh-240px)]" : "aspect-video"
              )}
            >
              <Image
                src={poster}
                alt={current?.title || "Episode"}
                fill
                priority
                className={cn(
                  "object-cover transition-opacity duration-300",
                  ready ? "opacity-0" : "opacity-100"
                )}
                sizes="(max-width: 1024px) calc(100vw - 2rem), 820px"
              />

              <div
                className={cn(
                  "absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.12)_0%,rgba(0,0,0,.40)_55%,rgba(0,0,0,.78)_100%)] transition-opacity duration-300",
                  ready ? "opacity-0" : "opacity-100"
                )}
              />

              {!ready && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/25 backdrop-blur">
                    <FiPlay className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}

              <YTMount
                youtubeId={current?.youtubeId || null}
                onReady={() => setReady(true)}
                onEnded={onEnded}
              />

              {!current?.youtubeId && (
                <div className="absolute inset-0 grid place-items-center text-white/70">
                  This episode has no playable YouTube link.
                </div>
              )}
            </div>

      <h1 className="recoleta mt-4 text-[18px] sm:text-[22px] font-extrabold leading-snug">
  <PipeText text={current?.title ?? ""} pipeClassName="recoleta" />
</h1>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
             
              <div className="flex items-center gap-3">
                                    <ChannelLogo />

                <a
                  href={CHANNEL_SUBSCRIBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-extrabold text-black hover:brightness-95"
                >
                  Subscribe
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setPanelOpen(true)}
                  className="elza inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold hover:bg-white/15 lg:hidden"
                  title="Open playlist"
                >
                  <FiList /> Playlist
                </button>

                <button
                  onClick={() => prevEp && setCurrentId(prevEp._id)}
                  disabled={!prevEp}
                  className={cn(
                    "elza inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold",
                    prevEp
                      ? "bg-white/10 hover:bg-white/15"
                      : "bg-white/5 text-white/40 cursor-not-allowed"
                  )}
                >
                  <FiChevronLeft /> Previous
                </button>

                <button
                  onClick={() => nextEp && setCurrentId(nextEp._id)}
                  disabled={!nextEp}
                  className={cn(
                    "elza inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold",
                    nextEp
                      ? "bg-white/10 hover:bg-white/15"
                      : "bg-white/5 text-white/40 cursor-not-allowed"
                  )}
                >
                  Next <FiChevronRight />
                </button>

                <button
                  onClick={() => setTheater((v) => !v)}
                  className={cn(
                    "elza inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold",
                    theater ? "bg-cyan-400/20 ring-1 ring-cyan-400/30" : "bg-white/10 hover:bg-white/15"
                  )}
                  title="Theater mode"
                >
                  -h
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="elza inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold hover:bg-white/15"
                  title="Fullscreen"
                >
                  {isFullscreen ? <FiMinimize /> : <FiMaximize />}
                  Fullscreen
                </button>

             
                <Link
                  href={`/shows/${encodeURIComponent(showSlug)}`}
                  className="elza inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold hover:bg-white/15"
                  title="Close player"
                >
                  <FiX />
                  Close
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Playlist */}
          <aside
            className={cn(
              "border-t lg:border-t-0 lg:border-l border-white/10 bg-[#121212]",
              panelOpen ? "block" : "hidden lg:block",
              "lg:max-h-[calc(100svh-120px)] lg:overflow-y-auto"
            )}
          >
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="elza text-xs font-extrabold tracking-widest text-white/65">
                    PLAYLIST
                  </p>
                  <p className="elza mt-1 text-sm font-bold text-white/90">
                    {showTitle || "Episodes"}
                  </p>
                </div>

                <button
                  onClick={() => setPanelOpen(false)}
                  className="rounded-full bg-white/10 p-2 hover:bg-white/15 lg:hidden"
                  aria-label="Close playlist"
                >
                  <FiX />
                </button>
              </div>

              {/* Filters row */}
              <div className="mt-4 flex items-center gap-2">
                {/* Search */}
                <div className="relative flex-1">
                  <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                {/* ✅ Custom season dropdown */}
                <div ref={seasonMenuRef} className="relative">
                  <button
                    onClick={() => setSeasonMenuOpen((v) => !v)}
                    className="elza inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-extrabold text-white/90 hover:bg-white/10"
                    title="Filter by season"
                    type="button"
                  >
                    {currentSeasonLabel}
                    <FiChevronDown className="text-white/70" />
                  </button>

                  {seasonMenuOpen && (
                    <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-[0_18px_50px_rgba(0,0,0,.55)]">
                      <button
                        onClick={() => {
                          setSeasonFilter("all");
                          setSeasonMenuOpen(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm font-bold hover:bg-white/10",
                          seasonFilter === "all" ? "bg-cyan-400/10 text-cyan-200" : "text-white/85"
                        )}
                      >
                        All Seasons
                      </button>

                      <div className="h-px bg-white/10" />

                      <div className="max-h-72 overflow-auto">
                        {seasonsSorted.map((s) => (
                          <button
                            key={s._id}
                            onClick={() => {
                              setSeasonFilter(s._id);
                              setSeasonMenuOpen(false);
                            }}
                            className={cn(
                              "w-full px-3 py-2 text-left text-sm font-bold hover:bg-white/10",
                              seasonFilter === s._id
                                ? "bg-cyan-400/10 text-cyan-200"
                                : "text-white/85"
                            )}
                          >
                            {s.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Featured */}
                <button
                  onClick={() => setOnlyFeatured((v) => !v)}
                  className={cn(
                    "rounded-2xl px-3 py-2.5 text-sm font-bold border",
                    onlyFeatured
                      ? "border-purple-400/30 bg-purple-400/10 text-purple-100"
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  )}
                  title="Featured only"
                >
                  ★
                </button>
              </div>

              {/* ✅ Flat list (no grouping) */}
              <div className="mt-4 grid gap-3">
                {playlistVisible.map((ep) => {
                  const active = ep._id === currentId;
                  return (
                    <button
                      key={ep._id}
                      onClick={() => setCurrentId(ep._id)}
                      className={cn(
                        "group flex w-full items-start gap-3 rounded-2xl border p-2 text-left",
                        active
                          ? "border-cyan-400/35 bg-cyan-400/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <div className="elza w-10 pt-1 text-[11px] font-extrabold text-white/55">
                        {extractLastNumber(ep.seasonTitle) >= 0
                          ? `S${extractLastNumber(ep.seasonTitle)}`
                          : "S"}
                        {extractLastNumber(ep.title) >= 0
                          ? ` · E${String(extractLastNumber(ep.title)).padStart(2, "0")}`
                          : ""}
                      </div>

                      <div className="relative h-[56px] w-[96px] overflow-hidden rounded-xl ring-1 ring-white/10 bg-black">
                        <Image
                          src={ep.thumbnail || "/assets/exp1.jpg"}
                          alt={ep.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "elza text-[12px] font-bold line-clamp-2",
                            active ? "text-white" : "text-white/90 group-hover:text-white"
                          )}
                        >
<PipeText text={ep.title} pipeClassName="recoleta" />
                        </p>
                        <p className="elza mt-1 text-[11px] text-white/55 line-clamp-1">
                          {ep.seasonTitle}
                        </p>
                      </div>
                    </button>
                  );
                })}

                {playlistVisible.length === 0 && (
                  <p className="text-sm text-white/60">No videos match your filter.</p>
                )}
              </div>

              <div className="h-6" />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
