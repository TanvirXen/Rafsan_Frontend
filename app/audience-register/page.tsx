import type { Metadata } from "next";
import AudienceRegisterForm from "./AudienceRegisterForm";
import { createPageMetadata } from "../lib/siteSeo";

export const metadata: Metadata = createPageMetadata({
  title: "Join the Audience List | Rafsan Sabab",
  description: "Join the Rafsan Sabab audience list and get notified about future events.",
  path: "/audience-register",
  noIndex: true,
});

export default async function AudienceRegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ show?: string }>;
}) {
  const params = searchParams ? await searchParams : {};

  return <AudienceRegisterForm show={params.show} />;
}
