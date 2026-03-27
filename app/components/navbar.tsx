"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, JSX, CSSProperties } from "react";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FiYoutube } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa6";

import { FaImages } from "react-icons/fa6";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import { GrContact } from "react-icons/gr";

import apiList from "../../apiList"; // 🔁 adjust if needed

// ---------- types ----------
type NavLink = { name: string; href: string };

type ShowFromApi = {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  heroImage?: string;
  seasons?: number;
  reels?: number;
  featured?: boolean;
};

type ShowNavItem = { title: string; slug: string };

// ---------- helpers ----------
function slugifyTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Active matcher for top-level nav items, including the shows index/detail routes */
function isActivePath(pathname: string, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (href === "/explore-shows") {
    return pathname === href || pathname === "/shows" || pathname.startsWith("/shows/");
  }
  return pathname === href || pathname.startsWith(href + "/");
}

const desktopNavBaseClass =
  "relative inline-flex appearance-none items-center gap-1 border-0 bg-transparent px-3 py-2 transition-colors";

const desktopNavLabelClass =
  "recoleta text-[15px] font-semibold leading-none tracking-[0.01em]";

const NAV_ACTIVE = "#FE80E9";
const NAV_INACTIVE = "rgba(255,255,255,0.82)";

function navProps(pathname: string, href: string) {
  const active = isActivePath(pathname, href);
  return {
    active,
    className: [
      desktopNavBaseClass,
      active ? "" : "hover:opacity-100",
    ].join(" ").trim(),
    labelStyle: {
      color: active ? NAV_ACTIVE : NAV_INACTIVE,
    } as CSSProperties,
  };
}

/* static top-level links (no individual show pages here) */
const links: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Shows", href: "/explore-shows" },
  { name: "Contact Us", href: "/connect" },
];

/* icon mapping used only for MOBILE menu */
const linkIcon: Record<string, JSX.Element> = {
  "/": <FaHome className='h-6 w-6' />,
  "/about": <FaInfoCircle className='h-6 w-6' />,
  "/gallery": <FaImages className='h-6 w-6' />,
  "/explore-shows": <MdLiveTv className='h-6 w-6' />,
  "/connect": <GrContact className='h-6 w-6' />,
};

