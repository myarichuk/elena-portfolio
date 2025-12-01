import React from 'react';
import { Calculator, Palette } from 'lucide-react';

export default function About({ t }) {
  return (
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
        <h2 className="font-serif text-4xl md:text-5xl mb-8 italic text-[#E7E5E4]">{t.artist.name}</h2>
        <div className="max-w-2xl mx-auto">
          <p className="text-[#A8A29E] mb-6 leading-relaxed text-lg font-light">{t.artist.bio1}</p>
          <p className="text-[#A8A29E] mb-10 leading-relaxed text-lg font-light">{t.artist.bio2}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 opacity-40 hover:opacity-80 transition-opacity duration-500">
          <img
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80"
            className="h-32 w-full object-cover grayscale rounded"
            alt="Spreadsheet vibes"
          />
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80"
            className="h-32 w-full object-cover grayscale rounded"
            alt="Clean Desk"
          />
          <img
            src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80"
            className="h-32 w-full object-cover grayscale rounded"
            alt="Studio detail"
          />
          <img
            src="https://images.unsplash.com/photo-1515405295579-ba7f9f92f413?w=400&q=80"
            className="h-32 w-full object-cover grayscale rounded"
            alt="Paintbrushes"
          />
        </div>
      </div>
    </section>
  );
}
