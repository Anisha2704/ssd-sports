import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHomepageHero } from '../hooks/useHomepageHero';
import Hero3DBat from './Hero3DBat';
import ParticleCanvas3D from './ParticleCanvas3D';

export default function HeroSection() {
  const { hero, loading, error } = useHomepageHero();
  const [currentIndex, setCurrentIndex] = useState(0);

  const desktopImages = hero?.desktopImages || [];
  const mobileImages = hero?.mobileImages || [];
  const slideCount = Math.max(desktopImages.length, mobileImages.length);

  const activeIndex = currentIndex >= slideCount && slideCount > 0 ? 0 : currentIndex;

  const nextSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-play carousel timer
  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, slideCount]);

  if (loading) {
    return (
      <section className="relative w-full bg-[#0B0F17] overflow-hidden border-b border-white/10">
        <div className="w-full h-[500px] sm:h-[600px] bg-slate-900 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-[#FF2E4D] rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  const currentDesktopImg = desktopImages[activeIndex]?.url;

  return (
    <section className="relative w-full bg-[#0B0F17] overflow-hidden border-b border-white/10 text-white min-h-[550px] sm:min-h-[640px] flex items-center">
      {/* 3D Ember Particle Background Canvas */}
      <ParticleCanvas3D />

      {/* Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF2E4D]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Staggered Cinematic Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-[#FF2E4D]/15 border border-[#FF2E4D]/30 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Zap className="w-4 h-4 text-[#FF2E4D] animate-pulse" />
              <span className="text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#FF2E4D]">
                PRO GRADE CRICKET EQUIPMENT
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-white tracking-tight leading-[0.95] drop-shadow-2xl">
              DOMINATE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#FF2E4D]">
                THE PITCH
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed">
              Engineered for explosive power, precision balance, and international match performance. Handcrafted English Willow bats built for true match-winners.
            </p>

            {/* Feature Highlight Chips */}
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-lg">
                <Award className="w-4 h-4 text-[#FF2E4D]" />
                <span>Grade 1 English Willow</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-[#FF2E4D]" />
                <span>ICC Approved Specifications</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/catalog"
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-[#FF2E4D] hover:from-red-500 hover:to-[#FF4763] text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(255,46,77,0.45)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                to="/bulk-order"
                className="inline-flex items-center space-x-2 px-7 py-4 bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-full border border-white/15 hover:border-white/40 transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                <span>BULK ENQUIRY</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Three.js 3D Cricket Bat Stage */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
              {/* Background ambient lighting halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2E4D]/20 via-transparent to-orange-500/10 rounded-full filter blur-2xl pointer-events-none" />
              
              {/* 3D WebGL Canvas */}
              <Hero3DBat fallbackImage={currentDesktopImg} />
            </div>
          </div>

        </div>

        {/* Dynamic Slide Carousel Controls if multiple images exist */}
        {slideCount > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex items-center space-x-2">
              {desktopImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? 'w-10 bg-[#FF2E4D] shadow-[0_0_10px_#FF2E4D]'
                      : 'w-4 bg-white/20 hover:bg-white/50'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-[#FF2E4D] transition-colors cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-[#FF2E4D] transition-colors cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
