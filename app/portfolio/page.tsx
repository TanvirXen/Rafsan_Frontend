import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  fetchPortfolioNotableEvents,
  portfolioTypeHref,
  type PortfolioNotableEvent,
  type PortfolioType,
} from "@/app/lib/portfolioNotableEvents";
import PortfolioEventShowcase from "./components/PortfolioEventShowcase";

export const metadata: Metadata = {
  title: "Portfolio | Rafsan Sabab",
  description:
    "A portfolio overview of Rafsan Sabab's live event hosting, sessions and workshops, brand collaboration, and corporate shows.",
};

type PortfolioTone = "yellow" | "cyan";
export const revalidate = 60;

type PortfolioCard = {
  label: PortfolioType;
  title: string;
  body: string;
  ctaLabel: string;
  iconSrc: string;
  tone: PortfolioTone;
  visualTag: string;
  visualTitle: string;
  visualCopy: string;
};

const railInner = "mx-auto w-full max-w-[1100px]";

const portfolioItems: PortfolioCard[] = [
  {
    label: "Event Hosting",
    title: "Live Event Hosting",
    body: "A snapshot of the stages, public programs, launches, and audience-facing events I host with high energy, crowd control, and clear flow from start to finish.",
    ctaLabel: "Talk About Events",
    iconSrc: "/assets/Icon (2).png",
    tone: "cyan",
    visualTag: "Portfolio Highlight",
    visualTitle: "Stage presence built for live rooms.",
    visualCopy:
      "From campus programs to public events, this side of the portfolio is about commanding the room without losing the audience.",
  },
  {
    label: "Sessions & Workshops",
    title: "Interactive Sessions",
    body: "This part of the portfolio focuses on workshops and speaking sessions built around communication, storytelling, confidence, and audience connection.",
    ctaLabel: "Plan a Session",
    iconSrc: "/assets/Icon (1).png",
    tone: "yellow",
    visualTag: "Learning Format",
    visualTitle: "Work that leaves people with something useful.",
    visualCopy:
      "These projects are designed for teams, campuses, and communities that want practical takeaways, not passive listening.",
  },
  {
    label: "Brand Collaboration",
    title: "Brand Storytelling",
    body: "A portfolio slice built around creator work, audience-facing campaigns, and collaborations where brand messaging needs to feel natural and memorable.",
    ctaLabel: "Start Collaboration",
    iconSrc: "/assets/Star.png",
    tone: "cyan",
    visualTag: "Campaign Work",
    visualTitle: "Brand work with a clearer voice.",
    visualCopy:
      "This includes creator partnerships, branded storytelling, and campaign formats shaped to feel human instead of generic.",
  },
  {
    label: "Corporate Shows",
    title: "Corporate Entertainment",
    body: "This section highlights shows and formats created for companies that want internal events to feel sharper, warmer, and more memorable for the room.",
    ctaLabel: "Book a Show",
    iconSrc: "/assets/Icon (2).png",
    tone: "yellow",
    visualTag: "Company Events",
    visualTitle: "Corporate formats that still feel alive.",
    visualCopy:
      "Team events, company celebrations, and internal programs work best when the entertainment actually fits the audience in front of it.",
  },
];

function getToneClasses(tone: PortfolioTone) {
  if (tone === "yellow") {
    return {
      panel:
        "border border-[#FFD928] bg-[linear-gradient(180deg,rgba(255,217,40,0.18)_0%,rgba(255,217,40,0.10)_100%)] text-[#FFD928]",
      panelMuted: "text-[#FFD928]/80",
      button:
        "border border-[#FFD928] text-[#FFD928] hover:bg-[#FFD928]/10",
      visual:
        "border border-[#FFD928]/65 bg-[radial-gradient(circle_at_top,_rgba(255,217,40,0.28),_transparent_44%),linear-gradient(135deg,#141006_0%,#3a3010_48%,#6a591b_100%)] text-[#FFD928]",
      visualMuted: "text-white/82",
      badge: "border border-[#FFD928]/35 bg-[#FFD928]/10 text-[#FFD928]",
    };
  }

  return {
    panel: "border border-[#00D8FF] bg-[#00D8FF] text-[#121212]",
    panelMuted: "text-[#121212]/72",
    button: "border border-[#121212] text-[#121212] hover:bg-black/5",
    visual:
      "border border-[#00D8FF]/55 bg-[radial-gradient(circle_at_top,_rgba(0,216,255,0.28),_transparent_46%),linear-gradient(135deg,#041116_0%,#0b3440_52%,#0b7f97_100%)] text-white",
    visualMuted: "text-white/82",
    badge: "border border-[#00D8FF]/35 bg-[#00D8FF]/10 text-[#00D8FF]",
  };
}

