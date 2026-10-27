import { motion } from "framer-motion";
import { Info, Play, Sparkles } from "lucide-react";

export default function HeroBanner({ media, onDetails }) {
  return (
    <section
      className="relative flex min-h-[690px] items-center overflow-hidden bg-cover bg-center pb-20 pt-32 sm:min-h-[740px]"
      id="accueil"
      style={{ backgroundImage: `url("${media.backdrop}")` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/35" />
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pt-12 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-md">
            <Sparkles className="text-violet" size={14} />
            À LA UNE CETTE SEMAINE
          </div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-accent">Une série originale</p>
          <h1 className="text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-7xl">
            {media.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/75">
            <span className="font-bold text-emerald-300">{media.rating} <span className="text-white/50">/ 10</span></span>
            <span>{media.year}</span>
            <span>{media.duration}</span>
            <span className="rounded border border-white/30 px-1.5 py-0.5 text-[10px] font-bold">16+</span>
          </div>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            {media.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs text-white/70">
            {media.genres.map((genre) => (
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5" key={genre}>
                {genre}
              </span>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 font-bold text-ink transition hover:bg-white/85"
              href="#films"
            >
              <Play fill="currentColor" size={18} />
              Découvrir
            </a>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-6 py-3.5 font-bold text-white backdrop-blur-md transition hover:bg-white/25"
              onClick={() => onDetails(media)}
              type="button"
            >
              <Info size={19} />
              Plus d’infos
            </button>
          </div>
        </div>
      </motion.div>
      <div className="pointer-events-none absolute bottom-0 right-0 hidden w-[39%] max-w-[480px] translate-y-10 opacity-90 lg:block">
        <img alt="" className="w-full mask-fade" src={media.poster} />
      </div>
    </section>
  );
}
