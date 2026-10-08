import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomepageHero } from '../hooks/useHomepageHero';

export default function HeroSection() {
  const { hero, loading, error } = useHomepageHero();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch Swipe State
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const desktopImages = hero?.desktopImages || [];
  const tabletImages = hero?.tabletImages || [];
  const mobileImages = hero?.mobileImages || [];

  const slideCount = Math.max(
    desktopImages.length,
    tabletImages.length,
    mobileImages.length
  );

  // Construct normalized slides array with fallback logic
  const slides = Array.from({ length: slideCount }).map((_, idx) => {
    const desktopImg = desktopImages[idx] || desktopImages[0] || null;
    const tabletImg = tabletImages[idx] || tabletImages[0] || desktopImg;
    const mobileImg = mobileImages[idx] || mobileImages[0] || desktopImg;

    return {
      id: idx,
      desktopImg,
      tabletImg,
      mobileImg,
    };
  });

  const nextSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-play timer (4-6 sec interval, pauses on hover)
  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, slideCount, isPaused]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (slideCount <= 1) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  // Loading Skeleton View
  if (loading) {
    return (
      <section className="relative w-full bg-[#F5FAF6] overflow-hidden border-b border-[#D8E8DD]">
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[1920/850] max-h-[700px] bg-[#EAF7EE]/60 animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#D8E8DD] border-t-[#0B7A3B] rounded-full animate-spin" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B7A3B]">
              Loading Hero Carousel...
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Hide gracefully if no hero images exist
  if (error || slides.length === 0 || !slides[0].desktopImg) {
    return null;
  }

  return (
    <section
      className="relative w-full bg-[#F5FAF6] overflow-hidden border-b border-[#D8E8DD] text-[#10231A] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Homepage Hero Carousel"
    >
      {/* Carousel Track Container */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out w-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => {
            const { desktopImg, tabletImg, mobileImg } = slide;
            if (!desktopImg) return null;

            return (
              <div
                key={slide.id}
                className="w-full shrink-0 relative flex items-center justify-center bg-[#F5FAF6]"
              >
                <picture className="w-full h-full block">
                  {mobileImg?.url && (
                    <source media="(max-width: 639px)" srcSet={mobileImg.url} />
                  )}
                  {tabletImg?.url && (
                    <source media="(max-width: 1023px)" srcSet={tabletImg.url} />
                  )}
                  <img
                    src={desktopImg.url}
                    alt={desktopImg.altText || `SSD Sports Banner Slide ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    fetchpriority={idx === 0 ? 'high' : 'auto'}
                    className="w-full h-auto max-h-[720px] object-cover object-center block"
                  />
                </picture>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows (Shown if slideCount > 1) */}
      {slideCount > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-[#0B7A3B] text-[#10231A] hover:text-white flex items-center justify-center shadow-lg border border-[#D8E8DD] transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:outline-none cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-[#0B7A3B] text-[#10231A] hover:text-white flex items-center justify-center shadow-lg border border-[#D8E8DD] transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:outline-none cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Pagination Dots (Shown if slideCount > 1) */}
      {slideCount > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D8E8DD] shadow-md">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-7 h-2.5 rounded-full bg-[#0B7A3B]'
                  : 'w-2.5 h-2.5 rounded-full bg-[#D8E8DD] hover:bg-[#0B7A3B]/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

