// app/allEvents/page.tsx
import React from "react";
import UpcomingEvents from "./components/upcomingEvents";
import Newsletter from "../section/newsletter";

export const revalidate = 60;

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
      <UpcomingEvents showFilter={showFilter} />
      <Newsletter />
    </div>
  );
}
