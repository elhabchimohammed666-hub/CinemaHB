import { useEffect, useState } from "react";
import { Search, Bell, Menu, X } from "lucide-react";

const links = [
  { label: "Accueil", href: "#accueil" },
  { label: "Films", href: "#films" },
  { label: "Séries", href: "#series" },
  { label: "Animés", href: "#animes" },
];

export default function Navbar({ search, onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "nav-glass py-3 shadow-lg shadow-black/10" : "bg-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:px-12">
        <a href="#accueil" className="shrink-0 text-2xl font-black tracking-tight text-white">
          stream<span className="text-accent">vibe</span>
        </a>

        <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          {links.map((link) => (
            <a key={link.label} className="transition hover:text-white" href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="transition hover:text-white" href="#ma-liste">
            Ma liste
          </a>
        </div>

        <div className="ml-auto flex items-center gap-4 text-white">
          <div className="flex items-center">
            {searchOpen && (
              <input
                autoFocus
                aria-label="Rechercher un film, une série ou un animé"
                className="w-40 border-b border-white/40 bg-transparent py-1 text-sm outline-none placeholder:text-white/50 sm:w-56"
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Titres, genres..."
                value={search}
              />
            )}
            <button
              aria-label={searchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
              className="rounded-full p-2 transition hover:bg-white/10"
              onClick={() => {
                setSearchOpen((open) => !open);
                if (searchOpen) onSearch("");
              }}
              type="button"
            >
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </button>
          </div>
          <button aria-label="Notifications" className="hidden rounded-full p-2 hover:bg-white/10 sm:block" type="button">
            <Bell size={19} />
          </button>
          <button aria-label="Profil" className="hidden h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet to-accent text-xs font-bold sm:flex" type="button">
            SV
          </button>
          <button
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className="rounded-full p-2 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="absolute inset-x-0 top-full flex flex-col gap-4 border-t border-white/10 bg-ink/95 px-6 py-5 text-sm text-white/80 backdrop-blur-xl md:hidden">
          {[...links, { label: "Ma liste", href: "#ma-liste" }].map((link) => (
            <a href={link.href} key={link.label} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
