import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { resolveImageSrc } from '../utils/assets';

export default function Lightbox({
  lightboxOpen,
  filteredArtworks,
  currentImageIndex,
  closeLightbox,
  nextImage,
  prevImage,
  isRTL,
  closeButtonRef
}) {
  if (!lightboxOpen || filteredArtworks.length === 0) {
    return null;
  }

  const touchStartX = useRef(null); // Track finger start to support swipe navigation on mobile.
  const touchEndX = useRef(null); // Track finger end position for swipe distance calculation.

  const handleSwipeNavigation = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 40; // pixels

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        (isRTL ? prevImage : nextImage)();
      } else {
        (isRTL ? nextImage : prevImage)();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentArtwork = filteredArtworks[currentImageIndex];

  return (
    <div
      className="fixed inset-0 z-[60] bg-[#12100E]/98 flex items-center justify-center p-4 animate-fade-in-up"
      onClick={closeLightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Artwork lightbox"
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

      <div
        className="max-w-4xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchMove={(e) => {
          touchEndX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={handleSwipeNavigation}
      >
        <div className="relative shadow-2xl p-1 bg-white/5 backdrop-blur-sm">
          <img
            src={resolveImageSrc(currentArtwork.src, { upscale: true })}
            className="max-h-[70vh] max-w-full object-contain"
            alt={currentArtwork.title}
          />
        </div>
        <div className="text-center mt-6 max-w-lg" aria-live="polite">
          <p className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-2">{currentArtwork.category}</p>
          <h3 className="text-2xl font-serif italic text-[#E7E5E4]">{currentArtwork.title}</h3>
          <p className="text-[#78716C] text-xs font-light">{currentArtwork.details}</p>
        </div>
        <div className="flex items-center gap-4 mt-6 text-xs text-[#A8A29E]">
          <button
            onClick={isRTL ? prevImage : nextImage}
            className="md:hidden border border-white/10 hover:border-[#C5A059] hover:text-[#C5A059] rounded-sm px-3 py-2 uppercase tracking-[0.2em] transition-colors"
          >
            {isRTL ? 'Next' : 'Previous'}
          </button>
          <span className="uppercase tracking-[0.2em] text-[10px]">
            {currentImageIndex + 1} / {filteredArtworks.length}
          </span>
          <button
            onClick={isRTL ? nextImage : prevImage}
            className="md:hidden border border-white/10 hover:border-[#C5A059] hover:text-[#C5A059] rounded-sm px-3 py-2 uppercase tracking-[0.2em] transition-colors"
          >
            {isRTL ? 'Previous' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
