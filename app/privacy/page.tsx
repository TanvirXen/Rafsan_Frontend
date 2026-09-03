import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from "../lib/siteSeo";

export const metadata: Metadata = {
  title: "Privacy Policy | Rafsan Sabab",
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS, "privacy policy", "data policy", "contact forms"],
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Rafsan Sabab",
    description: SITE_DESCRIPTION,
    url: "/privacy",
    siteName: SITE_NAME,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: SITE_NAME }],
  },
};

const updatedOn = "August 28, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="site-shell mx-auto py-10 sm:py-14 lg:py-20">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(168,85,247,0.14)_0%,rgba(18,18,18,0.92)_34%,rgba(8,8,8,1)_100%)] px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,.45)] sm:px-8 lg:px-12 lg:py-12">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,216,255,.75),rgba(255,255,255,.2),transparent)]" />

        <div className="max-w-4xl">
          <p className="elza text-xs uppercase tracking-[0.35em] text-[#00D8FF]">
            Rafsan Sabab
          </p>
          <h1 className="recoleta mt-3 text-4xl leading-none text-[#FFD928] sm:text-5xl lg:text-7xl">
            Privacy Policy
          </h1>
          <p className="elza mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            This page explains how personal information is handled when you browse
            Rafsan Sabab&apos;s portfolio website, watch embedded media, submit a
            contact form, or interact with the site&apos;s social and newsletter
            features.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
            Effective date: {updatedOn}
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <article className="space-y-6 rounded-[24px] bg-black/30 p-6 backdrop-blur-md sm:p-8">
            <PolicySection title="1. Information we collect">
              <p>
                We may collect information you choose to send us directly, such as
                your name, email address, phone number, organization, event details,
                or message when you submit a contact or booking form.
              </p>
              <p>
                We may also collect limited technical data automatically, including
                IP address, browser type, device information, pages visited, time
                spent on the site, and referral data. This is used to keep the site
                secure and understand how people use it.
              </p>
            </PolicySection>

            <PolicySection title="2. How we use information">
              <ul className="list-disc space-y-2 pl-5">
                <li>Respond to inquiries and booking requests.</li>
                <li>Share updates about events, shows, and collaborations.</li>
                <li>Improve site performance, content, and user experience.</li>
                <li>Protect the website from spam, abuse, and technical issues.</li>
              </ul>
            </PolicySection>

            <PolicySection title="3. Embedded media and social links">
              <p>
                This website may include embedded YouTube videos, playlists, and
                social media links. When you interact with those services, their own
                privacy policies and cookie practices may apply.
              </p>
              <p>
                Embedded video services can set cookies or use similar technologies
                to deliver and measure content. If you do not want that, you can
                avoid interacting with the embed or adjust your browser settings.
              </p>
            </PolicySection>

            <PolicySection title="4. Sharing and disclosure">
              <p>
                We do not sell personal information. We may share information with
                trusted service providers that help operate the site, such as hosting,
                analytics, email delivery, or form processing services.
              </p>
              <p>
                We may also disclose information if required to do so by law, to
                respond to valid legal requests, or to protect our rights, visitors,
                or the security of the website.
              </p>
            </PolicySection>

            <PolicySection title="5. Data retention">
              <p>
                We keep contact messages and related business records only as long as
                needed for communication, collaboration, recordkeeping, or legal
                compliance. Technical logs may be retained for a shorter period to
                maintain the service and diagnose issues.
              </p>
            </PolicySection>

            <PolicySection title="6. Your choices">
              <ul className="list-disc space-y-2 pl-5">
                <li>You can request access, correction, or deletion of your data.</li>
                <li>You can unsubscribe from email updates at any time.</li>
                <li>You can change cookie settings in your browser.</li>
              </ul>
            </PolicySection>

            <PolicySection title="7. Children">
              <p>
                This website is intended for a general audience and is not directed to
                children under 13. We do not knowingly collect personal information
                from children under 13.
              </p>
            </PolicySection>
          </article>

          <aside className="space-y-5">
            <AsideCard title="What this site uses">
              <ul className="space-y-3 text-sm leading-6 text-white/80">
                <li>Contact and inquiry forms</li>
                <li>Embedded YouTube content</li>
                <li>Social media outbound links</li>
                <li>Basic analytics and security tools</li>
              </ul>
            </AsideCard>

            <AsideCard title="Your rights">
              <p className="text-sm leading-6 text-white/80">
                If you want to access, update, or remove information you submitted,
                send a request through the contact page. We will respond where
                reasonably possible and consistent with applicable law.
              </p>
            </AsideCard>

            <AsideCard title="Contact">
              <p className="text-sm leading-6 text-white/80">
                For privacy questions or data requests, use the{" "}
                <Link href="/connect" className="text-[#00D8FF] underline underline-offset-4">
                  contact page
                </Link>
                .
              </p>
            </AsideCard>
          </aside>
        </div>
      </section>
    </main>
  );
}

function PolicySection({
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

function AsideCard({
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
