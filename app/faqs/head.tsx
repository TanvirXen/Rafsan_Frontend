import { FAQ_ITEMS, buildFaqJsonLd } from "./faqData";
import { SITE_KEYWORDS, SITE_META_IMAGE, SITE_NAME, getSiteUrl } from "../lib/siteSeo";

export default function Head() {
  const title = "FAQs | Booking Rafsan Sabab";
  const description = "Answers about booking Rafsan Sabab for events, workshops, shows, and brand collaborations.";
  const canonical = getSiteUrl("/faqs");
  const jsonLd = buildFaqJsonLd(FAQ_ITEMS);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={[
          ...SITE_KEYWORDS,
          "FAQ",
          "Rafsan Sabab FAQ",
          "event host FAQ",
          "booking FAQ",
          "emcee FAQ",
        ].join(", ")}
      />
      <meta name="author" content={SITE_NAME} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={getSiteUrl(SITE_META_IMAGE)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getSiteUrl(SITE_META_IMAGE)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
