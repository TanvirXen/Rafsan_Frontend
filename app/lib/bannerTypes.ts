// somewhere shared, e.g. app/lib/bannerTypes.ts
export type BannerApi = {
  type: "about" | "gallery";
  title?: string;
  subtitle?: string;
  kicker?: string;
  ctaLabel?: string;
  ctaHref?: string;
  mobileImage?: string;
  desktopImage?: string;
  heroImage?: string;
  alt?: string;
};
