type EventImageShape = {
  category?: string;
  imageLinkBg?: string;
  imageLinkOverlay?: string;
  bannerImage?: string;
  cardImage?: string;
};

function normalizeCategory(value?: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function pickFirstImage(...values: Array<string | undefined | null>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

type OccurrenceShape = {
  image?: string;
};

export function pickEventCardImage(
  event: EventImageShape,
  fallback = "/assets/exp1.jpg",
  occ?: OccurrenceShape
) {
  const category = normalizeCategory(event.category);
  const occImage = occ?.image ? occ.image.trim() : "";

  if (category === "what_a_show") {
    return (
      pickFirstImage(
        occImage,
        event.imageLinkBg,
        event.bannerImage,
        event.imageLinkOverlay,
        event.cardImage
      ) || fallback
    );
  }

  return (
    pickFirstImage(
      occImage,
      event.imageLinkOverlay,
      event.cardImage,
      event.imageLinkBg,
      event.bannerImage
    ) || fallback
  );
}

export function pickEventBannerAssets(
  event: EventImageShape,
  fallback = "/assets/reg.png",
  occ?: OccurrenceShape
) {
  const category = normalizeCategory(event.category);
  const occImage = occ?.image ? occ.image.trim() : "";

  if (category === "what_a_show") {
    const bannerSrc =
      pickFirstImage(
        occImage,
        event.imageLinkBg,
        event.bannerImage,
        event.imageLinkOverlay,
        event.cardImage
      ) || fallback;

    return {
      posterSrc: bannerSrc,
      bgSrc: bannerSrc,
    };
  }

  const posterSrc =
    pickFirstImage(
      occImage,
      event.imageLinkOverlay,
      event.cardImage,
      event.imageLinkBg,
      event.bannerImage
    ) || fallback;
  const bgSrc =
    pickFirstImage(
      occImage,
      event.imageLinkBg,
      event.bannerImage,
      event.cardImage,
      event.imageLinkOverlay
    ) || posterSrc;

  return {
    posterSrc,
    bgSrc,
  };
}