function PortfolioDetail({
  item,
}: {
  item: PortfolioCard;
}) {
  const tone = getToneClasses(item.tone);

  return (
    <article
      className={[
        "flex h-full items-center rounded-[28px] p-7 lg:p-9",
        "min-h-[20rem] md:min-h-[22rem] lg:min-h-[28rem] xl:min-h-[33rem]",
        tone.panel,
      ].join(" ")}
    >
      <div className="flex max-w-[17rem] flex-col gap-4">
        <p
          className={`elza text-[13px] font-bold uppercase tracking-[0.18em] ${tone.panelMuted}`}
        >
          {item.label}
        </p>
        <h2 className="recoleta text-[24px] font-bold leading-[1.12] lg:text-[28px]">
          {item.title}
        </h2>
        <p className="elza text-[15px] leading-7 lg:text-[16px]">{item.body}</p>
        <Link
          href={portfolioTypeHref(item.label)}
          className={[
            "elza mt-1 inline-flex h-11 w-fit items-center justify-center rounded-full px-5 text-sm font-bold transition",
            tone.button,
          ].join(" ")}
        >
          {item.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

function PortfolioVisual({
  item,
  events,
}: {
  item: PortfolioCard;
  events: PortfolioNotableEvent[];
}) {
  if (events.length) {
    return (
      <PortfolioEventShowcase
        label={item.label}
        tone={item.tone}
        events={events}
      />
    );
  }

  const tone = getToneClasses(item.tone);

  return (
    <article
      className={[
        "relative isolate flex min-h-[20rem] overflow-hidden rounded-[28px] p-7 md:min-h-[22rem] lg:min-h-[28rem] lg:p-10 xl:min-h-[33rem]",
        tone.visual,
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,18,18,0.02)_0%,rgba(18,18,18,0.35)_100%)]" />
      <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-12 right-8 h-48 w-48 rounded-full bg-black/20 blur-3xl" />

      <div className="relative flex h-full w-full flex-col justify-between gap-8">
        <div className="flex items-start justify-between gap-4">
          <span
            className={[
              "elza inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]",
              tone.badge,
            ].join(" ")}
          >
            {item.visualTag}
          </span>

          <Image
            src={item.iconSrc}
            alt=""
            width={54}
            height={54}
            className="h-[42px] w-[42px] object-contain opacity-95 lg:h-[54px] lg:w-[54px]"
          />
        </div>

        <div className="max-w-[34rem] space-y-4">
          <p
            className={`elza text-[13px] font-bold uppercase tracking-[0.18em] ${tone.visualMuted}`}
          >
            {item.label}
          </p>
          <h3 className="recoleta max-w-[28rem] text-[28px] font-bold leading-[1.02] text-white lg:text-[42px]">
            {item.visualTitle}
          </h3>
          <p
            className={`elza max-w-[24rem] text-[15px] leading-7 lg:text-[16px] ${tone.visualMuted}`}
          >
            {item.visualCopy}
          </p>
        </div>
      </div>
    </article>
  );
}

function CompactPortfolioCard({
  item,
  events,
  reverse = false,
}: {
  item: PortfolioCard;
  events: PortfolioNotableEvent[];
  reverse?: boolean;
}) {
  const tone = getToneClasses(item.tone);

  const visual = events.length ? (
    <PortfolioEventShowcase
      label={item.label}
      tone={item.tone}
      events={events}
      compact
    />
  ) : (
    <div className={`relative min-h-[15.5rem] overflow-hidden ${tone.visual}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,18,18,0.03)_0%,rgba(18,18,18,0.28)_100%)]" />
      <div className="relative flex h-full flex-col justify-between gap-6 p-4">
        <span
          className={[
            "elza inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
            tone.badge,
          ].join(" ")}
        >
          {item.label}
        </span>

        <div className="space-y-3">
          <Image
            src={item.iconSrc}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <h3 className="recoleta text-[22px] font-bold leading-[1.02] text-white">
            {item.title}
          </h3>
          <p className={`elza text-[12px] leading-5 ${tone.visualMuted}`}>
            {item.visualCopy}
          </p>
        </div>
      </div>
    </div>
  );

  const detail = (
    <div className={`flex items-center px-4 ${tone.panel}`}>
      <div className="flex w-full flex-col items-start justify-center gap-2 py-4">
        <p
          className={`elza text-[10px] font-bold uppercase tracking-[0.18em] ${tone.panelMuted}`}
        >
          {item.label}
        </p>
        <h3 className="recoleta text-[15px] font-bold leading-5">{item.title}</h3>
        <p className="elza text-[11px] leading-4">{item.body}</p>
        <Link
          href={portfolioTypeHref(item.label)}
          className={[
            "elza mt-1 inline-flex h-9 items-center justify-center rounded-full px-4 text-[11px] font-bold transition",
            tone.button,
          ].join(" ")}
        >
          {item.ctaLabel}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="mx-auto grid w-full max-w-[30rem] min-h-[15.5rem] overflow-hidden rounded-[18px] shadow-[0_14px_28px_rgba(0,0,0,.35)] ring-1 ring-white/10 grid-cols-[minmax(0,1.7fr)_minmax(7.5rem,1fr)]">
      {reverse ? detail : visual}
      {reverse ? visual : detail}
    </div>
  );
}

export default async function PortfolioPage() {
  const portfolioEvents = await fetchPortfolioNotableEvents();

  return (
    <div className="overflow-x-hidden">
      <section className="site-shell-wide py-12 lg:py-16">
        <div className="mx-auto flex max-w-[56rem] flex-col items-center gap-5 text-center">
          <span className="elza inline-flex rounded-full border border-[#00D8FF]/30 bg-[#00D8FF]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#00D8FF]">
            Portfolio
          </span>
          <h1 className="recoleta text-[clamp(2.35rem,6vw,4.75rem)] font-bold leading-[0.95] text-white">
            Selected work across live formats and creative partnerships.
          </h1>
          <p className="elza max-w-[42rem] text-[15px] leading-7 text-white/78 lg:text-[17px]">
            A clean overview of the formats, audiences, and collaboration styles
            that define my work across stage, screen, and brand projects.
          </p>
        </div>
      </section>

      <section className="relative isolate overflow-x-hidden md:hidden">
        <div className="site-shell pb-10">
          <div className="mx-auto flex w-full max-w-[30rem] flex-col items-center gap-4 sm:gap-5">
            {portfolioItems.map((item, index) => (
              <CompactPortfolioCard
                key={item.title}
                item={item}
                events={portfolioEvents[item.label]}
                reverse={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="hidden md:block">
        <div className="site-shell-wide pb-14 lg:pb-18">
          <div className={`${railInner} space-y-10`}>
            {portfolioItems.map((item, index) => {
              const reverse = index % 2 === 1;
              return (
                <div
                  key={item.title}
                  className={[
                    "grid items-stretch gap-6 lg:gap-8",
                    reverse
                      ? "md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]"
                      : "md:grid-cols-[minmax(0,1fr)_16rem] lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]",
                  ].join(" ")}
                >
                  {reverse ? (
                    <>
                      <PortfolioDetail item={item} />
                      <PortfolioVisual item={item} events={portfolioEvents[item.label]} />
                    </>
                  ) : (
                    <>
                      <PortfolioVisual item={item} events={portfolioEvents[item.label]} />
                      <PortfolioDetail item={item} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
