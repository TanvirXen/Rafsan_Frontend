import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookies Policy | Rafsan Sabab",
  description:
    "Cookies policy for the Rafsan Sabab portfolio website, covering embedded media, analytics, and browser controls.",
};

const updatedOn = "August 28, 2026";

export default function CookiesPage() {
  return (
    <main className="site-shell mx-auto py-10 sm:py-14 lg:py-20">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(0,216,255,0.10)_0%,rgba(18,18,18,0.94)_36%,rgba(8,8,8,1)_100%)] px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,.45)] sm:px-8 lg:px-12 lg:py-12">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,217,40,.75),rgba(255,255,255,.2),transparent)]" />

        <div className="max-w-4xl">
          <p className="elza text-xs uppercase tracking-[0.35em] text-[#00D8FF]">
            Rafsan Sabab
          </p>
          <h1 className="recoleta mt-3 text-4xl leading-none text-[#FFD928] sm:text-5xl lg:text-7xl">
            Cookies Policy
          </h1>
          <p className="elza mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            This page explains how cookies and similar technologies may be used on
            the portfolio website to support embedded video, analytics, security,
            and a smoother browsing experience.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
            Effective date: {updatedOn}
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <article className="space-y-6 rounded-[24px] bg-black/30 p-6 backdrop-blur-md sm:p-8">
            <Section title="1. What cookies are">
              <p>
                Cookies are small text files stored by your browser. Similar
                technologies such as local storage, pixels, and embedded player
                data may also be used to remember preferences or measure usage.
              </p>
            </Section>

            <Section title="2. Cookies we may use">
              <ul className="list-disc space-y-2 pl-5">
                <li>Essential cookies for site functionality and security.</li>
                <li>Preference cookies to remember settings and choices.</li>
                <li>Analytics cookies to understand traffic and improve content.</li>
                <li>Embedded media cookies used by third-party video services.</li>
              </ul>
            </Section>

            <Section title="3. Why we use them">
              <p>
                On a portfolio site for an event host and influencer, cookies help
                keep navigation stable, measure which shows and pages are useful,
                and support embedded media such as YouTube playlists and players.
              </p>
              <p>
                They may also help prevent abuse, detect errors, and keep forms and
                interactions working reliably.
              </p>
            </Section>

            <Section title="4. Third-party cookies">
              <p>
                If you watch embedded videos or follow outbound social links, those
                third-party services may set their own cookies. Their behavior is
                controlled by their own privacy and cookie policies.
              </p>
            </Section>

            <Section title="5. Managing cookies">
              <ul className="list-disc space-y-2 pl-5">
                <li>Use your browser settings to block or delete cookies.</li>
                <li>Clear site data when you want to reset stored preferences.</li>
                <li>Disable embedded media interactions if you prefer less tracking.</li>
              </ul>
            </Section>

            <Section title="6. Changes to this policy">
              <p>
                This policy may be updated when the site changes or when cookie
                practices are adjusted. The latest version will always be posted on
                this page.
              </p>
            </Section>
          </article>

          <aside className="space-y-5">
            <InfoCard title="Common cookies here">
              <ul className="space-y-3 text-sm leading-6 text-white/80">
                <li>Session and security cookies</li>
                <li>Embedded YouTube media cookies</li>
                <li>Analytics / performance cookies</li>
                <li>Preference and browser storage</li>
              </ul>
            </InfoCard>

            <InfoCard title="Your control">
              <p className="text-sm leading-6 text-white/80">
                You can manage cookies in your browser at any time. Blocking some
                cookies may reduce functionality, but the main content of the site
                will still remain accessible.
              </p>
            </InfoCard>

            <InfoCard title="Need help?">
              <p className="text-sm leading-6 text-white/80">
                For questions about privacy or cookie use, go to the{" "}
                <Link href="/connect" className="text-[#00D8FF] underline underline-offset-4">
                  contact page
                </Link>
                .
              </p>
            </InfoCard>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="recoleta text-2xl leading-tight text-[#FFD928]">{title}</h2>
      <div className="elza space-y-3 text-[15px] leading-7 text-white/88">
        {children}
      </div>
    </section>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-black/25 p-5 backdrop-blur-md sm:p-6">
      <h2 className="recoleta text-xl text-[#00D8FF]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
