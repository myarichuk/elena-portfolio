import React from 'react';
import { Gallery as PhotoSwipeGallery, Item } from 'react-photoswipe-gallery';
export default function Gallery({
  t,
  artworksLoading,
  artworksError,
  filteredArtworks,
  activeFilter,
  setActiveFilter,
  resolveImageSrc
}) {
  return (
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

          {!artworksLoading &&
            !artworksError && (
              <PhotoSwipeGallery options={{ preloaderDelay: 0, loop: true, wheelToZoom: true }}>
                {filteredArtworks.map((art) => (
                  <Item
                    key={art.id}
                    original={resolveImageSrc(art.src, { upscale: true })}
                    thumbnail={resolveImageSrc(art.src)}
                    width="1600"
                    height="2000"
                    caption={`${art.title} — ${art.details}`}
                  >
                    {({ ref, open }) => (
                      <div
                        ref={ref}
                        onClick={open}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            open();
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="group relative aspect-[4/5] cursor-pointer overflow-hidden bg-[#1C1A18] rounded-sm shadow-lg animate-fade-in-up"
                        aria-label={t?.gallery?.openLightboxAria ? `${t.gallery.openLightboxAria} ${art.title}` : `Open ${art.title}`}
                      >
                        <img
                          src={resolveImageSrc(art.src)}
                          alt={art.title}
                          className={`w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-90 group-hover:opacity-100 ${
                            art.grayscale ? 'grayscale' : ''
                          }`}
                        />
                        <div className="absolute inset-0 bg-[#12100E]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center">
                          <p className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-3">{art.medium}</p>
                          <h3 className="font-serif text-2xl italic text-[#E7E5E4]">{art.title}</h3>
                          <p className="text-[#A8A29E] text-xs mt-3 font-sans opacity-75">{art.details}</p>
                        </div>
                      </div>
                    )}
                  </Item>
                ))}
              </PhotoSwipeGallery>
            )}
        </div>

        <div className="text-center mt-20">
          <button className="px-8 py-3 border border-white/10 hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300 uppercase tracking-[0.2em] text-[10px] text-[#A8A29E]">
            {t.gallery.archive}
          </button>
        </div>
      </div>
    </section>
  );
}
