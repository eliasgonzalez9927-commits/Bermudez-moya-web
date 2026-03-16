
import React, { useState, useEffect } from 'react';
import { BANNERS } from '../constants';

interface HeroBannerProps {
  onNavigate: (view: any) => void;
  banners?: any[];
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate, banners }) => {
  const [current, setCurrent] = useState(0);
  const bannersToShow = banners && banners.length > 0 ? banners : BANNERS;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === bannersToShow.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [bannersToShow.length]);

  const next = () => setCurrent((prev) => (prev === bannersToShow.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? bannersToShow.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
      {bannersToShow.map((banner, index) => (
        <div
          key={banner._id || banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[5s] scale-105"
            style={{ 
              backgroundImage: `url(${banner.imagen || banner.image})`,
              transform: index === current ? 'scale(1)' : 'scale(1.05)'
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#1D1D1B]/50" />

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-white text-3xl md:text-6xl font-black mb-4 tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700">
              {banner.titulo || banner.title}
            </h2>
            <p className="text-white/80 text-lg md:text-xl font-light mb-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {banner.subtitulo || banner.subtitle}
            </p>
            <button
              onClick={() => onNavigate(banner.ctaAccion || banner.ctaAction)}
              className="bg-brand-red text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#a01520] transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-brand-red/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
            >
              {banner.ctaTexto || banner.ctaText}
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm hidden md:block"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm hidden md:block"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {bannersToShow.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current ? 'bg-brand-red w-8' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
