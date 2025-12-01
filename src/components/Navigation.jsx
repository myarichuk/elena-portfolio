import React from 'react';
import { Globe, Menu, X } from 'lucide-react';

export default function Navigation({
  t,
  lang,
  toggleLang,
  scrolled,
  isMenuOpen,
  setIsMenuOpen
}) {
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b border-white/5 ${
        scrolled ? 'bg-[#12100E]/90 backdrop-blur-md py-0' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="font-serif text-2xl italic font-medium tracking-wide text-white hover:text-[#C5A059] transition-colors">
              {t.artist.name}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#gallery" className="text-xs uppercase tracking-[0.2em] hover:text-[#C5A059] transition-colors">
              {t.nav.works}
            </a>
            <a href="#about" className="text-xs uppercase tracking-[0.2em] hover:text-[#C5A059] transition-colors">
              {t.nav.about}
            </a>
            <a
              href="#contact"
              className="px-6 py-2 border border-white/20 hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 text-xs uppercase tracking-[0.2em] rounded-sm"
            >
              {t.nav.contact}
            </a>

            <button onClick={toggleLang} className="text-[#78716C] hover:text-[#C5A059] flex items-center gap-2 text-xs uppercase tracking-widest ml-4">
              <Globe size={16} /> <span>{lang.toUpperCase()}</span>
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLang} className="text-[#E7E5E4] hover:text-[#C5A059] text-xs font-bold uppercase">
              {lang.toUpperCase()}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-[#C5A059] focus:outline-none">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#12100E] border-t border-white/10 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a
              href="#gallery"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-3 text-base font-medium hover:text-[#C5A059] hover:bg-white/5 rounded-md capitalize"
            >
              {t.nav.works}
            </a>
            <a
              href="#about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-3 text-base font-medium hover:text-[#C5A059] hover:bg-white/5 rounded-md capitalize"
            >
              {t.nav.about}
            </a>
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-3 text-base font-medium hover:text-[#C5A059] hover:bg-white/5 rounded-md capitalize"
            >
              {t.nav.contact}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
