import type { Metadata } from "next";
import AudienceRegisterForm from "./AudienceRegisterForm";

export const metadata: Metadata = {
  title: "Join the Audience List | Rafsan Sabab",
  description: "Join the Rafsan Sabab audience list and get notified about future events.",
};

export default async function AudienceRegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ show?: string }>;
}) {
  const params = searchParams ? await searchParams : {};

  return <AudienceRegisterForm show={params.show} />;
}
