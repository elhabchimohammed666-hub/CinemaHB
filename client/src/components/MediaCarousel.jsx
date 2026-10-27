import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Check, Play, Star } from "lucide-react";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

export default function MediaCarousel({ title, media, id, onSelect, onToggleWatchlist, watchlist }) {
  const [loaded, setLoaded] = useState({});

  if (!media.length) return null;

  return (
    <section className="content-row relative z-10 mb-10" id={id}>
      <div className="mb-4 flex items-end justify-between px-5 sm:px-8 lg:px-12">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-accent">À explorer</p>
          <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
        </div>
        <span className="hidden text-xs text-white/40 sm:block">{media.length} titres</span>
      </div>

      <Swiper
        a11y={{ enabled: true }}
        breakpoints={{
          0: { slidesPerView: 1.65, spaceBetween: 12 },
          480: { slidesPerView: 2.4, spaceBetween: 14 },
          768: { slidesPerView: 3.5, spaceBetween: 16 },
          1024: { slidesPerView: 4.5, spaceBetween: 18 },
          1280: { slidesPerView: 5.4, spaceBetween: 18 },
        }}
        className="!overflow-visible !px-5 sm:!px-8 lg:!px-12"
        keyboard={{ enabled: true }}
        modules={[A11y, Keyboard, Navigation]}
        navigation
        slidesPerView="auto"
        watchOverflow
      >
        {media.map((item, index) => {
          const isSaved = watchlist.includes(item.id);
          return (
            <SwiperSlide className="!h-auto" key={item.id}>
              <motion.article
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-panel"
                initial={{ opacity: 0, y: 16 }}
                onClick={() => onSelect(item)}
                transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
              >
                <div className="poster-skeleton aspect-[2/3]">
                  {!loaded[item.id] && <div className="absolute inset-0 animate-pulse bg-white/[0.06]" />}
                  <img
                    alt={`Affiche de ${item.title}`}
                    className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                      loaded[item.id] ? "opacity-100" : "opacity-0"
                    }`}
                    loading="lazy"
                    onLoad={() => setLoaded((previous) => ({ ...previous, [item.id]: true }))}
                    onError={() => setLoaded((previous) => ({ ...previous, [item.id]: true }))}
                    src={item.poster}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent opacity-90 transition group-hover:from-black/95" />
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded bg-black/45 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white/80 backdrop-blur">
                      {item.category === "film" ? "Film" : item.category === "anime" ? "Animé" : "Série"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
                      <Star fill="currentColor" size={12} /> {item.rating}
                    </span>
                  </div>
                  <h3 className="line-clamp-1 text-sm font-bold text-white sm:text-base">{item.title}</h3>
                  <div className="mt-1 flex items-center justify-between text-xs text-white/60">
                    <span>{item.year} · {item.duration}</span>
                    <span className="flex translate-y-2 gap-1 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                      <button
                        aria-label={isSaved ? `Retirer ${item.title} de ma liste` : `Ajouter ${item.title} à ma liste`}
                        className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur hover:bg-white/35"
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleWatchlist(item.id);
                        }}
                        type="button"
                      >
                        {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
                      </button>
                      <span className="rounded-full bg-white p-1.5 text-ink">
                        <Play fill="currentColor" size={14} />
                      </span>
                    </span>
                  </div>
                </div>
              </motion.article>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
