import type { ReactNode } from "react";
import Link from "next/link";

export type FAQTag = "General" | "Shows" | "Booking" | "Media";

export type FAQItem = {
  q: string;
  a: ReactNode;
  tag: FAQTag;
  search: string;
  answerText: string;
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    tag: "General",
    q: "Who is Rafsan Sabab?",
    search:
      "Who is Rafsan Sabab Rafsan Sabab host content creator storyteller live shows podcasts stage events official hub shows episodes tickets updates",
    answerText:
      "Rafsan Sabab is a host, content creator, and storyteller known for live shows, podcasts, and stage events. This site is the official hub for shows, episodes, tickets, and updates.",
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
    q: "What kind of events does Rafsan Sabab host?",
    search:
      "What kind of events does Rafsan Sabab host corporate events college programs brand activations live shows stage hosting emcee MC Bangladesh",
    answerText:
      "Rafsan Sabab hosts corporate events, college programs, brand activations, live shows, stage events, and audience-facing entertainment formats.",
    a: (
      <>
        Rafsan Sabab hosts corporate events, college programs, brand activations,
        live shows, stage events, and audience-facing entertainment formats.
      </>
    ),
  },
  {
    tag: "General",
    q: "Is Rafsan Sabab available as an emcee or MC?",
    search:
      "Is Rafsan Sabab available as an emcee or MC event host Bangladesh emcee MC corporate show stage host",
    answerText:
      "Yes. Rafsan Sabab is available as an emcee or MC for corporate shows, live events, college programs, and branded experiences.",
    a: (
      <>
        Yes. Rafsan Sabab is available as an emcee or MC for corporate shows,
        live events, college programs, and branded experiences.
      </>
    ),
  },
  {
    tag: "General",
    q: "Where can I watch the episodes?",
    search:
      "Where can I watch the episodes YouTube official channel browse Shows page",
    answerText:
      "Most episodes are published on YouTube. You can visit the official channel or browse the Shows page.",
    a: (
      <>
        Most episodes are published on YouTube. You can visit the{" "}
        <Link
          href="https://www.youtube.com/@WHATASHOW_OFFICIAL"
          className="text-[#00D8FF] underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
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
    search:
      "How do I find events for a specific show Get Tickets show page All Events filtered",
    answerText:
      "Open a show page and hit Get Tickets. You will be taken to All Events with the show already filtered.",
    a: (
      <>
        Open a show page and hit <b>Get Tickets</b>. You&apos;ll be taken to All
        Events with the show already filtered.
      </>
    ),
  },
  {
    tag: "Shows",
    q: "Do you announce upcoming shows in advance?",
    search:
      "Do you announce upcoming shows in advance upcoming events listed All Events social pages show banners",
    answerText:
      "Yes, upcoming events are listed in All Events. Major announcements also appear on social pages and the show banners.",
    a: (
      <>
        Yes, upcoming events are listed in All Events. Major announcements also
        appear on social pages and the show banners.
      </>
    ),
  },
  {
    tag: "Shows",
    q: "Can I attend with friends or in a group?",
    search:
      "Can I attend with friends or in a group group limited seating rules event details rules section",
    answerText:
      "Yes. If an event has group or limited seating rules, you will see it in the event details and rules section.",
    a: (
      <>
        Absolutely. If an event has group or limited seating rules, you&apos;ll
        see it in the event details and rules section.
      </>
    ),
  },
  {
    tag: "Booking",
    q: "How can I book Rafsan for a corporate event or live show?",
    search:
      "How can I book Rafsan for a corporate event or live show Connect event details date venue city audience size event type",
    answerText:
      "Go to Connect and send your event details: date, venue or city, audience size, and event type. The team will respond with availability and next steps.",
    a: (
      <>
        Go to{" "}
        <Link
          href="/connect"
          className="text-[#00D8FF] underline underline-offset-4"
        >
          Connect
        </Link>{" "}
        and send your event details: date, venue or city, audience size, and
        event type. The team will respond with availability and next steps.
      </>
    ),
  },
  {
    tag: "Booking",
    q: "Can I book Rafsan Sabab as a corporate event host in Bangladesh?",
    search:
      "Can I book Rafsan Sabab as a corporate event host in Bangladesh best event host corporate event host Bangladesh",
    answerText:
      "Yes. Use the Connect page to inquire about Rafsan Sabab as a corporate event host in Bangladesh or for nearby regional events.",
    a: (
      <>
        Yes. Use the Connect page to inquire about Rafsan Sabab as a corporate
        event host in Bangladesh or for nearby regional events.
      </>
    ),
  },
  {
    tag: "Booking",
    q: "What information should I include in a booking request?",
    search:
      "What information should I include in a booking request event type preferred date time city venue audience size duration contact details",
    answerText:
      "Please include event type, preferred date and time, city or venue, expected audience size, event duration, and your contact details.",
    a: (
      <>
        Please include event type, preferred date and time, city or venue,
        expected audience size, event duration, and your contact details.
      </>
    ),
  },
  {
    tag: "Booking",
    q: "How early should I book?",
    search:
      "How early should I book 2-4 weeks in advance large venues peak seasons",
    answerText:
      "For best chances, book 2 to 4 weeks in advance. For large venues or peak seasons, earlier is better.",
    a: (
      <>
        For best chances, book 2 to 4 weeks in advance. For large venues or
        peak seasons, earlier is better.
      </>
    ),
  },
  {
    tag: "Booking",
    q: "Does Rafsan host in Bangla, English, or both?",
    search:
      "Does Rafsan host in Bangla English or both depending on event audience preference booking message",
    answerText:
      "Depending on the event and audience, hosting can be in Bangla, English, or a mix. Mention your preference in the booking message.",
    a: (
      <>
        Depending on the event and audience, hosting can be in Bangla,
        English, or a mix. Mention your preference in the booking message.
      </>
    ),
  },
  {
    tag: "Media",
    q: "Can I collaborate or invite Rafsan for a podcast or interview?",
    search:
      "Can I collaborate or invite Rafsan for a podcast interview Connect collaboration media message subject",
    answerText:
      "Yes. Use the Connect page and select Collaboration or Media in your message subject, or write it clearly at the start.",
    a: (
      <>
        Yes. Use the{" "}
        <Link
          href="/connect"
          className="text-[#00D8FF] underline underline-offset-4"
        >
          Connect
        </Link>{" "}
        page and select Collaboration/Media in your message subject, or write
        it clearly at the start.
      </>
    ),
  },
  {
    tag: "Media",
    q: "Can I use clips or photos from the show?",
    search:
      "Can I use clips or photos from the show official footage branding reuploads request permission press use timeline",
    answerText:
      "For official footage, branding, and re-uploads, please request permission first. For press use, include where it will be published and the usage timeline.",
    a: (
      <>
        For official footage, branding, and re-uploads, please request
        permission first. For press use, include where it will be published and
        the usage timeline.
      </>
    ),
  },
];

export function buildFaqJsonLd(items = FAQ_ITEMS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answerText,
      },
    })),
  };
}
