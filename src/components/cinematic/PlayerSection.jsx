import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Eye, Wind, Disc } from 'lucide-react';
import playerStanceImg from '../../assets/cricket_player_stance_crease.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function PlayerSection() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const stadiumBgRef = useRef(null);
  const floodlightRef = useRef(null);
  const telemetryBadgeRef = useRef(null);
  const detailsGroupRef = useRef(null);
  const ballRef = useRef(null);
  const climaxTextRef = useRef(null);

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
      // 320vh Master Pinned Camera Stage Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          pin: stage,
          anticipatePin: 1,
        },
      });

      // Initial State: Pitch dark stadium, dormant floodlight, dormant ball
      gsap.set(stadiumBgRef.current, {
        opacity: 0.1,
        scale: 1.05,
        filter: 'brightness(0.2) contrast(1.3)',
      });
      gsap.set(floodlightRef.current, { opacity: 0, scaleY: 0.6 });
      gsap.set(telemetryBadgeRef.current, { opacity: 0, y: -20 });
      gsap.set(detailsGroupRef.current, { opacity: 0, y: 30 });
      gsap.set(ballRef.current, {
        opacity: 0,
        x: 180,
        y: -40,
        scale: 0.4,
        rotation: 0,
      });
      gsap.set(climaxTextRef.current, { opacity: 0, y: 60, scale: 0.96 });

      // -------------------------------------------------------------------
      // 00–15%: The Empty Stadium
      // Darkness lifts, overhead floodlight cuts through stadium mist
      // -------------------------------------------------------------------
      tl.to(
        floodlightRef.current,
        { opacity: 0.9, scaleY: 1, duration: 0.2, ease: 'power2.out' },
        0
      );

      tl.to(
        stadiumBgRef.current,
        {
          opacity: 0.5,
          filter: 'brightness(0.6) contrast(1.2)',
          duration: 0.2,
          ease: 'power1.out',
        },
        0.05
      );

      tl.to(
        telemetryBadgeRef.current,
        { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
        0.08
      );

      // -------------------------------------------------------------------
      // 15–40%: Player Silhouette & Walk to Crease
      // Camera approaches, batsman takes position over the turf
      // -------------------------------------------------------------------
      tl.to(
        stadiumBgRef.current,
        {
          opacity: 1,
          scale: 1.0,
          filter: 'brightness(0.95) contrast(1.15)',
          duration: 0.25,
          ease: 'sine.inOut',
        },
        0.18
      );

      // -------------------------------------------------------------------
      // 40–65%: Human Details & Focused Stillness
      // Hands tighten on grip, spikes settle, breathing indicator emerges
      // -------------------------------------------------------------------
      tl.to(
        detailsGroupRef.current,
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        0.4
      );

      // -------------------------------------------------------------------
      // 65–85%: The Ball Approaches (Time Dilation)
      // Ball enters with trajectory, rotation slows near the player
      // -------------------------------------------------------------------
      tl.to(
        detailsGroupRef.current,
        { opacity: 0, y: -20, duration: 0.15, ease: 'power1.in' },
        0.62
      );

      tl.to(
        ballRef.current,
        {
          opacity: 0.95,
          x: 0,
          y: 0,
          scale: 1.1,
          rotation: 360,
          duration: 0.25,
          ease: 'power2.out',
        },
        0.65
      );

      // -------------------------------------------------------------------
      // 85–100%: The Climax — "EVERYTHING LEADS HERE."
      // Ball suspends, camera pulls back, monumental headline resolves
      // -------------------------------------------------------------------
      tl.to(
        ballRef.current,
        {
          opacity: 0.3,
          scale: 0.8,
          duration: 0.15,
          ease: 'power1.in',
        },
        0.85
      );

      tl.to(
        stadiumBgRef.current,
        {
          scale: 0.98,
          filter: 'brightness(0.4) contrast(1.3)',
          duration: 0.15,
          ease: 'power2.inOut',
        },
        0.85
      );

      tl.to(
        climaxTextRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'expo.out' },
        0.86
      );
    }, container);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      id="act-player"
      className={`relative w-full ${prefersReducedMotion ? 'min-h-screen py-24' : 'h-[320vh]'} bg-[#050505] text-white`}
    >
      {/* Pinned Cinematic Stadium Stage */}
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-[#050505] flex items-center justify-center select-none"
      >
        {/* Full-bleed Stadium Backdrop: Master Crease Silhouette Photography */}
        <div
          ref={stadiumBgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 transform-gpu will-change-transform"
        >
          <img
            src={playerStanceImg}
            alt="Anonymous professional batsman focused at the crease in stadium floodlight"
            className="w-full h-full object-cover object-center filter"
          />
          {/* Subtle Ambient Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/70 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/70 via-transparent to-[#050505]/70 pointer-events-none" />
        </div>

        {/* Overhead Volumetric Stadium Floodlight Beam */}
        <div
          ref={floodlightRef}
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[1000px] bg-gradient-to-b from-white/20 via-cyan-500/[0.04] to-transparent rounded-full blur-3xl pointer-events-none z-10 transform-gpu"
        />

        {/* Top Minimal Telemetry Badge */}
        <div
          ref={telemetryBadgeRef}
          className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-center pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-300 uppercase">
              ACT 06 — THE PLAYER
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
            MATCH STATE // ZERO TOLERANCE
          </span>
        </div>

        {/* Subtle Human Concentration & Focus Telemetry Readout (Desktop & Tablet) */}
        <div
          ref={detailsGroupRef}
          className="absolute bottom-16 sm:bottom-20 left-6 sm:left-12 lg:left-20 z-30 flex flex-col gap-3 pointer-events-none max-w-sm"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/80 border border-white/[0.1] backdrop-blur-xl space-y-2 shadow-2xl">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase">
              <Eye className="w-3.5 h-3.5" />
              <span>THE MIND AT 22 YARDS</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
              Heart rate steady. Hands relaxed over the grip. The entire stadium fades away until only the seam exists.
            </p>
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-neutral-500 border-t border-white/[0.06]">
              <span className="flex items-center gap-1.5">
                <Wind className="w-3 h-3 text-neutral-400" />
                <span>BREATHING: CONTROLLED</span>
              </span>
              <span className="text-white font-bold">STANCE: LOCKED</span>
            </div>
          </div>
        </div>

        {/* The Suspended Leather Cricket Ball (Time Dilation Element) */}
        <div
          ref={ballRef}
          className="absolute top-1/2 right-[18%] sm:right-[26%] -translate-y-1/2 z-20 pointer-events-none transform-gpu will-change-transform"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-600 via-red-800 to-red-950 shadow-[0_0_40px_rgba(220,38,38,0.7)] flex items-center justify-center border border-white/20">
            {/* Raised Seam Line */}
            <div className="w-full h-[3px] bg-white/90 transform -rotate-45 shadow-[0_0_8px_white]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
          </div>
          {/* Subtle Speed Trace Ring */}
          <div className="absolute -inset-2 rounded-full border border-red-500/30 animate-ping pointer-events-none" />
        </div>

        {/* The Climax Statement Overlay (90–100%) */}
        <div
          ref={climaxTextRef}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-auto px-6 text-center"
        >
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.12] text-neutral-300 text-xs font-mono tracking-[0.25em] uppercase backdrop-blur-md">
              <Disc className="w-3.5 h-3.5 text-red-500" />
              <span>THE HUMAN FACTOR</span>
            </div>

            <h2 className="font-['Syne',sans-serif] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase text-white tracking-tight leading-[0.88]">
              EVERYTHING <br />
              <span className="bg-gradient-to-r from-white via-neutral-200 to-red-500 bg-clip-text text-transparent filter drop-shadow-[0_4px_30px_rgba(220,38,38,0.5)]">
                LEADS HERE.
              </span>
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-lg mx-auto font-normal leading-relaxed">
              The bat is not the hero. The technology is not the hero. The kit is not the hero. <span className="text-white font-semibold">You are.</span>
            </p>

            <div className="pt-4">
              <Link
                to="/catalog"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 hover:bg-red-600 hover:text-white shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_10px_30px_rgba(220,38,38,0.4)] active:scale-95 cursor-pointer"
              >
                <span>FIND YOUR EDGE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
