import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu,
  X,
  ChevronDown,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  Palette,
  Calculator
} from 'lucide-react';

const mergeWithFallback = (base, override) => {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }

  if (typeof base !== 'object' || base === null) {
    return override ?? base;
  }

  return Object.keys(base).reduce((acc, key) => {
    acc[key] = mergeWithFallback(base[key], override?.[key]);
    return acc;
  }, {});
};

const assetUrl = (path) => {
  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\/+/g, '')}`;
};

const fetchLocale = async (locale) => {
  const response = await fetch(assetUrl(`i18n/${locale}.json`));
  if (!response.ok) {
    throw new Error(`Failed to load ${locale} translations`);
  }

  return response.json();
};

export default function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lang, setLang] = useState('en');
  const [translations, setTranslations] = useState(null);
  const [translationsError, setTranslationsError] = useState(null);
  const [translationsLoading, setTranslationsLoading] = useState(true);
  const [artworks, setArtworks] = useState([]);
  const [artworksLoading, setArtworksLoading] = useState(true);
  const [artworksError, setArtworksError] = useState(null);
  const closeButtonRef = useRef(null);
  const translationCache = useRef({});

  // Helper to get text
  const t = translations || translationCache.current.en || {};
  const isRTL = lang === 'he';

  useEffect(() => {
    let isMounted = true;

    const loadTranslations = async () => {
      setTranslationsLoading(true);
      setTranslationsError(null);

      try {
        if (!translationCache.current.en) {
          translationCache.current.en = await fetchLocale('en');
        }

        const targetLocale =
          lang === 'en'
            ? translationCache.current.en
            : translationCache.current[lang] || (translationCache.current[lang] = await fetchLocale(lang));

        const mergedTranslations = mergeWithFallback(translationCache.current.en, targetLocale);

        if (isMounted) {
          setTranslations(mergedTranslations);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setTranslationsError(error.message);
          if (translationCache.current.en) {
            setTranslations(translationCache.current.en);
          }
        }
      } finally {
        if (isMounted) {
          setTranslationsLoading(false);
        }
      }
    };

    loadTranslations();

    return () => {
      isMounted = false;
    };
  }, [lang]);

  // Load artworks from static JSON so content stays editable outside the bundle
  useEffect(() => {
    let isMounted = true;

    fetch(assetUrl('artworks.json'))
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load artworks');
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setArtworks(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setArtworksError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setArtworksLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Load Fonts & Handle Direction
  useEffect(() => {
    const linkLatin = document.createElement('link');
    linkLatin.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap";
    linkLatin.rel = "stylesheet";
    document.head.appendChild(linkLatin);

    const linkHebrew = document.createElement('link');
    linkHebrew.href = "https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Heebo:wght@300;400;500;700&display=swap";
    linkHebrew.rel = "stylesheet";
    document.head.appendChild(linkHebrew);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update document direction when language changes
  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  // Filter Logic
  const filteredArtworks = artworks.filter((art) =>
    activeFilter === 'all' || art.category === activeFilter
  );

  // Lightbox Logic
  const openLightbox = (index) => {
    if (!filteredArtworks.length) return;
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (!filteredArtworks.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % filteredArtworks.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!filteredArtworks.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + filteredArtworks.length) % filteredArtworks.length);
  };

  // Lightbox keyboard handling and focus management
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        (isRTL ? nextImage : prevImage)();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        (isRTL ? prevImage : nextImage)();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, isRTL]);

  const toggleLang = () => {
    if (lang === 'en') setLang('ru');
    else if (lang === 'ru') setLang('he');
    else setLang('en');
  };

  if (!translations && translationsLoading) {
    return (
      <div className="min-h-screen bg-[#12100E] text-[#E7E5E4] flex items-center justify-center">
        <p className="text-sm text-[#C5A059]">Loading translations...</p>
      </div>
    );
  }

  if (!translations) {
    return (
      <div className="min-h-screen bg-[#12100E] text-[#E7E5E4] flex items-center justify-center">
        <p className="text-sm text-red-200">Unable to load translations. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className={`bg-[#12100E] text-[#E7E5E4] font-sans selection:bg-[#C5A059] selection:text-black min-h-screen ${isRTL ? 'font-hebrew-sans' : ''}`}>

      {translationsError && (
        <div className="bg-red-900/60 text-red-100 text-center text-sm py-3 px-4">
          Using fallback translations. {translationsError}
        </div>
      )}
      {/* Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
        }}
      />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        /* English / Russian Fonts */
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Lato', sans-serif; }
        
        /* Hebrew Overrides */
        :lang(he) .font-serif { font-family: 'Frank Ruhl Libre', serif; }
        :lang(he) .font-sans { font-family: 'Heebo', sans-serif; }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-[#12100E]/90 backdrop-blur-md py-0' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="font-serif text-2xl italic font-medium tracking-wide text-white hover:text-[#C5A059] transition-colors">
                Elena.
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-10 items-center">
              <a href="#gallery" className="text-xs uppercase tracking-[0.2em] hover:text-[#C5A059] transition-colors">
                {t.nav.works}
              </a>
              <a href="#about" className="text-xs uppercase tracking-[0.2em] hover:text-[#C5A059] transition-colors">
                {t.nav.about}
              </a>
              <a href="#contact" className="px-6 py-2 border border-white/20 hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 text-xs uppercase tracking-[0.2em] rounded-sm">
                {t.nav.contact}
              </a>
              
              <button onClick={toggleLang} className="text-[#78716C] hover:text-[#C5A059] flex items-center gap-2 text-xs uppercase tracking-widest ml-4">
                <Globe size={16} /> <span>{lang.toUpperCase()}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleLang} className="text-[#E7E5E4] hover:text-[#C5A059] text-xs font-bold uppercase">
                {lang.toUpperCase()}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-white hover:text-[#C5A059] focus:outline-none"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#12100E] border-t border-white/10 absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium hover:text-[#C5A059] hover:bg-white/5 rounded-md capitalize">
                {t.nav.works}
              </a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium hover:text-[#C5A059] hover:bg-white/5 rounded-md capitalize">
                {t.nav.about}
              </a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 text-base font-medium hover:text-[#C5A059] hover:bg-white/5 rounded-md capitalize">
                {t.nav.contact}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#12100E]/60 z-10 mix-blend-multiply"></div>
          <img 
            src="https://images.unsplash.com/photo-1596238806208-1fb894b9f665?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Studio" 
            className="w-full h-full object-cover object-center opacity-70"
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6 text-[#C5A059]/80">
            <Calculator size={24} className="animate-pulse" />
          </div>
          <p className="text-[#C5A059] uppercase tracking-[0.4em] mb-6 text-xs md:text-sm animate-fade-in-up font-light">
            {t.hero.subtitle}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#F5F5F4] mb-8 leading-none animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t.hero.title1} <br/><span className="italic font-light text-[#C5A059]">{t.hero.title2}</span>
          </h1>
          <p className="text-[#D6D3D1] text-lg md:text-xl font-light mb-12 max-w-xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t.hero.desc}
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <a href="#gallery" className="group inline-flex items-center gap-3 border border-white/30 px-8 py-3 hover:bg-white hover:text-[#12100E] transition-all duration-500 rounded-sm uppercase tracking-widest text-xs">
              {t.hero.cta}
              {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <a href="#gallery" className="text-white/30 hover:text-[#C5A059] transition-colors">
            <ChevronDown size={24} className="font-light" />
          </a>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-[#12100E] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6 italic text-[#E7E5E4]">{t.gallery.title}</h2>
            <div className="w-px h-12 bg-[#C5A059]/50 mx-auto mb-10"></div>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 overflow-x-auto pb-2 scrollbar-hide">
              {['all', 'oil', 'abstract', 'portrait', 'sketch'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-xs uppercase tracking-[0.2em] pb-2 border-b transition-all ${
                    activeFilter === filter 
                    ? 'border-[#C5A059] text-[#C5A059]' 
                    : 'border-transparent text-[#78716C] hover:text-[#E7E5E4]'
                  }`}
                >
                  {t.gallery.filters[filter]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworksLoading && (
              <p className="col-span-full text-center text-[#A8A29E]">Loading artworks...</p>
            )}

            {artworksError && (
              <p className="col-span-full text-center text-red-300">Failed to load artworks: {artworksError}</p>
            )}

            {!artworksLoading && !artworksError && filteredArtworks.length === 0 && (
              <p className="col-span-full text-center text-[#A8A29E]">No artworks available.</p>
            )}

            {!artworksLoading && !artworksError && filteredArtworks.map((art, index) => (
              <div
                key={art.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/5] cursor-pointer overflow-hidden bg-[#1C1A18] rounded-sm shadow-lg animate-fade-in-up"
              >
                <img
                  src={art.src}
                  alt={art.title}
                  className={`w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90 group-hover:opacity-100 ${art.grayscale ? 'grayscale' : ''}`}
                />
                <div className="absolute inset-0 bg-[#12100E]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center">
                  <p className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-3">
                    {art.medium}
                  </p>
                  <h3 className="font-serif text-2xl italic text-[#E7E5E4]">
                    {art.title}
                  </h3>
                  <p className="text-[#A8A29E] text-xs mt-3 font-sans opacity-75">
                    {art.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-20">
             <button className="px-8 py-3 border border-white/10 hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 uppercase tracking-[0.2em] text-[10px] text-[#A8A29E]">
               {t.gallery.archive}
             </button>
          </div>
        </div>
      </section>

      {/* About Section - THE DUALITY */}
      <section id="about" className="py-24 bg-[#1C1A18] relative border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="p-3 border border-white/10 rounded-full">
              <Calculator size={24} className="text-[#78716C]" />
            </div>
            <div className="w-12 h-px bg-white/20"></div>
            <div className="p-3 border border-[#C5A059]/30 rounded-full">
               <Palette size={24} className="text-[#C5A059]" />
            </div>
          </div>
          
          <h4 className="text-[#C5A059] uppercase tracking-[0.2em] text-xs mb-4">{t.artist.label}</h4>
          <h2 className="font-serif text-4xl md:text-5xl mb-8 italic text-[#E7E5E4]">Elena Yarichuk</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-[#A8A29E] mb-6 leading-relaxed text-lg font-light">
              {t.artist.bio1}
            </p>
            <p className="text-[#A8A29E] mb-10 leading-relaxed text-lg font-light">
              {t.artist.bio2}
            </p>
          </div>
          
          {/* Static Imagery - Clean & Professional */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 opacity-40 hover:opacity-80 transition-opacity duration-500">
             <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80" className="h-32 w-full object-cover grayscale rounded" alt="Spreadsheet vibes" />
             <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" className="h-32 w-full object-cover grayscale rounded" alt="Clean Desk" />
             <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80" className="h-32 w-full object-cover grayscale rounded" alt="Studio detail" />
             <img src="https://images.unsplash.com/photo-1515405295579-ba7f9f92f413?w=400&q=80" className="h-32 w-full object-cover grayscale rounded" alt="Paintbrushes" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#12100E] border-t border-white/5">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 italic">{t.contact.title}</h2>
          <p className="text-[#A8A29E] mb-12 font-light text-sm">{t.contact.desc}</p>
          
          <form className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`} onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
            <div className="space-y-6">
              <input 
                type="text" 
                className="w-full bg-transparent border-b border-white/20 py-3 text-[#E7E5E4] focus:outline-none focus:border-[#C5A059] transition-colors font-light placeholder-[#44403C] text-sm" 
                placeholder={t.contact.form.name}
              />
              <input 
                type="email" 
                className="w-full bg-transparent border-b border-white/20 py-3 text-[#E7E5E4] focus:outline-none focus:border-[#C5A059] transition-colors font-light placeholder-[#44403C] text-sm" 
                placeholder={t.contact.form.email}
              />
               <select className="w-full bg-[#12100E] border-b border-white/20 py-3 text-[#A8A29E] focus:outline-none focus:border-[#C5A059] transition-colors font-light text-sm">
                {t.contact.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                ))}
              </select>
              <textarea 
                rows="4" 
                className="w-full bg-transparent border-b border-white/20 py-3 text-[#E7E5E4] focus:outline-none focus:border-[#C5A059] transition-colors font-light placeholder-[#44403C] text-sm" 
                placeholder={t.contact.form.message}
              ></textarea>
            </div>
            <div className="text-center pt-8">
              <button type="submit" className="px-10 py-3 bg-[#E7E5E4] text-[#12100E] font-bold tracking-[0.2em] uppercase hover:bg-[#C5A059] hover:text-white transition-colors duration-300 text-[10px]">
                {t.contact.form.submit}
              </button>
            </div>
          </form>

          <div className="mt-16 flex justify-center space-x-8 text-[#57534E]">
             <Instagram className="w-5 h-5 hover:text-[#C5A059] transition-colors cursor-pointer" />
             <Mail className="w-5 h-5 hover:text-[#C5A059] transition-colors cursor-pointer" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#12100E] py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <p className="font-serif italic text-xl text-[#57534E] mb-2">Elena.</p>
          <p className="text-[#44403C] text-[10px] uppercase tracking-[0.2em]">
            {t.footer.copyright}
          </p>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {lightboxOpen && filteredArtworks.length > 0 && (
        <div
          className="fixed inset-0 z-[60] bg-[#12100E]/98 flex items-center justify-center p-4 animate-fade-in-up"
          onClick={closeLightbox}
        >
          <button
            ref={closeButtonRef}
            onClick={closeLightbox}
            className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} text-[#78716C] hover:text-[#C5A059] z-50 p-2 transition-colors`}
          >
            <X size={32} />
          </button>
          
          <button 
            onClick={isRTL ? nextImage : prevImage} 
            className="absolute left-6 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#C5A059] p-4 hidden md:block transition-colors"
          >
            <ChevronLeft size={40} strokeWidth={1} />
          </button>
          
          <button 
            onClick={isRTL ? prevImage : nextImage} 
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#C5A059] p-4 hidden md:block transition-colors"
          >
            <ChevronRight size={40} strokeWidth={1} />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <div className="relative shadow-2xl p-1 bg-white/5 backdrop-blur-sm">
              <img 
                src={filteredArtworks[currentImageIndex].src.replace('w=800', 'w=1200')} 
                className="max-h-[70vh] max-w-full object-contain" 
                alt="Full size" 
              />
            </div>
            <div className="text-center mt-6 max-w-lg">
              <p className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-2">{filteredArtworks[currentImageIndex].category}</p>
              <h3 className="text-2xl font-serif italic text-[#E7E5E4] mb-1">{filteredArtworks[currentImageIndex].title}</h3>
              <p className="text-[#78716C] text-xs font-light">{filteredArtworks[currentImageIndex].details}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}