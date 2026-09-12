import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Film } from 'lucide-react';
import macroGrainImg from '../../assets/english_willow_macro_grain.jpg';
import craftHandsImg from '../../assets/craftsman_batmaker_hands_willow.jpg';
import movementImg from '../../assets/hero_banner.jpg';
import playerCreaseImg from '../../assets/cricket_player_stance_crease.jpg';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    id: 'material',
    num: '01',
    label: 'MATERIAL',
    image: macroGrainImg,
    lead: "WE DON'T MAKE EQUIPMENT.",
    statement: 'WE MAKE WHAT YOU TRUST WHEN IT MATTERS.',
    sub: 'Raw, unbleached Salix Alba selected for high-velocity kinetic energy return.',
  },
  {
    id: 'craft',
    num: '02',
    label: 'CRAFT',
    image: craftHandsImg,
    lead: 'OBSESSIVE. UNCOMPROMISING.',
    statement: 'SHAPED BY EYE. BALANCED BY HAND.',
    sub: 'Master batmakers shaving fractions of millimeters until the pickup feels weightless.',
  },
  {
    id: 'movement',
    num: '03',
    label: 'MOVEMENT',
    image: movementImg,
    lead: 'KINETIC WILLOW.',
    statement: 'EVERY MILLIMETER IN MOTION.',
    sub: 'From stance to backlift, every contour engineered for instantaneous stroke execution.',
  },
  {
    id: 'pressure',
    num: '04',
    label: 'PRESSURE',
    image: playerCreaseImg,
    lead: 'WHEN EVERYONE IS WATCHING —',
    statement: 'YOU KNOW WHAT YOU BROUGHT.',
    sub: 'At 22 yards, doubt disappears. There is only the ball, the seam, and the moment.',
  },
];

export default function BrandFilmSection() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const chapterRefs = useRef([]);
  const climaxRef = useRef(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const ctx = gsap.context(() => {
      // Master 350vh Brand Film Scrubber
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          pin: stage,
          anticipatePin: 1,
          onUpdate: (self) => {
            const prog = self.progress;
            if (prog < 0.8) {
              const idx = Math.min(
                CHAPTERS.length - 1,
                Math.floor((prog / 0.8) * CHAPTERS.length)
              );
              setActiveChapterIndex(idx);
            } else {
              setActiveChapterIndex(CHAPTERS.length);
            }
          },
        },
      });

      // Chapter 1 (00–20%): Material
      // Default visible, then fades out as Chapter 2 enters
      tl.to(
        chapterRefs.current[0],
        { opacity: 0, scale: 0.96, duration: 0.1, ease: 'power1.in' },
        0.18
      );

      // Chapter 2 (20–40%): Craft
      tl.fromTo(
        chapterRefs.current[1],
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.1, ease: 'power2.out' },
        0.2
      );
      tl.to(
        chapterRefs.current[1],
        { opacity: 0, scale: 0.96, duration: 0.1, ease: 'power1.in' },
        0.38
      );

      // Chapter 3 (40–60%): Movement
      tl.fromTo(
        chapterRefs.current[2],
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.1, ease: 'power2.out' },
        0.4
      );
      tl.to(
        chapterRefs.current[2],
        { opacity: 0, scale: 0.96, duration: 0.1, ease: 'power1.in' },
        0.58
      );

      // Chapter 4 (60–80%): Pressure
      tl.fromTo(
        chapterRefs.current[3],
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.1, ease: 'power2.out' },
        0.6
      );
      tl.to(
        chapterRefs.current[3],
        { opacity: 0, scale: 0.96, duration: 0.1, ease: 'power1.in' },
        0.78
      );

      // Chapter 5 (80–100%): Climax Manifesto & SSD Identity
      tl.fromTo(
        climaxRef.current,
        { opacity: 0, scale: 0.94, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.15, ease: 'expo.out' },
        0.82
      );
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      id="act-brand-film"
      className={`relative w-full ${prefersReducedMotion ? 'min-h-screen py-24' : 'h-[350vh]'} bg-[#050505] text-white`}
    >
      {/* Pinned Cinema Viewport Stage */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-[#050505] flex items-center justify-center select-none"
      >
        {/* Film Vignette & Atmosphere Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_80%)] pointer-events-none z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80 pointer-events-none z-20" />

        {/* Top Header Badge */}
        <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <Film className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-300 uppercase">
              ACT 08 — THE BRAND FILM
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
            {activeChapterIndex < 4 ? `SCENE 0${activeChapterIndex + 1} // ${CHAPTERS[activeChapterIndex]?.label}` : 'MANIFIESTO // SSD SPORTS'}
          </span>
        </div>

        {/* Chapters Layers (01–04) */}
        {CHAPTERS.map((ch, idx) => (
          <div
            key={ch.id}
            ref={(el) => (chapterRefs.current[idx] = el)}
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-700 ${
              prefersReducedMotion
                ? idx === activeChapterIndex
                  ? 'opacity-100'
                  : 'hidden'
                : idx === 0
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            {/* Cinematic Background Image with Dark Tint */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <img
                src={ch.image}
                alt={`SSD Sports Brand Film — ${ch.label}`}
                className="w-full h-full object-cover object-center filter brightness-40 contrast-125"
              />
            </div>

            {/* Editorial Statement Overlay */}
            <div className="relative z-20 max-w-4xl w-full mx-auto px-6 sm:px-10 text-center space-y-6">
              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-mono tracking-[0.3em] text-red-500 uppercase font-semibold block">
                  {ch.num} // {ch.label}
                </span>
                <p className="text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-neutral-400">
                  {ch.lead}
                </p>
              </div>

              <h2 className="font-['Syne',sans-serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tight leading-[0.92]">
                {ch.statement}
              </h2>

              <p className="text-neutral-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-normal leading-relaxed">
                {ch.sub}
              </p>
            </div>
          </div>
        ))}

        {/* Chapter 5: Climax Manifesto & SSD Identity (80–100%) */}
        <div
          ref={climaxRef}
          className={`absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-auto ${
            prefersReducedMotion && activeChapterIndex >= 4 ? 'opacity-100' : prefersReducedMotion ? 'hidden' : 'opacity-0'
          }`}
        >
          {/* Subtle Ambient Red Glow */}
          <div className="absolute w-[600px] h-[600px] bg-red-950/[0.12] rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-4xl space-y-6 sm:space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-400">
                SSD SPORTS PHILOSOPHY
              </span>
            </div>

            <h2 className="font-['Syne',sans-serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tight leading-[0.92]">
              BUILT FOR THE MOMENT <br />
              <span className="bg-gradient-to-r from-white via-neutral-100 to-red-500 bg-clip-text text-transparent">
                THAT MATTERS.
              </span>
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed">
              We engineer equipment for players who don’t wait for the game to come to them. Those who dictate it.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/catalog"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:bg-red-600 hover:text-white shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_10px_30px_rgba(220,38,38,0.4)] active:scale-95 cursor-pointer"
              >
                <span>EXPLORE THE WORLD OF SSD</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Film Chapter Tracker Dots (Desktop & Tablet) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-none">
          {[0, 1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`transition-all duration-500 rounded-full ${
                activeChapterIndex === step
                  ? 'w-8 h-1 bg-red-600'
                  : 'w-1.5 h-1 bg-neutral-800'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
