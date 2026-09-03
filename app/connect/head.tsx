import { SITE_KEYWORDS, SITE_NAME, getSiteUrl } from "../lib/siteSeo";

export default function Head() {
  const title = "Connect | Rafsan Sabab";
  const description =
    "Contact Rafsan Sabab for event hosting, emcee bookings, live shows, podcast collaborations, brand partnerships, and media inquiries.";
  const canonical = getSiteUrl("/connect");

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={[
          ...SITE_KEYWORDS,
          "contact Rafsan Sabab",
          "book Rafsan Sabab",
          "event host contact",
          "media inquiry",
          "brand partnership",
        ].join(", ")}
      />
      <meta name="author" content={SITE_NAME} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={getSiteUrl("/logo.png")} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getSiteUrl("/logo.png")} />
    </>
  );
}
