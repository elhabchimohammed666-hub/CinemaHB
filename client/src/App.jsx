import { useMemo, useState } from "react";
import { ArrowUp, Clapperboard, Github } from "lucide-react";

import HeroBanner from "./components/HeroBanner.jsx";
import MediaCarousel from "./components/MediaCarousel.jsx";
import MediaModal from "./components/MediaModal.jsx";
import Navbar from "./components/Navbar.jsx";
import { catalog, featuredMedia } from "./data/catalog.js";

const rows = [
  { id: "films", title: "Films à ne pas manquer", category: "film" },
  { id: "series", title: "Séries qui font parler", category: "series" },
  { id: "animes", title: "Le meilleur de l’animation", category: "anime" },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");

  const filteredCatalog = useMemo(() => {
    if (!normalizedQuery) return catalog;
    return catalog.filter((media) =>
      [media.title, media.category, ...media.genres]
        .join(" ")
        .toLocaleLowerCase("fr")
        .includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const toggleWatchlist = (mediaId) => {
    setWatchlist((current) =>
      current.includes(mediaId)
        ? current.filter((id) => id !== mediaId)
        : [...current, mediaId],
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-ink text-white">
      <Navbar onSearch={setQuery} search={query} />
      <main>
        {!normalizedQuery && <HeroBanner media={featuredMedia} onDetails={setSelectedMedia} />}

        {normalizedQuery && (
          <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-32 sm:px-8 lg:px-12">
            <p className="text-sm text-white/50">Résultats de recherche</p>
            <h1 className="mt-1 text-3xl font-bold">
              {filteredCatalog.length} résultat{filteredCatalog.length > 1 ? "s" : ""} pour « {query} »
            </h1>
          </div>
        )}

        {!normalizedQuery && (
          <div className="relative z-10 -mt-12 space-y-10 pb-16 sm:-mt-16">
            <MediaCarousel
              id="tendances"
              media={catalog.slice(0, 6)}
              onSelect={setSelectedMedia}
              onToggleWatchlist={toggleWatchlist}
              title="Tendances du moment"
              watchlist={watchlist}
            />
            {rows.map((row) => (
              <MediaCarousel
                id={row.id}
                key={row.id}
                media={catalog.filter((media) => media.category === row.category)}
                onSelect={setSelectedMedia}
                onToggleWatchlist={toggleWatchlist}
                title={row.title}
                watchlist={watchlist}
              />
            ))}
            {watchlist.length > 0 && (
              <MediaCarousel
                id="ma-liste"
                media={catalog.filter((media) => watchlist.includes(media.id))}
                onSelect={setSelectedMedia}
                onToggleWatchlist={toggleWatchlist}
                title="Ma liste"
                watchlist={watchlist}
              />
            )}
          </div>
        )}

        {normalizedQuery && (
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-4 px-5 pb-20 sm:grid-cols-3 sm:px-8 md:grid-cols-4 lg:grid-cols-5 lg:px-12">
            {filteredCatalog.map((media) => (
              <button className="overflow-hidden rounded-xl text-left" key={media.id} onClick={() => setSelectedMedia(media)} type="button">
                <img alt={`Affiche de ${media.title}`} className="aspect-[2/3] w-full object-cover transition hover:scale-[1.03]" src={media.poster} />
                <span className="mt-2 block font-semibold">{media.title}</span>
              </button>
            ))}
            {filteredCatalog.length === 0 && (
              <p className="col-span-full rounded-xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
                Aucun titre ne correspond à cette recherche. Essayez un autre nom ou un genre.
              </p>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.07] px-5 py-8 text-sm text-white/40 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
          <a href="#accueil" className="flex items-center gap-2 font-semibold text-white/65">
            <Clapperboard size={17} /> stream<span className="-ml-2 text-accent">vibe</span>
            <span className="ml-1 font-normal text-white/35">— Une histoire pour chaque humeur.</span>
          </a>
          <div className="flex items-center gap-4">
            <a className="transition hover:text-white" href="#accueil">Confidentialité</a>
            <a className="transition hover:text-white" href="#accueil">Aide</a>
            <a aria-label="GitHub" className="transition hover:text-white" href="https://github.com/" rel="noreferrer" target="_blank">
              <Github size={17} />
            </a>
            <a aria-label="Retour en haut" className="rounded-full border border-white/10 p-2 transition hover:border-white/30 hover:text-white" href="#accueil">
              <ArrowUp size={15} />
            </a>
          </div>
        </div>
      </footer>

      <MediaModal
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onToggleWatchlist={toggleWatchlist}
        saved={selectedMedia ? watchlist.includes(selectedMedia.id) : false}
      />
    </div>
  );
}
