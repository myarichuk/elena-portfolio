import React from 'react';
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

  const currentArtwork = filteredArtworks[currentImageIndex];

  return (
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

      <div className="max-w-4xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <div className="relative shadow-2xl p-1 bg-white/5 backdrop-blur-sm">
          <img
            src={resolveImageSrc(currentArtwork.src, { upscale: true })}
            className="max-h-[70vh] max-w-full object-contain"
            alt="Full size"
          />
        </div>
        <div className="text-center mt-6 max-w-lg">
          <p className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-2">{currentArtwork.category}</p>
          <h3 className="text-2xl font-serif italic text-[#E7E5E4]">{currentArtwork.title}</h3>
          <p className="text-[#78716C] text-xs font-light">{currentArtwork.details}</p>
        </div>
      </div>
    </div>
  );
}
