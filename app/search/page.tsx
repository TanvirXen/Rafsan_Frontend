// app/search/page.tsx
import Link from "next/link";
import Image from "next/image";
import apiList from "@/apiList";
import { slugifyTitle } from "@/app/lib/slugifyTitle";

export const revalidate = 60;

type Show = {
  _id: string;
  title: string;
  thumbnail?: string;
  heroImage?: string;
  designVariant?: "cinematic" | "podcast";
};

type Episode = {
  _id: string;
  title: string;
  showId: string;
  seasonId: string;
  thumbnail?: string;
  link?: string;
};

async function fetchShowsList(): Promise<Show[]> {
  const res = await fetch(apiList.shows.list, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = (await res.json()) as Show[] | { shows?: Show[] };
  return Array.isArray(json) ? json : json.shows ?? [];
}

async function fetchShowEpisodes(showId: string): Promise<Episode[]> {
  const res = await fetch(apiList.shows.get(showId), { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = (await res.json()) as { episodes?: Episode[] };
  return json.episodes ?? [];
}

function pickShowImage(s: Show) {
  return (s.thumbnail && s.thumbnail.trim()) ||
    (s.heroImage && s.heroImage.trim()) ||
    "/assets/exp.png";
}

export default async function SearchPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await props.searchParams;
  const query = (q ?? "").trim();
  const qLower = query.toLowerCase();

  const shows = await fetchShowsList();

  if (!query) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16 text-white">
        <h1 className="recoleta text-3xl font-extrabold">Search</h1>
        <p className="mt-3 text-white/70">Type something like “Siam”, “Season 2”, or an episode title.</p>
        <div className="mt-8">
          <Link className="text-cyan-300 underline" href="/explore-shows">
            Browse shows →
          </Link>
        </div>
      </main>
    );
  }

  // 1) match shows by title
  const matchedShows = shows.filter((s) =>
    s.title.toLowerCase().includes(qLower)
  );

  // 2) match episodes by title (pull episodes from each show)
  //    If you have many shows, later we can add a real backend search endpoint.
  const episodesByShow = await Promise.all(
    shows.map(async (s) => ({
      show: s,
      episodes: await fetchShowEpisodes(s._id),
    }))
  );

  const matchedEpisodes = episodesByShow
    .flatMap(({ show, episodes }) =>
      episodes
        .filter((e) => e.title.toLowerCase().includes(qLower))
        .map((e) => ({ episode: e, show }))
    )
    .slice(0, 50); // safety limit

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 text-white">
      <div className="mb-10">
        <h1 className="recoleta text-3xl font-extrabold">Search results</h1>
        <p className="mt-2 text-white/70">
          Query: <span className="text-white">{query}</span>
        </p>
      </div>

      {/* SHOWS */}
      <section className="mb-12">
        <h2 className="recoleta text-xl font-extrabold">Shows</h2>

        {matchedShows.length === 0 ? (
          <p className="mt-3 text-white/60">No shows matched.</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedShows.map((s) => {
              const slug = slugifyTitle(s.title);
              return (
                <Link
                  key={s._id}
                  href={`/shows/${slug}`}
                  className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={pickShowImage(s)}
                      alt={s.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) calc(100vw - 2rem), 33vw"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                  </div>
                  <div className="p-4">
                    <p className="recoleta text-lg font-extrabold">{s.title}</p>
                    <p className="mt-1 text-sm text-white/70">
                      Open show →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* EPISODES */}
      <section>
        <h2 className="recoleta text-xl font-extrabold">Episodes</h2>

        {matchedEpisodes.length === 0 ? (
          <p className="mt-3 text-white/60">No episodes matched.</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedEpisodes.map(({ episode, show }) => {
              const showSlug = slugifyTitle(show.title);
              const epHref = episode.link?.trim();

              return (
                <div
                  key={episode._id}
                  className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={episode.thumbnail || "/assets/exp1.jpg"}
                      alt={episode.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) calc(100vw - 2rem), 33vw"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                  </div>

                  <div className="p-4">
                    <p className="elza text-xs text-white/70">Show</p>
                    <Link className="text-sm font-bold hover:underline" href={`/shows/${showSlug}`}>
                      {show.title}
                    </Link>

                    <p className="mt-2 recoleta text-base font-extrabold line-clamp-2">
                      {episode.title}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={`/shows/${showSlug}`}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold hover:bg-white/10"
                      >
                        Open show
                      </Link>

                      {epHref ? (
                        <a
                          href={epHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-[#00D8FF] px-3 py-1 text-xs font-extrabold text-[#00131b] hover:brightness-95"
                        >
                          Watch
                        </a>
                      ) : (
                        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/60">
                          No link
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="mt-14">
        <Link className="text-cyan-300 underline" href="/explore-shows">
          Browse shows →
        </Link>
      </div>
    </main>
  );
}