export default function Navbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showsOpen, setShowsOpen] = useState(false);

  const [showLinks, setShowLinks] = useState<ShowNavItem[]>([]);
  const [loadingShows, setLoadingShows] = useState(false);

  const showsRef = useRef<HTMLDivElement>(null);

  // -------- fetch shows dynamically on client --------
  useEffect(() => {
    let cancelled = false;

    async function loadShows() {
      try {
        setLoadingShows(true);
        const res = await fetch(apiList.shows.list, { cache: "no-store" });
        if (!res.ok) {
          console.error("Navbar shows fetch failed", res.status);
          return;
        }

        const json = (await res.json()) as
          | ShowFromApi[]
          | { shows?: ShowFromApi[] };
        const arr: ShowFromApi[] = Array.isArray(json)
          ? json
          : json.shows ?? [];

        if (cancelled) return;

        const mapped: ShowNavItem[] = arr.map((s) => ({
          title: s.title,
          slug: slugifyTitle(s.title),
        }));

        // optional: stable sort by title
        mapped.sort((a, b) => a.title.localeCompare(b.title));

        setShowLinks(mapped);
      } catch (e) {
        if (!cancelled) console.error("Navbar shows fetch error", e);
      } finally {
        if (!cancelled) setLoadingShows(false);
      }
    }

    loadShows();
    return () => {
      cancelled = true;
    };
  }, []);

  // -------- close mobile menu on outside click --------
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenu && !mobileMenu.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // -------- close shows dropdown on outside click --------
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!showsRef.current) return;
      if (!showsRef.current.contains(e.target as Node)) {
        setShowsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // lock body scroll when mobile menu open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handleMobileLinkClick = (href: string) => {
    setMobileOpen(false);
    router.push(href);
  };

  const handleShowClick = () => setShowsOpen((s) => !s);

  return (
    <header className='sticky top-0 z-50'>
      <div className='bg-[#121212]/95 backdrop-blur supports-[backdrop-filter]:bg-[#121212]/85'>
        <div className='site-shell-wide'>
          <nav className='flex h-16 items-center justify-between gap-4 sm:h-[72px]'>
            {/* Brand */}
            <Link href='/' className='group flex items-center gap-3'>
              <span className='relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-zinc-700'>
                <Image src='/assets/logo.jpg' alt='Avatar' fill sizes='32px' />
              </span>
              <span className='text-[#FFFFFF]'>
                <span className='recoleta text-[1.3rem] sm:text-[1.45rem] lg:text-[1.7rem]'>
                  Rafsan
                </span>{" "}
                <span className='recoleta text-[1.3rem] sm:text-[1.45rem] lg:text-[1.7rem]'>
                  Sabab
                </span>
              </span>
            </Link>

            {/* Desktop / Tablet */}
            <div className='hidden items-center gap-1 md:flex'>
              {links.slice(0, 3).map((l) => {
                const item = navProps(pathname, l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={item.className}
                    aria-current={item.active ? "page" : undefined}
                  >
                    <span className={desktopNavLabelClass} style={item.labelStyle}>
                      {l.name}
                    </span>
                    {item.active && (
                      <span
                        aria-hidden
                        className='absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full'
                        style={{ backgroundColor: NAV_ACTIVE }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Shows Dropdown (dynamic from API) */}
              <div className='relative' ref={showsRef}>
                {(() => {
                  const item = navProps(pathname, "/explore-shows");
                  return (
                <button
                  type='button'
                  onClick={handleShowClick}
                  className={item.className}
                  aria-haspopup='menu'
                  aria-expanded={showsOpen}
                  aria-controls='shows-menu'
                  aria-current={item.active ? "page" : undefined}
                >
                  <span className={desktopNavLabelClass} style={item.labelStyle}>
                    Shows
                  </span>
                  <FaChevronDown
                    className='inline-block h-4 w-4 shrink-0'
                    style={item.labelStyle}
                  />
                  {item.active && (
                    <span
                      aria-hidden
                      className='absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full'
                      style={{ backgroundColor: NAV_ACTIVE }}
                    />
                  )}
                </button>
                  );
                })()}

                {showsOpen && (
                  <div
                    id='shows-menu'
                    role='menu'
                    className='absolute right-0 mt-2 max-h-80 w-52 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-900/95 shadow-lg'
                  >
                    {loadingShows && (
                      <div className='px-3 py-2 text-xs text-zinc-400'>
                        Loading…
                      </div>
                    )}

                    {!loadingShows && showLinks.length === 0 && (
                      <div className='px-3 py-2 text-xs text-zinc-500'>
                        Shows coming soon
                      </div>
                    )}

                    {!loadingShows &&
                      showLinks.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/shows/${s.slug}`}
                          className='recoleta block px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800'
                          role='menuitem'
                          onClick={() => setShowsOpen(false)}
                        >
                          {s.title}
                        </Link>
                      ))}

                    {/* Divider + Explore all link */}
                    <div className='h-px w-full bg-zinc-800' />
                    <Link
                      href='/explore-shows'
                      className='recoleta block px-3 py-2 text-xs uppercase tracking-wide text-cyan-300 hover:bg-zinc-800'
                      role='menuitem'
                      onClick={() => setShowsOpen(false)}
                    >
                      Explore all shows
                    </Link>
                  </div>
                )}
              </div>

              {/* Remaining static links (Shows -> explore-shows, Contact) */}
              {/* Remaining static links (skip Shows here; only in mobile & dropdown) */}
              {links
                .slice(3)
                .filter((l) => l.href !== "/explore-shows")
                .map((l) => {
                  const item = navProps(pathname, l.href);
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={item.className}
                      aria-current={item.active ? "page" : undefined}
                    >
                      <span className={desktopNavLabelClass} style={item.labelStyle}>
                        {l.name}
                      </span>
                      {item.active && (
                        <span
                          aria-hidden
                          className='absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full'
                          style={{ backgroundColor: NAV_ACTIVE }}
                        />
                      )}
                    </Link>
                  );
                })}

              <a
                href='https://www.youtube.com/@RafsanSabab'
                target='_blank'
                rel='noreferrer'
                className='group ml-2 inline-flex h-9 w-9 items-center justify-center'
                aria-label='YouTube'
                title='YouTube'
              >
                <FiYoutube className='h-5 w-5 text-[#FF0033] transition-colors group-hover:text-[#FF4D6D]' />
              </a>
            </div>

            {/* Mobile trigger */}
            <button
              className={[
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-zinc-300 md:hidden",
                mobileOpen
                  ? "border-pink-500/40 bg-pink-500/10"
                  : "border-zinc-800",
              ].join(" ")}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((s) => !s)}
            >
              {mobileOpen ? (
                <IoClose className='h-5 w-5' />
              ) : (
                <FaBars className='h-5 w-5' />
              )}
            </button>
          </nav>
        </div>

        {/* FULL-SCREEN MOBILE PANEL */}
        {mobileOpen && (
          <div
            id='mobile-menu'
            role='dialog'
            aria-modal='true'
            className='
              fixed inset-0 z-[60] md:hidden
              bg-[#0b0b0b]/95 backdrop-blur
              text-white w-full min-h-screen
              supports-[height:100dvh]:min-h-[100dvh]
              flex flex-col
            '
          >
            {/* Top bar (safe-area aware) */}
            <div
              className='flex h-16 items-center justify-between border-b border-zinc-800'
              style={{
                paddingLeft: "max(1rem, env(safe-area-inset-left))",
                paddingRight: "max(1rem, env(safe-area-inset-right))",
                paddingTop: "max(0px, env(safe-area-inset-top))",
              }}
            >
              <Link
                href='/'
                className='group flex items-center gap-3'
                onClick={() => setMobileOpen(false)}
              >
                <span className='relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-zinc-700'>
                  <Image
                    src='/assets/logo.jpg'
                    alt='Avatar'
                    fill
                    sizes='32px'
                  />
                </span>
                <span className='text-[#FFFFFF]'>
                  <span className='recoleta text-[1.3rem] sm:text-[1.45rem]'>
                    Rafsan
                  </span>{" "}
                  <span className='recoleta text-[1.3rem] sm:text-[1.45rem]'>
                    Sabab
                  </span>
                </span>
              </Link>

              <button
                className='inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 text-zinc-300 hover:text-white'
                aria-label='Close menu'
                onClick={() => setMobileOpen(false)}
              >
                <IoClose className='h-5 w-5' />
              </button>
            </div>

            {/* Links area: scrollable center */}
            <nav
              className='
                flex-1 w-full overflow-y-auto
                px-5 pt-8 sm:px-6 sm:pt-10
              '
              style={{
                paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
              }}
            >
              <ul className='grid w-full max-w-[380px] sm:max-w-[420px] mx-auto grid-cols-1 gap-3'>
                {links.map((l) => {
                  const active = isActivePath(pathname, l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => handleMobileLinkClick(l.href)}
                        className={[
                          "group block rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-5 py-4 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]",
                          "hover:bg-zinc-900 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-colors",
                          active
                            ? "ring-1 ring-pink-400/40 text-pink-300"
                            : "text-zinc-200",
                        ].join(" ")}
                      >
                        <div className='mx-auto mb-1 flex h-8 w-8 items-center justify-center text-zinc-400 group-hover:text-white'>
                          {linkIcon[l.href]}
                        </div>
                        <span className='recoleta block text-[17px] sm:text-[18px] font-medium tracking-wide'>
                          {l.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className='mt-6 flex items-center justify-center gap-3'>
                <a
                  href='https://www.youtube.com/@RafsanSabab'
                  target='_blank'
                  rel='noreferrer'
                  className='group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60'
                  aria-label='YouTube'
                  title='YouTube'
                >
                  <FiYoutube className='h-5 w-5 text-[#FF0033] transition-colors group-hover:text-[#FF4D6D]' />
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Hairline */}
      <div className='site-shell'>
        <div className='h-px w-full bg-linear-gradient-to-r from-transparent via-zinc-800 to-transparent' />
      </div>
    </header>
  );
}
