import { SITE_KEYWORDS, SITE_META_IMAGE, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, getSiteUrl } from "../lib/siteSeo";

export default function Head() {
  const title = SITE_TITLE;
  const description = SITE_DESCRIPTION;
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
      <meta property="og:image" content={getSiteUrl(SITE_META_IMAGE)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getSiteUrl(SITE_META_IMAGE)} />
    </>
  );
}
