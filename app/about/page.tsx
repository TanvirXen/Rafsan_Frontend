// app/about/page.tsx
import type { Metadata } from "next";
import React from "react";
import AboutBanner from "./components/aboutBanner";
import Newsletter from "../section/newsletter";
import SetbackSection from "./components/setbackSection";
import JourneySection from "./components/journeySection";
import apiList from "@/apiList";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_META_IMAGE, SITE_NAME, SITE_TITLE } from "../lib/siteSeo";

export const revalidate = 15;
export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS, "about Rafsan Sabab", "Rafsan Sabab biography"],
  alternates: { canonical: "/about" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/about",
    siteName: SITE_NAME,
    images: [{ url: SITE_META_IMAGE, alt: SITE_NAME }],
  },
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

async function fetchAboutBanner(): Promise<BannerApi | null> {
  try {
    const res = await fetch(apiList.banners.get("about"), {
      next: { revalidate: 15 },
    });
    if (!res.ok) {
      console.error("Failed to fetch about banner", await res.text());
      return null;
    }
    const json = await res.json();
    return (json.banner ?? null) as BannerApi | null;
  } catch (e) {
    console.error("Error fetching about banner", e);
    return null;
  }
}

export default async function Page() {
  const banner = await fetchAboutBanner();

  return (
    <div>
      <AboutBanner banner={banner} />
      {/* <QuickFacts /> */}
      <JourneySection />
      <SetbackSection />
      <Newsletter />
    </div>
  );
}
