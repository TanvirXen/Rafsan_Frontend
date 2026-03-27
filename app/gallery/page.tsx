// app/gallery/page.tsx
import GalleryBanner from "./components/galleryBanner";
import GalleryNotableEvents from "./components/galleryNotableEvents";
import ShotsSection from "./components/shotSection.tsx/page";
import apiList from "@/apiList";

export const revalidate = 60;

type Shot = {
  _id: string;
  image: string;
  sequence: number;
};

type NotableEventApi = {
  _id: string;
  date: string; // ISO
  imageLink: string;
  description: string;
  title: string;
  featured: boolean;
};

export type FeaturedEvent = {
  date: string;
  title: string;
  blurb: string;
  img: string;
  alt?: string;
};

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

async function fetchShots(): Promise<Shot[]> {
  const res = await fetch(apiList.shots.list, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to load shots", await res.text());
    return [];
  }

  const json = await res.json();
  const shots: Shot[] = (json.shots || []) as Shot[];
  return shots.sort((a, b) => a.sequence - b.sequence);
}

async function fetchNotableEvents(): Promise<{
  featured?: FeaturedEvent;
  events: FeaturedEvent[];
}> {
  const res = await fetch(apiList.notableEvents.list, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to load notable events", await res.text());
    return { featured: undefined, events: [] };
  }

  const json = await res.json();
  const apiEvents: NotableEventApi[] = json.events || [];

  if (!apiEvents.length) {
    return { featured: undefined, events: [] };
  }

  const mapped: FeaturedEvent[] = apiEvents.map((e) => ({
    date: new Date(e.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    title: e.title,
    blurb: e.description,
    img: e.imageLink,
    alt: e.title,
  }));

  const featuredIndex = apiEvents.findIndex((e) => e.featured);
  const featured =
    featuredIndex >= 0 ? mapped[featuredIndex] : mapped[0];

  const rest = mapped.filter((e) => e !== featured).slice(0, 5);

  return { featured, events: rest };
}

async function fetchGalleryBanner(): Promise<BannerApi | null> {
  try {
    const res = await fetch(apiList.banners.get("gallery"), {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error("Failed to fetch gallery banner", await res.text());
      return null;
    }
    const json = await res.json();
    return (json.banner ?? null) as BannerApi | null;
  } catch (e) {
    console.error("Error fetching gallery banner", e);
    return null;
  }
}

export default async function Page() {
  const [shots, notable, banner] = await Promise.all([
    fetchShots(),
    fetchNotableEvents(),
    fetchGalleryBanner(),
  ]);

  return (
    <>
      <GalleryBanner
        title={banner?.title || "Media Gallery"}
        subtitle={
          banner?.subtitle ||
          "Some of the remarkable events that I have had the privilege to host."
        }
        src={banner?.heroImage || "/assets/mediaB.jpg"}
        alt={banner?.alt || banner?.title || "Media Gallery hero"}
      />

      <GalleryNotableEvents
        featured={notable.featured}
        events={notable.events}
      />

      <ShotsSection shots={shots} />
    </>
  );
}
