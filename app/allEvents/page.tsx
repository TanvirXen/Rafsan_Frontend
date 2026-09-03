// app/allEvents/page.tsx
import React from "react";
import UpcomingEvents from "./components/upcomingEvents";
import PastEvents from "./components/pastEvents";
import Newsletter from "../section/newsletter";
import type { Metadata } from "next";
import { createPageMetadata } from "../lib/siteSeo";

export const metadata: Metadata = createPageMetadata({
  title: "All Events | Rafsan Sabab",
  description: "Browse all upcoming and past Rafsan Sabab event listings.",
  path: "/events",
  keywords: ["all Rafsan Sabab events", "event listings"],
  noIndex: true,
});

export const revalidate = 15;

type PageProps = {
  searchParams?: Promise<{
    show?: string | string[];
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const raw = sp.show;

  const showFilter =
    typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : undefined;

  return (
    <div>
      <h1 className="sr-only">All Rafsan Sabab Events</h1>
      <UpcomingEvents showFilter={showFilter} />
      <PastEvents showFilter={showFilter} />
      <Newsletter />
    </div>
  );
}
