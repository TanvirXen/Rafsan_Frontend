import Image from "next/image";
import Link from "next/link";
import Newsletter from "../section/newsletter";
import apiList from "../../apiList";
import { slugifyTitle } from "../lib/slugifyTitle";

export const revalidate = 60;

type ShowFromApi = {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  heroImage?: string;
  seasons?: number;
  reels?: number;
  featured?: boolean;
};

type ShowCard = { id: string; title: string; src: string; alt: string };

async function fetchShows(): Promise<ShowCard[]> {
  try {
    const res = await fetch(apiList.shows.list, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch shows", res.status);
      return [];
    }

    const json = (await res.json()) as ShowFromApi[] | { shows?: ShowFromApi[] };
    const arr: ShowFromApi[] = Array.isArray(json) ? json : json.shows ?? [];

    return arr.map((s) => {
      const src =
        s.thumbnail && s.thumbnail.trim() !== ""
          ? s.thumbnail
          : s.heroImage && s.heroImage.trim() !== ""
            ? s.heroImage
            : "/assets/exp.png";

      return {
        id: s._id,
        title: s.title,
        src,
        alt: s.title,
      };
    });
  } catch (e) {
    console.error("Error fetching shows", e);
    return [];
  }
}

export default async function ExploreShowsPage() {
  const cardsToRender = await fetchShows();

  return (
    <main className='relative isolate text-white bg-[radial-gradient(50%_50%_at_50%_50%,rgba(18,18,18,0)_0%,#121212_100%),#2D1B59]'>
      <section className='relative isolate overflow-hidden'>
        <div
          className='pointer-events-none absolute inset-0 z-10'
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.36) 25%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.96) 100%)",
          }}
        />

        <div className='site-shell relative z-20 py-10 sm:py-12 lg:py-16'>
          <div className='mx-auto w-full max-w-[1100px]'>
            <div className='mb-6 flex items-center gap-3 border-l-4 border-[#00D8FF] pl-5'>
              <h1 className='recoleta text-[28px] font-bold leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,.7)] sm:text-[34px] lg:text-[40px]'>
                Watch Shows
              </h1>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              {cardsToRender.length === 0 ? (
                <p className='col-span-full text-sm text-white/70'>
                  Shows will appear here soon.
                </p>
              ) : (
                cardsToRender.map((c) => {
                  const slug = slugifyTitle(c.title);
                  return (
                    <Link
                      key={c.id}
                      href={`/shows/${slug}`}
                      aria-label={`Open ${c.title}`}
                      className='group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:aspect-[3/4] xl:aspect-[4/5]'
                    >
                      <Image
                        src={c.src}
                        alt={c.alt}
                        fill
                        sizes='(max-width: 640px) calc(100vw - 2rem), (max-width: 1280px) 50vw, 260px'
                        className='object-cover transition-transform duration-300 group-hover:scale-[1.04]'
                      />
                      <div className='absolute inset-0 bg-black/55 transition-opacity duration-300 group-hover:bg-black/45' />
                      <div className='absolute inset-0 grid place-items-center p-4'>
                        <p className='recoleta text-center text-[1.6rem] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,.85)]'>
                          {c.title}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      <section className='mt-6 sm:mt-8 md:mt-10'>
        <Newsletter />
      </section>
    </main>
  );
}
