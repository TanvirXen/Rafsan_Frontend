import Help from "./section/help";
import Hero from "./section/hero";
import Newsletter, { NewsletterSettings } from "./section/newsletter";
import NotableEvents, { NotableEventCard } from "./section/NotableEvents";
import StoryTeaser from "./section/story-teaser";
import WatchShows from "./section/WatchShows";
import UpcomingEventsHome from "./section/upcomingEventsHome";
import apiList from "@/apiList";

// ISR: rebuild at most once every 60 seconds
export const revalidate = 60;

/* ---------- Types ---------- */

type IconName = "Users" | "Calendar" | "Award" | "TrendingUp" | "Globe";

type HelpKey =
  | "sessions_workshops"
  | "corporate_shows"
  | "hosting_event"
  | "brand_collab";

type QuickFact = {
  id: string;
  title: string;
  icon: IconName;
  description: string;
};

type HelpCard = {
  id: string;
  key: HelpKey;
  title: string;
  description: string;
};

type SettingsDto = {
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
  heroSection?: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
  };
  aboutSection?: { title?: string; description?: string; image?: string };
  quickFacts?: QuickFact[];
  helpSection?: { cards?: HelpCard[] };
};

type NotableEventApi = {
  _id: string;
  title: string;
  date: string; // ISO
  imageLink: string;
  description: string;
  featured: boolean;
};

/* ---------- Notable Events from API (ISR 60) ---------- */

async function fetchNotableEventsHome(): Promise<NotableEventCard[]> {
  try {
    const res = await fetch(apiList.notableEvents.list, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to load notable events", await res.text());
      return [];
    }

    const json = await res.json();
    const apiEvents: NotableEventApi[] = json.events || [];
    if (!apiEvents.length) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = apiEvents
      .filter((e) => {
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() >= today.getTime();
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let selected: NotableEventApi[];

    if (upcoming.length) {
      selected = upcoming.slice(0, 2);
    } else {
      const pastSorted = [...apiEvents].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      selected = pastSorted.slice(0, 2);
    }

    const mapped: NotableEventCard[] = selected.map((e) => ({
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

    return mapped;
  } catch (err) {
    console.error("Error fetching notable events", err);
    return [];
  }
}

/* ---------- Settings (Hero / About / Help / QuickFacts) with ISR 60 ---------- */

async function fetchSettings(): Promise<SettingsDto | null> {
  try {
    const res = await fetch(apiList.settings.get, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to load settings", await res.text());
      return null;
    }

    const j = await res.json();
    const s: SettingsDto = j.setting || j.data || {};
    return s;
  } catch (e) {
    console.error("Error fetching settings", e);
    return null;
  }
}

/* ---------- Newsletter settings (ISR 60) ---------- */

async function fetchNewsletterSettings(): Promise<NewsletterSettings | null> {
  try {
    const res = await fetch(apiList.newsletter.settingsGet, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to load newsletter settings", await res.text());
      return null;
    }

    const j = await res.json();
    const setting: NewsletterSettings = j.setting || j.data || null;
    return setting;
  } catch (e) {
    console.error("Error fetching newsletter settings", e);
    return null;
  }
}

export default async function Home() {
  const [notableEvents, settings, newsletterSettings] = await Promise.all([
    fetchNotableEventsHome(),
    fetchSettings(),
    fetchNewsletterSettings(),
  ]);

  const hero = settings?.heroSection;
  const about = settings?.aboutSection;

  return (
    <div>
      {/* HERO NOW DRIVEN BY CMS SETTINGS (ISR) */}
      <Hero
        title={hero?.title}
        subtitle={hero?.subtitle}
        description={hero?.description}
        image={hero?.image}
      />

      <Help />

      <StoryTeaser
        title={about?.title}
        description={about?.description}
        image={about?.image}
      />

      {/* 3D carousel (must be hydration-safe internally) */}
      <WatchShows />

      <NotableEvents events={notableEvents} />

      <div className='pb-10'>{/* <WorkShop /> */}</div>

      <UpcomingEventsHome />

      {/* Newsletter section now fully driven by CMS settings + ISR 60 */}
      <Newsletter settings={newsletterSettings} />
    </div>
  );
}
