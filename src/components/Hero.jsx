import React from 'react';
import { Calculator, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { assetUrl } from '../utils/assets';

export default function Hero({ t, isRTL }) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#12100E] via-[#12100E] to-[#0A0908] overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10" />
        <div className="absolute top-20 -left-10 w-72 h-72 bg-[#C5A059]/20 blur-[120px] rounded-full opacity-30" />
        <div className="absolute bottom-20 -right-10 w-72 h-72 bg-[#8A8178]/20 blur-[140px] rounded-full opacity-30" />
        <div className="relative h-[80vh] max-w-5xl mx-auto px-6">
          <img
            src={assetUrl('images/hero.svg')}
            alt="Studio"
            className="w-full h-full object-cover object-center opacity-70"
          />
        </div>
      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <div className="flex justify-center mb-6 text-[#C5A059]/80">
          <Calculator size={24} className="animate-pulse" />
        </div>
        <p className="text-[#C5A059] uppercase tracking-[0.4em] mb-6 text-xs md:text-sm animate-fade-in-up font-light">
          {t.hero.subtitle}
        </p>
        <h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#F5F5F4] mb-8 leading-none animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          {t.hero.title1} <br />
          <span className="italic font-light text-[#C5A059]">{t.hero.title2}</span>
        </h1>
        <p
          className="text-[#D6D3D1] text-lg md:text-xl font-light mb-12 max-w-xl mx-auto leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          {t.hero.desc}
        </p>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <a
            href="#gallery"
            className="group inline-flex items-center gap-3 border border-white/30 px-8 py-3 hover:bg-white hover:text-[#12100E] transition-all duration-500 rounded-sm uppercase tracking-widest text-xs"
          >
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
  );
}
