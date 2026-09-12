import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import cinematicBatImg from '../../assets/cinematic_bat_hero.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const batWrapperRef = useRef(null);
  const batImgRef = useRef(null);
  const lightSweepRef = useRef(null);
  const textContainerRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const word3Ref = useRef(null);
  const word4Ref = useRef(null);
  const subcopyRef = useRef(null);
  const ctaGroupRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // 1. Dust Particles Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 65 atmospheric dust particles
    const particleCount = window.innerWidth < 768 ? 30 : 65;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.1,
      alpha: Math.random() * 0.6 + 0.15,
      pulse: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 2. Interactive 3D Cursor Tilt
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let tiltAnimId;

    const handleMouseMove = (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW; // -1 to 1
      mouseY = (e.clientY - halfH) / halfH; // -1 to 1
    };

    const updateTilt = () => {
      currentTiltX += (mouseX * 8 - currentTiltX) * 0.08;
      currentTiltY += (-mouseY * 8 - currentTiltY) * 0.08;

      if (batWrapperRef.current) {
        gsap.set(batWrapperRef.current, {
          rotationY: currentTiltX,
          rotationX: currentTiltY,
          transformPerspective: 1000,
        });
      }
      tiltAnimId = requestAnimationFrame(updateTilt);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    tiltAnimId = requestAnimationFrame(updateTilt);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(tiltAnimId);
    };
  }, []);

  // 3. GSAP ScrollTrigger Choreography (Continuous Film Shot)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const ctx = gsap.context(() => {
      // Master timeline pinned across 300vh scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrub synced with scroll velocity
          pin: stage,
          anticipatePin: 1,
        },
      });

      // Initial state:
      // Bat is barely visible (0%), deep in darkness, smaller scale
      gsap.set(batImgRef.current, {
        opacity: 0,
        scale: 0.82,
        y: 40,
        filter: 'brightness(0.1) contrast(1.2) drop-shadow(0 0 0px rgba(255,255,255,0))',
      });

      gsap.set(lightSweepRef.current, {
        xPercent: -150,
        opacity: 0,
      });

      gsap.set([word1Ref.current, word2Ref.current, word3Ref.current], {
        opacity: 0,
        y: 80,
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
      });

      gsap.set(word4Ref.current, {
        opacity: 0,
        y: 120,
        scale: 0.9,
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
        letterSpacing: '0.05em',
      });

      gsap.set([subcopyRef.current, ctaGroupRef.current], {
        opacity: 0,
        y: 30,
      });

      // -------------------------------------------------------------
      // ACT 01 CHOREOGRAPHY TIMELINE
      // -------------------------------------------------------------

      // 0 - 15%: Faint outline of bat appears with dramatic rim illumination
      tl.to(
        batImgRef.current,
        {
          opacity: 0.35,
          scale: 0.88,
          y: 20,
          filter: 'brightness(0.4) contrast(1.4) drop-shadow(0 0 25px rgba(255,255,255,0.08))',
          duration: 0.15,
          ease: 'power1.inOut',
        },
        0
      );

      // 15 - 30%: Bat becomes fully visible, camera slowly approaches
      tl.to(
        batImgRef.current,
        {
          opacity: 0.9,
          scale: 1.0,
          y: 0,
          filter: 'brightness(0.9) contrast(1.25) drop-shadow(0 0 35px rgba(255,255,255,0.15))',
          duration: 0.15,
          ease: 'power2.out',
        },
        0.15
      );

      // Fade out the initial scroll indicator as user begins moving
      tl.to(
        scrollIndicatorRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.1,
        },
        0.05
      );

      // 30 - 45%: Bat rotates slightly, light sweeps over the wood grain
      tl.to(
        batImgRef.current,
        {
          scale: 1.08,
          rotation: -2,
          filter: 'brightness(1.1) contrast(1.3) drop-shadow(0 0 45px rgba(220,38,38,0.25))',
          duration: 0.15,
          ease: 'sine.inOut',
        },
        0.3
      );

      // Light sweep glides over the face
      tl.to(
        lightSweepRef.current,
        {
          xPercent: 150,
          opacity: 0.8,
          duration: 0.2,
          ease: 'power2.inOut',
        },
        0.28
      );

      // 45 - 60%: Camera moves closer; headline typography begins appearing word by word
      tl.to(
        batImgRef.current,
        {
          scale: 1.16,
          duration: 0.15,
          ease: 'power1.out',
        },
        0.45
      );

      tl.to(
        word1Ref.current, // BUILT
        {
          opacity: 1,
          y: 0,
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.08,
          ease: 'power3.out',
        },
        0.45
      );

      tl.to(
        word2Ref.current, // FOR
        {
          opacity: 1,
          y: 0,
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.08,
          ease: 'power3.out',
        },
        0.5
      );

      tl.to(
        word3Ref.current, // THE
        {
          opacity: 1,
          y: 0,
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.08,
          ease: 'power3.out',
        },
        0.55
      );

      // 60 - 75%: MOMENT. hits with maximum dominant visual impact
      tl.to(
        word4Ref.current, // MOMENT.
        {
          opacity: 1,
          y: 0,
          scale: 1,
          letterSpacing: '0.02em',
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.12,
          ease: 'expo.out',
        },
        0.6
      );

      // Subcopy and CTAs emerge
      tl.to(
        [subcopyRef.current, ctaGroupRef.current],
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.1,
          ease: 'power2.out',
        },
        0.68
      );

      // 75 - 90%: Bat moves sideways to allow full visual balance with typography
      tl.to(
        batImgRef.current,
        {
          x: window.innerWidth < 768 ? 40 : 180,
          scale: 1.22,
          rotation: -4,
          duration: 0.15,
          ease: 'power2.inOut',
        },
        0.75
      );

      // 90 - 100%: Section begins setting up for the next scene (The Impact)
      tl.to(
        [batImgRef.current, textContainerRef.current],
        {
          opacity: 0.95,
          scale: 1.05,
          duration: 0.1,
          ease: 'sine.in',
        },
        0.9
      );
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${prefersReducedMotion ? 'min-h-screen' : 'h-[320vh]'}`}
    >
      {/* Sticky Fullscreen Stage */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-[#050505] flex items-center justify-center select-none"
      >
        {/* Background Atmospheric Canvas: Floating studio dust */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Ambient Volumetric Backlight & Studio Horizon */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Top volumetric spotlight shaft */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[900px] bg-gradient-to-b from-white/[0.07] via-red-950/[0.04] to-transparent rounded-full blur-3xl transform -rotate-12" />
          
          {/* Central bat rim highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[650px] bg-red-600/[0.04] rounded-full blur-[100px]" />

          {/* Bottom horizon floor shadow */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        {/* 2.5D Interactive Bat Container */}
        <div
          ref={batWrapperRef}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transform-gpu"
        >
          <div className="relative w-full max-w-[480px] sm:max-w-[560px] md:max-w-[680px] lg:max-w-[760px] h-[75vh] sm:h-[82vh] flex items-center justify-center">
            
            {/* The Cricket Bat Master Asset */}
            <img
              ref={batImgRef}
              src={cinematicBatImg}
              alt="SSD Sports Master English Willow Cricket Bat"
              className={`w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transform-gpu will-change-transform ${
                prefersReducedMotion ? 'opacity-100 scale-100' : ''
              }`}
            />

            {/* Dynamic Angled Light Sweep Element over Wood Grain */}
            <div
              ref={lightSweepRef}
              className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none mix-blend-overlay transform -skew-x-12 blur-sm"
            />
          </div>
        </div>

        {/* Cinematic Headline & Copy Overlay */}
        <div
          ref={textContainerRef}
          className="relative z-30 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 pointer-events-auto"
        >
          <div className="max-w-2xl text-left space-y-5 sm:space-y-6">
            
            {/* Brand Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-neutral-300 uppercase">
                SSD SPORTS PRO SERIES
              </span>
            </div>

            {/* Primary Headline: BUILT / FOR / THE / MOMENT. */}
            <h1 className="font-['Syne',sans-serif] font-black uppercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.88] tracking-tight text-white flex flex-col">
              
              <span ref={word1Ref} className="block overflow-hidden py-0.5">
                <span className="block text-neutral-300">BUILT</span>
              </span>

              <span ref={word2Ref} className="block overflow-hidden py-0.5">
                <span className="block text-neutral-400">FOR</span>
              </span>

              <span ref={word3Ref} className="block overflow-hidden py-0.5">
                <span className="block text-neutral-300">THE</span>
              </span>

              <span ref={word4Ref} className="block overflow-hidden py-1">
                <span className="block bg-gradient-to-r from-white via-neutral-100 to-red-500 bg-clip-text text-transparent filter drop-shadow-[0_4px_25px_rgba(220,38,38,0.4)]">
                  MOMENT.
                </span>
              </span>

            </h1>

            {/* Secondary Copy */}
            <p
              ref={subcopyRef}
              className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-md font-normal leading-relaxed tracking-wide pt-2"
            >
              Equipment engineered for players who don’t wait for the moment. Designed for impact.
            </p>

            {/* CTA Button Group */}
            <div
              ref={ctaGroupRef}
              className="flex flex-wrap items-center gap-4 pt-4 sm:pt-6"
            >
              {/* Primary CTA */}
              <Link
                to="/catalog"
                className="group relative inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:bg-red-600 hover:text-white shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_10px_30px_rgba(220,38,38,0.4)] active:scale-95 cursor-pointer"
              >
                <span>EXPLORE THE COLLECTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>

              {/* Secondary CTA */}
              <Link
                to="/catalog?collection=cricket-bats"
                className="inline-flex items-center px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.12] hover:border-white/[0.3] text-neutral-300 hover:text-white font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 cursor-pointer backdrop-blur-sm"
              >
                <span>SHOP BATS</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Ambient Scroll Cue Indicator at bottom center */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none text-neutral-500 animate-bounce"
        >
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">SCROLL TO WITNESS</span>
          <ChevronDown className="w-4 h-4 stroke-[1.5]" />
        </div>

      </div>
    </div>
  );
}
