import Image from "next/image";
import Link from "next/link";
import apiList from "@/apiList";
import { slugifyTitle } from "../lib/slugifyTitle";

type SocialLinks = Partial<{
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  website: string;
}>;

type SettingsResponse = {
  setting?: {
    socialLinks?: SocialLinks;
  };
};

type ShowFromApi = {
  _id: string;
  title: string;
  thumbnail?: string;
  heroImage?: string;
};

function isValidUrl(url?: string | null) {
  if (!url || typeof url !== "string") return false;
  const u = url.trim();
  if (!/^https?:\/\//i.test(u)) return false;

  try {
    new URL(u);
    return true;
  } catch {
    return false;
  }
}

const SOCIAL_META: Record<
  "facebook" | "instagram" | "youtube" | "linkedin",
  { src: string; alt: string }
> = {
  facebook: { src: "/assets/Facebook.png", alt: "Facebook" },
  instagram: { src: "/assets/Instagram.png", alt: "Instagram" },
  youtube: { src: "/assets/Youtube.png", alt: "YouTube" },
  linkedin: { src: "/assets/Linkedin.png", alt: "LinkedIn" },
};

export default async function Footer() {
  const fallbackLinks: SocialLinks = {
    facebook: "https://www.facebook.com/rafsansababshows",
    instagram: "https://www.instagram.com/rafsan_sabab/?hl=en",
    youtube: "https://www.youtube.com/@RafsanSabab",
    linkedin: "https://www.linkedin.com/in/rafsan-sabab?originalSubdomain=bd",
  };

  let apiLinks: SocialLinks | undefined;
  try {
    const res = await fetch(apiList.settings.get, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = (await res.json()) as SettingsResponse;
      apiLinks = data?.setting?.socialLinks ?? {};
    }
  } catch {
    // ignore
  }

  const merged: SocialLinks = { ...fallbackLinks, ...(apiLinks || {}) };
  (Object.keys(merged) as (keyof SocialLinks)[]).forEach((k) => {
    if (!isValidUrl(merged[k])) delete merged[k];
  });

  let footerShows: { title: string; slug: string }[] = [];
  try {
    const res = await fetch(apiList.shows.list, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const json = (await res.json()) as
        | ShowFromApi[]
        | { shows?: ShowFromApi[] };
      const arr: ShowFromApi[] = Array.isArray(json) ? json : json.shows ?? [];

      footerShows = arr.map((s) => ({
        title: s.title,
        slug: slugifyTitle(s.title),
      }));
    }
  } catch (e) {
    console.error("Footer shows fetch failed", e);
  }

  const footerListClass = "elza space-y-1 text-[13px] md:space-y-2 md:text-[16px]";

  return (
    <footer className='relative mt-[60px] bg-[#121212] text-zinc-300'>
      <div className='site-shell'>
        <div className='h-0.5 w-full rounded-full bg-linear-gradient-to-r from-transparent via-[#00D8FF]/80 to-transparent' />
      </div>

      <div className='site-shell'>
        <div className='py-10 lg:flex lg:items-start lg:justify-between lg:gap-10 lg:py-[60px]'>
          <div className='w-full text-center lg:max-w-[24rem] lg:text-left'>
            <Link href='/' className='inline-block'>
              <h3 className='leading-none'>
                <span className='recoleta text-[26px] text-[#FFD928] md:text-[28px]'>
                  Rafsan
                </span>{" "}
                <span className='recoleta text-[26px] text-[#FFD928] md:text-[28px]'>
                  Sabab
                </span>
              </h3>
            </Link>

            <div className='mt-6 flex items-center justify-center gap-5 md:mt-8 lg:justify-start md:gap-6'>
              {(
                Object.keys(SOCIAL_META) as Array<keyof typeof SOCIAL_META>
              ).map((platform) => {
                const href = merged?.[platform];
                if (!href) return null;

                const { src, alt } = SOCIAL_META[platform];
                return <Social key={platform} href={href} src={src} alt={alt} />;
              })}
            </div>
          </div>

          <div className='mt-10 grid w-full grid-cols-1 gap-x-6 gap-y-6 text-center sm:grid-cols-2 lg:mt-0 lg:max-w-[40rem] lg:grid-cols-3 lg:text-left'>
            <div className='min-w-0'>
              <h4 className='recoleta mb-2 text-[16px] text-[#FFD928] md:mb-4 md:text-2xl'>
                Quick links
              </h4>
              <ul className={footerListClass}>
                <li>
                  <FooterLink href='/about'>About</FooterLink>
                </li>
                <li>
                  <FooterLink href='/portfolio'>Portfolio</FooterLink>
                </li>
                <li>
                  <FooterLink href='/faqs'>FAQs</FooterLink>
                </li>
                <li>
                  <FooterLink href='/connect'>Connect</FooterLink>
                </li>
              </ul>
            </div>

            <div className='min-w-0'>
              <h4 className='recoleta mb-2 text-[16px] text-[#FFD928] md:mb-4 md:text-2xl'>
                Shows
              </h4>
              <ul className={footerListClass}>
                {footerShows.length === 0 ? (
                  <li className='text-white/82'>Coming soon</li>
                ) : (
                  footerShows.map((s) => (
                    <li key={s.slug}>
                      <FooterLink href={`/shows/${s.slug}`}>{s.title}</FooterLink>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className='min-w-0 sm:col-span-2 lg:col-span-1'>
              <h4 className='recoleta mb-2 text-[16px] text-[#FFD928] md:mb-4 md:text-2xl'>
                More
              </h4>
              <ul className={footerListClass}>
                <li>
                  <FooterLink href='/privacy'>Privacy Policy</FooterLink>
                </li>
                <li>
                  <FooterLink href='/cookies'>Cookies Policy</FooterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-black'>
        <div className='site-shell py-4 md:py-5'>
          <p className='elza text-center text-[13px] text-[#FFD928] md:text-[15px]'>
            Copyright Rafsan Sabab 2026. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className='break-words text-white/82 transition hover:text-[#FFD928]'
    >
      {children}
    </Link>
  );
}

function Social({
  href,
  src,
  alt,
}: {
  href: string;
  src: string;
  alt: string;
}) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      className='inline-flex h-8 w-8 items-center justify-center rounded-md md:h-10 md:w-10'
      aria-label={alt}
      title={alt}
    >
      <Image
        src={src}
        alt={alt}
        width={36}
        height={36}
        className='h-6 w-6 opacity-90 transition hover:opacity-100 md:h-9 md:w-9'
      />
    </a>
  );
}
