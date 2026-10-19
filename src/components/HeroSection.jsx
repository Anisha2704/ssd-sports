import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomepageHero } from '../hooks/useHomepageHero';
import MarqueeSection from './MarqueeSection';

export default function HeroSection() {
  const { hero, loading, error } = useHomepageHero();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe refs with vertical-scroll tolerance
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const isSwiping = useRef(false);

  const desktopImages = hero?.desktopImages || [];
  const tabletImages = hero?.tabletImages || [];
  const mobileImages = hero?.mobileImages || [];

  const slideCount = Math.max(
    desktopImages.length,
    tabletImages.length,
    mobileImages.length
  );

  // Construct normalized slides array with device-specific images and robust fallback logic
  const slides = Array.from({ length: Math.max(slideCount, 1) }).map((_, idx) => {
    // Specific images for this slide index
    const dSpecific = desktopImages[idx] || null;
    const tSpecific = tabletImages[idx] || null;
    const mSpecific = mobileImages[idx] || null;

    // Intelligent nearest-suitable fallbacks:
    // 1. Desktop: slide's desktop -> first desktop -> slide's tablet -> slide's mobile
    const desktopImg = dSpecific || desktopImages[0] || tSpecific || mSpecific || null;

    // 2. Tablet: slide's tablet -> first tablet -> slide's desktop -> first desktop -> slide's mobile
    const tabletImg = tSpecific || tabletImages[0] || dSpecific || desktopImages[0] || mSpecific || null;

    // 3. Mobile: slide's mobile -> first mobile -> slide's tablet -> slide's desktop -> first desktop
    const mobileImg = mSpecific || mobileImages[0] || tSpecific || dSpecific || desktopImages[0] || null;

    return {
      id: idx,
      desktopImg,
      tabletImg,
      mobileImg,
    };
  }).filter((slide) => Boolean(slide.desktopImg || slide.mobileImg || slide.tabletImg));

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay timer with pause on hover, keyboard focus, and when document tab is hidden
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    // Honor user motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      if (!document.hidden) {
        nextSlide();
      }
    }, 5500);

    return () => clearInterval(timer);
  }, [nextSlide, totalSlides, isPaused]);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    if (totalSlides <= 1) return;
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  // Touch handlers for mobile swiping (ensures vertical page scrolling is never blocked)
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
    isSwiping.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isSwiping.current) return;
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current || totalSlides <= 1) return;
    isSwiping.current = false;
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;

    // Only trigger slide change if horizontal swipe distance exceeds vertical movement and min threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Loading skeleton fitting the 1st screen exactly to eliminate Cumulative Layout Shift (CLS)
  if (loading && !hero) {
    return (
      <section
        className="relative w-full bg-[#F5FAF6] overflow-hidden border-b border-[#D8E8DD] flex flex-col h-[calc(100vh-3.5rem)] h-[calc(100dvh-3.5rem)] sm:h-[calc(100vh-4rem)] sm:h-[calc(100dvh-4rem)] max-h-[860px]"
        aria-busy="true"
        aria-label="Loading Hero"
      >
        <div className="w-full flex-1 min-h-0 bg-gradient-to-r from-[#F0F7F2] via-[#E2ECE6] to-[#F0F7F2] animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#0B7A3B]/30 border-t-[#0B7A3B] animate-spin" />
        </div>
        <div className="w-full shrink-0 bg-[#EAF7EE] border-t border-[#D8E8DD] py-2.5 sm:py-3 h-10 sm:h-11 animate-pulse" />
      </section>
    );
  }

  // Gracefully handle missing slides
  if (totalSlides === 0 || (error && !slides[0]?.desktopImg)) {
    return null;
  }

  return (
    <section
      className="relative w-full bg-[#F5FAF6] overflow-hidden border-b border-[#D8E8DD] text-[#10231A] flex flex-col group select-none h-[calc(100vh-3.5rem)] h-[calc(100dvh-3.5rem)] sm:h-[calc(100vh-4rem)] sm:h-[calc(100dvh-4rem)] max-h-[860px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Homepage Hero Carousel"
    >
      {/* 1. Carousel Banner Track Container (Takes available height so marquee is always visible on the 1st screen) */}
      <div
        className="relative w-full overflow-hidden flex-1 min-h-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out w-full h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => {
            const { desktopImg, tabletImg, mobileImg } = slide;
            const primaryImg = desktopImg || tabletImg || mobileImg;
            if (!primaryImg) return null;

            return (
              <div
                key={slide.id}
                className="w-full h-full shrink-0 relative flex items-center justify-center bg-[#F5FAF6] overflow-hidden"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${totalSlides}`}
                aria-hidden={currentIndex !== idx}
              >
                <picture className="w-full h-full block">
                  {/* Mobile phones: 320px to 767px */}
                  {mobileImg?.url && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={mobileImg.url}
                    />
                  )}

                  {/* Tablets: 768px to 1023px */}
                  {tabletImg?.url && tabletImg.url !== desktopImg?.url && (
                    <source
                      media="(max-width: 1023px)"
                      srcSet={tabletImg.url}
                    />
                  )}

                  {/* Desktops, Laptops, Ultrawide default image: 1024px+ */}
                  <img
                    src={desktopImg?.url || primaryImg.url}
                    alt={primaryImg.altText || `SSD Sports Official Equipment Banner ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                    decoding={idx === 0 ? 'sync' : 'async'}
                    className="w-full h-full object-cover object-center select-none"
                    draggable={false}
                  />
                </picture>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows (Shown if totalSlides > 1) */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-2.5 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-[#0B7A3B] text-[#10231A] hover:text-white flex items-center justify-center shadow-md hover:shadow-xl border border-[#D8E8DD] transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#0B7A3B] cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-[#0B7A3B] text-[#10231A] hover:text-white flex items-center justify-center shadow-md hover:shadow-xl border border-[#D8E8DD] transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#0B7A3B] cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Pagination Dots (Positioned cleanly above the bottom marquee strip) */}
        {totalSlides > 1 && (
          <div
            className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-white/85 backdrop-blur-md px-3 sm:px-3.5 py-1.5 rounded-full border border-[#D8E8DD] shadow-md"
            role="tablist"
            aria-label="Hero Carousel Slides"
          >
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0B7A3B] rounded-full ${
                  currentIndex === idx
                    ? 'w-6 sm:w-7 h-2 sm:h-2.5 bg-[#0B7A3B]'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#D8E8DD] hover:bg-[#0B7A3B]/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-selected={currentIndex === idx}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Integrated Marquee Strip anchored to the bottom edge of the Hero Section (Always visible on 1st screen) */}
      <div className="shrink-0 w-full relative z-20">
        <MarqueeSection
          items={hero?.textSlider}
          isList={hero?.isTextSliderList}
        />
      </div>
    </section>
  );
}
