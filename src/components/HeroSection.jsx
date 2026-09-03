import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomepageHero } from '../hooks/useHomepageHero';

export default function HeroSection() {
  const { hero, loading, error } = useHomepageHero();
  const [currentIndex, setCurrentIndex] = useState(0);

  const desktopImages = hero?.desktopImages || [];
  const mobileImages = hero?.mobileImages || [];

  const slideCount = Math.max(desktopImages.length, mobileImages.length);

  const slides = Array.from({ length: slideCount }, (_, idx) => {
    const desktopImg = desktopImages[idx] || desktopImages[0] || mobileImages[idx] || mobileImages[0];
    const mobileImg = mobileImages[idx] || mobileImages[0] || desktopImages[idx] || desktopImages[0];
    return {
      id: `slide-${idx + 1}`,
      desktop: desktopImg,
      mobile: mobileImg,
      alt: desktopImg?.altText || mobileImg?.altText || `SSD Sports Slide ${idx + 1}`,
    };
  });

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
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, slideCount]);

  // Loading Skeleton State
  if (loading) {
    return (
      <section className="relative w-full bg-slate-100 overflow-hidden border-b border-slate-200">
        <div className="w-full h-[200px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[520px] bg-slate-200 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  // Clean Fallback when metaobject does not exist or has no images
  if (error || slides.length === 0) {
    return (
      <section className="relative w-full bg-slate-950 overflow-hidden border-b border-slate-800 text-white">
        <div className="w-full h-[200px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[520px] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <h2 className="text-3xl sm:text-5xl font-black tracking-wider uppercase mb-3 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            SSD SPORTS
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg font-light tracking-wide">
            Premium Cricket & Sports Equipment Direct from Shopify Storefront
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-slate-200 group">
      {/* Hero Banner Container */}
      <div className="relative w-full h-[200px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[520px] overflow-hidden">
        
        {/* Carousel Slides Track */}
        <div
          className="w-full h-full flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="w-full h-full shrink-0 relative flex items-center justify-center bg-slate-100"
            >
              <picture className="w-full h-full block">
                {slide.desktop?.url && (
                  <source media="(min-width: 768px)" srcSet={slide.desktop.url} />
                )}
                <img
                  src={slide.mobile?.url || slide.desktop?.url}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-center"
                />
              </picture>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-xl backdrop-blur-sm transition-all opacity-80 hover:opacity-100 focus:outline-none z-10 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center shadow-xl backdrop-blur-sm transition-all opacity-80 hover:opacity-100 focus:outline-none z-10 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Carousel Dots Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === idx
                    ? 'w-8 h-2 bg-slate-900 shadow-sm'
                    : 'w-2 h-2 bg-slate-400/60 hover:bg-slate-700'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
