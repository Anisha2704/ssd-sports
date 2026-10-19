import React, { useState, useEffect, useCallback } from 'react';
import logoSrc from '../assets/logo.png';

export default function BrandIntroOpening() {
  const [phase, setPhase] = useState('idle'); // 'idle' | 'drawing' | 'settled' | 'lifting' | 'complete'
  const [isFinished, setIsFinished] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('intro') === '1') return false;
      const alreadySeen = sessionStorage.getItem('ssd_sports_intro_seen');
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return !!(alreadySeen || prefersReducedMotion);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isFinished) return;

    try {
      sessionStorage.setItem('ssd_sports_intro_seen', 'true');
    } catch {
      // In case sessionStorage is restricted
    }

    // Step 1: Start progressive stroke and wordmark reveal (60ms)
    const timerDraw = setTimeout(() => {
      setPhase('drawing');
    }, 60);

    // Step 2: Complete wordmark settles into place with metallic glint & sheen sweep (750ms)
    const timerSettle = setTimeout(() => {
      setPhase('settled');
    }, 750);

    // Step 3: Cinematic curtain lift transition (1350ms)
    const timerLift = setTimeout(() => {
      setPhase('lifting');
    }, 1350);

    // Step 4: Animation complete, fully unmount from DOM (2100ms)
    const timerDone = setTimeout(() => {
      setPhase('complete');
      setIsFinished(true);
    }, 2100);

    return () => {
      clearTimeout(timerDraw);
      clearTimeout(timerSettle);
      clearTimeout(timerLift);
      clearTimeout(timerDone);
    };
  }, []);

  // Prevent background page scrolling during the opening reveal
  useEffect(() => {
    if (isFinished || phase === 'lifting' || phase === 'complete') {
      document.body.style.overflow = '';
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [phase, isFinished]);

  // Fast skip handler (Click, Tap, or Escape key)
  const handleSkip = useCallback(() => {
    setPhase('lifting');
    setTimeout(() => {
      setPhase('complete');
      setIsFinished(true);
    }, 380);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  if (isFinished) {
    return null;
  }

  const isLifting = phase === 'lifting' || phase === 'complete';
  const isDrawnOrSettled = phase === 'drawing' || phase === 'settled' || phase === 'lifting';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SSD SPORTS Brand Introduction"
      onClick={handleSkip}
      className={`fixed inset-0 z-[99999] bg-[#0c120e] flex flex-col items-center justify-center select-none cursor-pointer overflow-hidden transition-transform duration-[750ms] ${
        isLifting ? '-translate-y-full ease-[cubic-bezier(0.76,0,0.24,1)]' : 'translate-y-0'
      }`}
      style={{
        willChange: 'transform',
      }}
    >
      {/* Subtle Ambient Radial Gold Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: 'radial-gradient(circle at 50% 48%, rgba(223, 179, 82, 0.16) 0%, rgba(12, 18, 14, 0.98) 72%)',
        }}
      />

      {/* Subtle Skip Label at Top-Right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute top-5 right-6 z-30 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#D8E8DD]/45 hover:text-[#DFB352] uppercase transition-colors py-1.5 px-2.5 rounded-sm hover:bg-white/5 cursor-pointer focus:outline-none"
        aria-label="Skip Introduction"
      >
        SKIP [ESC]
      </button>

      {/* Central Brand Reveal Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-[90vw] -translate-y-2">
        {/* Emblem Wrapper */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
          
          {/* 1. Luminous Circular Perimeter Tracing Ring */}
          {isDrawnOrSettled && (
            <svg
              viewBox="0 0 1000 1000"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="ssdRingGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DFB352" />
                  <stop offset="40%" stopColor="#FFF4D0" />
                  <stop offset="70%" stopColor="#DFB352" />
                  <stop offset="100%" stopColor="#9E7822" />
                </linearGradient>
              </defs>
              <circle
                cx="500"
                cy="500"
                r="455"
                fill="none"
                stroke="url(#ssdRingGold)"
                strokeWidth="5"
                strokeLinecap="round"
                className="animate-ssd-ring origin-center -rotate-90"
              />
            </svg>
          )}

          {/* 2. Official SSD 3D Golden Medallion with Progressive Stroke / Wordmark Reveal */}
          <div
            className={`relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-500 ${
              isDrawnOrSettled ? 'animate-ssd-letters opacity-100' : 'opacity-0 scale-95'
            }`}
          >
            <img
              src={logoSrc}
              alt="SSD SPORTS"
              loading="eager"
              decoding="sync"
              className="w-full h-full object-contain filter drop-shadow-[0_12px_40px_rgba(223,179,82,0.28)] select-none pointer-events-none"
              draggable={false}
            />

            {/* 2b. Luminous Leading Gold Beam during drawing phase */}
            {phase === 'drawing' && (
              <div
                className="pointer-events-none absolute top-0 bottom-0 w-2 z-20 animate-ssd-beam"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent, rgba(255, 244, 208, 0.95) 25%, #DFB352 50%, rgba(255, 244, 208, 0.95) 75%, transparent)',
                  boxShadow: '0 0 16px 3px #DFB352, 0 0 28px 6px #FFF4D0',
                }}
                aria-hidden="true"
              />
            )}

            {/* 2c. Diagonal Metallic Sheen Sweep once letters settle */}
            {phase === 'settled' && (
              <div
                className="pointer-events-none absolute inset-0 w-full h-full animate-ssd-sheen"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 20%, rgba(255, 248, 220, 0.5) 50%, transparent 80%)',
                }}
                aria-hidden="true"
              />
            )}
          </div>

          {/* 3. Upper-Left Sparkling Star Glint Flare */}
          {(phase === 'settled' || phase === 'lifting') && (
            <div
              className="absolute top-[16%] left-[24%] pointer-events-none z-20 animate-ssd-glint"
              aria-hidden="true"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 fill-[#FFF8DC]">
                <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
              </svg>
            </div>
          )}

          {/* 4. Lower-Right Sparkling Star Glint Flare */}
          {(phase === 'settled' || phase === 'lifting') && (
            <div
              className="absolute bottom-[16%] right-[24%] pointer-events-none z-20 animate-ssd-glint"
              style={{ animationDelay: '0.14s' }}
              aria-hidden="true"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FFF8DC]">
                <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
              </svg>
            </div>
          )}
        </div>

        {/* 5. Luxury "SPORTS" Wordmark with Progressive Tracking Expansion */}
        <div
          className={`mt-2.5 sm:mt-3.5 text-center transition-all duration-500 ${
            isDrawnOrSettled ? 'animate-ssd-tracking opacity-100' : 'opacity-0'
          }`}
        >
          <span className="font-heading font-black uppercase text-base sm:text-lg md:text-xl tracking-[0.52em] bg-gradient-to-r from-[#DFB352] via-[#FFF3D1] to-[#DFB352] bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(223,179,82,0.4)]">
            SPORTS
          </span>
        </div>
      </div>
    </div>
  );
}
