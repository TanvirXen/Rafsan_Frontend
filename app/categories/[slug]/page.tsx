import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchPortfolioNotableEvents,
  portfolioSlugToType,
  portfolioTypeToSlug,
  PORTFOLIO_TYPES,
  type PortfolioNotableEvent,
  type PortfolioType,
} from "@/app/lib/portfolioNotableEvents";

export const revalidate = 60;

type CardTone = "yellow" | "cyan";

const railInner = "mx-auto w-full max-w-[1100px]";

const CATEGORY_COPY: Record<
  PortfolioType,
  {
    title: string;
    description: string;
  }
> = {
  "Event Hosting": {
    title: "Live Event Hosting",
    description:
      "A focused look at hosted stages, public programs, launches, and audience-facing moments from the event-hosting side of the portfolio.",
  },
  "Sessions & Workshops": {
    title: "Interactive Sessions",
    description:
      "A curated set of sessions and workshops built around communication, storytelling, confidence, and practical audience engagement.",
  },
  "Brand Collaboration": {
    title: "Brand Storytelling",
    description:
      "Selected creator and campaign work where brand communication needed to feel clear, human, and memorable on the surface.",
  },
  "Corporate Shows": {
    title: "Corporate Entertainment",
    description:
      "A category-specific collection of company events, internal programs, and entertainment formats designed for corporate rooms.",
  },
};

function truncateText(text: string, limit: number) {
  const value = text.trim();
  if (value.length <= limit) return value;

  const trimmed = value.slice(0, limit);
  const lastSpace = trimmed.lastIndexOf(" ");

  return `${(lastSpace > 48 ? trimmed.slice(0, lastSpace) : trimmed).trim()}...`;
}

function getToneClasses(tone: CardTone) {
  if (tone === "yellow") {
    return {
      panel: "bg-[#FFD928] text-[#121212]",
      panelMuted: "text-[#121212]/78",
    };
  }

  return {
    panel: "bg-[#00D8FF] text-[#121212]",
    panelMuted: "text-[#121212]/78",
  };
}

function EventFigure({
  event,
  priority = false,
}: {
  event: PortfolioNotableEvent;
  priority?: boolean;
}) {
  return (
    <figure className="relative min-h-[20rem] overflow-hidden rounded-[28px] bg-black/20 md:min-h-[22rem] lg:min-h-[28rem] xl:min-h-[33.75rem]">
      <Image
        src={event.image}
        alt={event.alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 1279px) calc(100vw - 2rem), 760px"
      />
    </figure>
  );
}

function EventPanel({
  event,
  tone,
}: {
  event: PortfolioNotableEvent;
  tone: CardTone;
}) {
  const palette = getToneClasses(tone);

  return (
    <article
      className={[
        "flex h-full items-center rounded-[28px] p-8 lg:p-10",
        "min-h-[20rem] md:min-h-[22rem] lg:min-h-[28rem] xl:min-h-[33.75rem]",
        palette.panel,
      ].join(" ")}
    >
      <div className="max-w-[16rem] space-y-3">
        <p className={`elza text-[14px] leading-6 ${palette.panelMuted}`}>
          {event.dateLabel}
        </p>
        <h2 className="recoleta text-[24px] font-bold leading-[1.12] lg:text-[28px]">
          {event.title}
        </h2>
        <p className="elza text-[15px] leading-7 lg:text-[16px]">
          {event.description}
        </p>
      </div>
    </article>
  );
}

