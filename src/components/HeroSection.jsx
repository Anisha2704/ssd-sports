import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHomepageHero } from '../hooks/useHomepageHero';
import Hero3DBat from './Hero3DBat';
import ParticleCanvas3D from './ParticleCanvas3D';

export default function HeroSection() {
  const { hero, loading } = useHomepageHero();
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
      <section className="relative w-full bg-white overflow-hidden border-b border-[#D8E8DD]">
        <div className="w-full h-[500px] sm:h-[600px] bg-[#F5FAF6] animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#D8E8DD] border-t-[#0B7A3B] rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  const currentDesktopImg = desktopImages[activeIndex]?.url;

  return (
    <section className="relative w-full bg-gradient-to-b from-white via-[#F5FAF6] to-[#EAF7EE] overflow-hidden border-b border-[#D8E8DD] text-[#10231A] min-h-[550px] sm:min-h-[640px] flex items-center cricket-grass-pattern">
      {/* 3D Field Particle Background Canvas */}
      <ParticleCanvas3D />

      {/* Subtle Natural Green Radial Glow & Pitch Marking Shapes */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-[#20A957]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-96 h-96 border-2 border-[#0B7A3B]/10 rounded-full pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-80 h-80 border border-[#0B7A3B]/10 rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Staggered Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-[#EAF7EE] border border-[#0B7A3B]/25 px-4 py-1.5 rounded-full shadow-sm">
              <Zap className="w-4 h-4 text-[#0B7A3B] animate-pulse" />
              <span className="text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-[#0B7A3B]">
                PRO GRADE CRICKET EQUIPMENT
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black uppercase text-[#10231A] tracking-tight leading-[0.95] drop-shadow-sm">
              DOMINATE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#075E2D] via-[#0B7A3B] to-[#20A957]">
                THE PITCH
              </span>
            </h1>

            <p className="text-[#52645A] text-sm sm:text-base lg:text-lg max-w-xl font-medium leading-relaxed">
              Engineered for explosive power, precision balance, and international match performance. Handcrafted English Willow bats built for true match-winners.
            </p>

            {/* Feature Highlight Chips */}
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#10231A] bg-white border border-[#D8E8DD] px-3.5 py-2 rounded-xl shadow-xs">
                <Award className="w-4 h-4 text-[#0B7A3B]" />
                <span>Grade 1 English Willow</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#10231A] bg-white border border-[#D8E8DD] px-3.5 py-2 rounded-xl shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#0B7A3B]" />
                <span>ICC Approved Specifications</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/catalog"
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-[#0B7A3B] hover:bg-[#075E2D] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md shadow-[#0B7A3B]/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center space-x-2 px-7 py-4 bg-white hover:bg-[#EAF7EE] text-[#0B7A3B] font-extrabold text-xs uppercase tracking-widest rounded-xl border-2 border-[#0B7A3B] transition-all duration-300 shadow-xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>EXPLORE CRICKET GEAR</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Three.js 3D Cricket Bat Stage */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
              {/* Background ambient light halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#20A957]/20 via-transparent to-[#0B7A3B]/10 rounded-full filter blur-2xl pointer-events-none" />
              
              {/* 3D WebGL Canvas */}
              <Hero3DBat fallbackImage={currentDesktopImg} />
            </div>
          </div>

        </div>

        {/* Dynamic Slide Carousel Controls if multiple images exist */}
        {slideCount > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-[#D8E8DD] pt-4">
            <div className="flex items-center space-x-2">
              {desktopImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? 'w-10 bg-[#0B7A3B] shadow-sm'
                      : 'w-4 bg-[#D8E8DD] hover:bg-[#0B7A3B]/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-white border border-[#D8E8DD] text-[#10231A] flex items-center justify-center hover:bg-[#0B7A3B] hover:text-white transition-colors cursor-pointer shadow-xs"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-white border border-[#D8E8DD] text-[#10231A] flex items-center justify-center hover:bg-[#0B7A3B] hover:text-white transition-colors cursor-pointer shadow-xs"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

