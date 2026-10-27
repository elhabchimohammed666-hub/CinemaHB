import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Check, Play, Star, X } from "lucide-react";

export default function MediaModal({ media, onClose, onToggleWatchlist, saved }) {
  useEffect(() => {
    if (!media) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [media, onClose]);

  return (
    <AnimatePresence>
      {media && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.article
            aria-labelledby="media-modal-title"
            aria-modal="true"
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#17181e] shadow-2xl"
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            role="dialog"
            transition={{ duration: 0.22 }}
          >
            <div className="relative h-56 sm:h-80">
              <img alt="" className="h-full w-full object-cover" src={media.backdrop || media.poster} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17181e] via-black/15 to-black/20" />
              <button
                aria-label="Fermer les détails"
                className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/80"
                onClick={onClose}
                type="button"
              >
                <X size={19} />
              </button>
            </div>
            <div className="relative -mt-12 p-6 sm:-mt-16 sm:p-9">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {media.category === "film" ? "Film" : media.category === "anime" ? "Animé" : "Série"}
              </span>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl" id="media-modal-title">{media.title}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/65">
                <span>{media.year}</span>
                <span>{media.duration}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
                  <Star fill="currentColor" size={14} /> {media.rating} / 10
                </span>
              </div>
              <p className="mt-5 max-w-2xl leading-7 text-white/70">{media.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {media.genres.map((genre) => (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65" key={genre}>
                    {genre}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-bold text-ink transition hover:bg-white/85" type="button">
                  <Play fill="currentColor" size={17} /> Bande-annonce
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                  onClick={() => onToggleWatchlist(media.id)}
                  type="button"
                >
                  {saved ? <Check size={17} /> : <Bookmark size={17} />}
                  {saved ? "Dans ma liste" : "Ma liste"}
                </button>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