function MobileEventCard({
  event,
  tone,
  reverse = false,
}: {
  event: PortfolioNotableEvent;
  tone: CardTone;
  reverse?: boolean;
}) {
  const palette = getToneClasses(tone);

  const image = (
    <div className="relative min-h-[15.5rem] overflow-hidden">
      <Image
        src={event.image}
        alt={event.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) calc(100vw - 2rem), 420px"
      />
    </div>
  );

  const panel = (
    <div className={`flex items-center px-4 ${palette.panel}`}>
      <div className="flex w-full flex-col items-start justify-center gap-2 py-4">
        <p className={`elza text-[11px] leading-4 ${palette.panelMuted}`}>
          {event.dateLabel}
        </p>
        <h2 className="recoleta text-[15px] font-bold leading-5">
          {event.title}
        </h2>
        <p className="elza text-[11px] leading-4">
          {truncateText(event.description, 160)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto grid w-full max-w-[28rem] min-h-[15.5rem] overflow-hidden rounded-[18px] shadow-[0_14px_28px_rgba(0,0,0,.35)] ring-1 ring-white/10 grid-cols-[minmax(0,1.7fr)_minmax(7.25rem,1fr)]">
      {reverse ? panel : image}
      {reverse ? image : panel}
    </div>
  );
}

export async function generateStaticParams() {
  return PORTFOLIO_TYPES.map((type) => ({
    slug: portfolioTypeToSlug(type),
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const type = portfolioSlugToType(slug);

  if (!type) {
    return {
      title: "Portfolio Category | Rafsan Sabab",
    };
  }

  const copy = CATEGORY_COPY[type];

  return {
    title: `${copy.title} | Portfolio | Rafsan Sabab`,
    description: copy.description,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const type = portfolioSlugToType(slug);

  if (!type) {
    notFound();
  }

  const copy = CATEGORY_COPY[type];
  const groupedEvents = await fetchPortfolioNotableEvents();
  const events = groupedEvents[type];

  return (
    <div className="overflow-x-hidden">
      <section className="site-shell-wide py-12 lg:py-16">
        <div className="mx-auto flex max-w-[56rem] flex-col items-center gap-5 text-center">
          <Link
            href="/portfolio"
            className="elza inline-flex h-10 items-center justify-center rounded-full border border-white/12 bg-white/4 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/78 transition hover:bg-white/8"
          >
            Back to Portfolio
          </Link>
          <span className="elza inline-flex rounded-full border border-[#00D8FF]/30 bg-[#00D8FF]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#00D8FF]">
            {type}
          </span>
          <h1 className="recoleta text-[clamp(2.35rem,6vw,4.75rem)] font-bold leading-[0.95] text-white">
            {copy.title}
          </h1>
          <p className="elza max-w-[44rem] text-[15px] leading-7 text-white/78 lg:text-[17px]">
            {copy.description}
          </p>
        </div>
      </section>

      {!events.length ? (
        <section className="site-shell pb-14 lg:pb-18">
          <div className="mx-auto max-w-[42rem] rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,.25)]">
            <h2 className="recoleta text-[28px] font-bold text-white">
              No events published yet for this category.
            </h2>
            <p className="elza mt-3 text-[15px] leading-7 text-white/72">
              Check back soon or return to the portfolio overview to browse the
              other categories.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/portfolio"
                className="elza inline-flex h-11 items-center justify-center rounded-full border border-[#00D8FF] px-5 text-sm font-bold text-white transition hover:bg-white/6"
              >
                Return to Portfolio
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="site-shell pb-10 md:hidden">
            <div className="mx-auto flex w-full max-w-[30rem] flex-col items-center gap-4 sm:gap-5">
              {events.map((event, index) => {
                const reverse = index % 2 === 1;
                const tone: CardTone = index % 2 === 0 ? "yellow" : "cyan";

                return (
                  <MobileEventCard
                    key={event.id}
                    event={event}
                    tone={tone}
                    reverse={reverse}
                  />
                );
              })}
            </div>
          </section>

          <section className="hidden md:block">
            <div className="site-shell-wide pb-14 lg:pb-18">
              <div className={`${railInner} space-y-10`}>
                {events.map((event, index) => {
                  const reverse = index % 2 === 1;
                  const tone: CardTone = index % 2 === 0 ? "yellow" : "cyan";

                  return (
                    <div
                      key={event.id}
                      className={[
                        "grid items-stretch gap-6 lg:gap-8",
                        reverse
                          ? "md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]"
                          : "md:grid-cols-[minmax(0,1fr)_16rem] lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]",
                      ].join(" ")}
                    >
                      {reverse ? (
                        <>
                          <EventPanel event={event} tone={tone} />
                          <EventFigure event={event} priority={index < 2} />
                        </>
                      ) : (
                        <>
                          <EventFigure event={event} priority={index < 2} />
                          <EventPanel event={event} tone={tone} />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
